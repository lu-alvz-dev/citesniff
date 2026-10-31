import { lookup as dnsLookup } from "node:dns/promises";
import type { LookupAddress, LookupOptions } from "node:dns";
import { isIP } from "node:net";
import { Agent, buildConnector, fetch, type Dispatcher } from "undici";
import * as ipaddr from "ipaddr.js";

const MAX_DOWNLOAD_SIZE = 10 * 1024 * 1024;
const REQUEST_TIMEOUT_MS = 15_000;
const MAX_REDIRECTS = 3;

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

type DownloadErrorCode =
  | "INVALID_URL"
  | "UNSAFE_ADDRESS"
  | "TOO_MANY_REDIRECTS"
  | "DOWNLOAD_TOO_LARGE"
  | "INVALID_PDF"
  | "UPSTREAM_ERROR"
  | "DOWNLOAD_TIMEOUT";

export class PdfDownloadError extends Error {
  constructor(
    message: string,
    public readonly code: DownloadErrorCode,
  ) {
    super(message);
    this.name = "PdfDownloadError";
  }
}

function normalizeHostname(hostname: string): string {
  return hostname.replace(/^\[|\]$/g, "").toLowerCase();
}

function isPublicAddress(address: string): boolean {
  try {
    const parsedAddress = ipaddr.parse(address);

    if (parsedAddress.kind() === "ipv6") {
      const ipv6Address = parsedAddress as ipaddr.IPv6;

      if (ipv6Address.isIPv4MappedAddress()) {
        return ipv6Address.toIPv4Address().range() === "unicast";
      }
    }

    return parsedAddress.range() === "unicast";
  } catch {
    return false;
  }
}

function validateUrl(value: string): URL {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new PdfDownloadError("The source URL is invalid.", "INVALID_URL");
  }

  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username !== "" ||
    url.password !== "" ||
    url.hostname === ""
  ) {
    throw new PdfDownloadError(
      "Only HTTP and HTTPS URLs without credentials are allowed.",
      "INVALID_URL",
    );
  }

  return url;
}

async function resolvePublicAddress(hostname: string): Promise<LookupAddress> {
  const normalizedHostname = normalizeHostname(hostname);

  let addresses: LookupAddress[];

  if (isIP(normalizedHostname) !== 0) {
    addresses = [
      {
        address: normalizedHostname,
        family: isIP(normalizedHostname),
      },
    ];
  } else {
    try {
      addresses = await dnsLookup(normalizedHostname, {
        all: true,
        verbatim: true,
      });
    } catch {
      throw new PdfDownloadError(
        "The source hostname could not be resolved.",
        "UPSTREAM_ERROR",
      );
    }
  }

  if (
    addresses.length === 0 ||
    addresses.some(({ address }) => !isPublicAddress(address))
  ) {
    throw new PdfDownloadError(
      "The source hostname resolves to an unsafe address.",
      "UNSAFE_ADDRESS",
    );
  }

  // Pin the connection to one of the addresses we have validated.
  return addresses[0]!;
}

function createPinnedAgent(
  hostname: string,
  pinnedAddress: LookupAddress,
): Agent {
  const expectedHostname = normalizeHostname(hostname);

  const pinnedLookup = (
    requestedHostname: string,
    options: LookupOptions,
    callback: (
      error: NodeJS.ErrnoException | null,
      address: string | LookupAddress[],
      family?: number,
    ) => void,
  ): void => {
    if (normalizeHostname(requestedHostname) !== expectedHostname) {
      const error = Object.assign(
        new Error("Unexpected hostname in connection request."),
        { code: "ENOTFOUND" },
      );

      callback(error, "");
      return;
    }

    if (options.all) {
      callback(null, [pinnedAddress]);
      return;
    }

    callback(null, pinnedAddress.address, pinnedAddress.family);
  };

  return new Agent({
    connect: buildConnector({
      lookup: pinnedLookup,
    }),
    connections: 1,
    pipelining: 0,
  });
}

async function readLimitedBody(
  response: Awaited<ReturnType<typeof fetch>>,
  signal: AbortSignal,
): Promise<Uint8Array> {
  const contentLength = response.headers.get("content-length");

  if (contentLength !== null) {
    const declaredLength = Number(contentLength);

    if (Number.isFinite(declaredLength) && declaredLength > MAX_DOWNLOAD_SIZE) {
      await response.body?.cancel();

      throw new PdfDownloadError(
        "The PDF exceeds the 10 MiB download limit.",
        "DOWNLOAD_TOO_LARGE",
      );
    }
  }

  if (response.body === null) {
    throw new PdfDownloadError(
      "The source returned an empty response.",
      "UPSTREAM_ERROR",
    );
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      if (signal.aborted) {
        throw new PdfDownloadError(
          "The PDF download timed out.",
          "DOWNLOAD_TIMEOUT",
        );
      }

      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      totalBytes += value.byteLength;

      if (totalBytes > MAX_DOWNLOAD_SIZE) {
        await reader.cancel();

        throw new PdfDownloadError(
          "The PDF exceeds the 10 MiB download limit.",
          "DOWNLOAD_TOO_LARGE",
        );
      }

      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const result = new Uint8Array(totalBytes);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return result;
}

function verifyPdfSignature(data: Uint8Array): void {
  const signature = new TextDecoder().decode(data.subarray(0, 5));

  if (signature !== "%PDF-") {
    throw new PdfDownloadError(
      "The downloaded file is not a valid PDF.",
      "INVALID_PDF",
    );
  }
}

export async function downloadPdfFromUrl(
  sourceUrl: string,
  options: { dispatcher?: Dispatcher } = {},
): Promise<Uint8Array> {
  const signal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  let currentUrl = validateUrl(sourceUrl);

  for (let redirectCount = 0; ; redirectCount += 1) {
    if (signal.aborted) {
      throw new PdfDownloadError(
        "The PDF download timed out.",
        "DOWNLOAD_TIMEOUT",
      );
    }

    const pinnedAddress = await resolvePublicAddress(currentUrl.hostname);
    const agent =
      options.dispatcher ??
      createPinnedAgent(currentUrl.hostname, pinnedAddress);

    try {
      const response = await fetch(currentUrl, {
        dispatcher: agent,
        redirect: "manual",
        signal,
        headers: {
          accept: "application/pdf, application/octet-stream;q=0.9",
        },
      });

      if (REDIRECT_STATUSES.has(response.status)) {
        const location = response.headers.get("location");

        await response.body?.cancel();

        if (location === null) {
          throw new PdfDownloadError(
            "The source returned a redirect without a destination.",
            "UPSTREAM_ERROR",
          );
        }

        if (redirectCount >= MAX_REDIRECTS) {
          throw new PdfDownloadError(
            "The source exceeded the redirect limit.",
            "TOO_MANY_REDIRECTS",
          );
        }

        let redirectUrl: URL;

        try {
          redirectUrl = new URL(location, currentUrl);
        } catch {
          throw new PdfDownloadError(
            "The source returned an invalid redirect URL.",
            "UPSTREAM_ERROR",
          );
        }

        currentUrl = validateUrl(redirectUrl.href);
        continue;
      }

      if (!response.ok) {
        await response.body?.cancel();

        throw new PdfDownloadError(
          `The source returned HTTP ${response.status}.`,
          "UPSTREAM_ERROR",
        );
      }

      const contentType = response.headers.get("content-type");

      if (
        contentType !== null &&
        !["application/pdf", "application/octet-stream"].includes(
          contentType.split(";")[0]!.trim().toLowerCase(),
        )
      ) {
        await response.body?.cancel();

        throw new PdfDownloadError(
          "The source did not return a PDF-compatible content type.",
          "INVALID_PDF",
        );
      }

      const data = await readLimitedBody(response, signal);

      verifyPdfSignature(data);

      return data;
    } catch (error) {
      if (signal.aborted) {
        throw new PdfDownloadError(
          "The PDF download timed out.",
          "DOWNLOAD_TIMEOUT",
        );
      }

      if (error instanceof PdfDownloadError) {
        throw error;
      }

      throw new PdfDownloadError(
        "The PDF could not be downloaded.",
        "UPSTREAM_ERROR",
      );
    } finally {
      if (options.dispatcher === undefined) {
        await agent.close();
      }
    }
  }
}
