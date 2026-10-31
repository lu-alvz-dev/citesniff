import { MockAgent } from "undici";
import { describe, expect, it } from "vitest";
import {
  downloadPdfFromUrl,
  PdfDownloadError,
} from "../../../src/services/sourceProcessing/downloadPdfFromUrl.js";

const pdfBytes = new TextEncoder().encode(
  "%PDF-1.7\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF",
);

describe("downloadPdfFromUrl", () => {
  it("rejects an invalid URL", async () => {
    await expect(downloadPdfFromUrl("not-a-url")).rejects.toMatchObject({
      name: "PdfDownloadError",
      code: "INVALID_URL",
    });
  });

  it("rejects URLs that use unsupported protocols", async () => {
    await expect(
      downloadPdfFromUrl("ftp://example.com/document.pdf"),
    ).rejects.toMatchObject({
      name: "PdfDownloadError",
      code: "INVALID_URL",
    });
  });

  it("rejects URLs containing credentials", async () => {
    await expect(
      downloadPdfFromUrl("https://user:password@example.com/document.pdf"),
    ).rejects.toMatchObject({
      name: "PdfDownloadError",
      code: "INVALID_URL",
    });
  });

  it("rejects localhost addresses", async () => {
    await expect(
      downloadPdfFromUrl("http://127.0.0.1/document.pdf"),
    ).rejects.toMatchObject({
      name: "PdfDownloadError",
      code: "UNSAFE_ADDRESS",
    });
  });

  it("rejects private IPv4 addresses", async () => {
    await expect(
      downloadPdfFromUrl("http://192.168.1.10/document.pdf"),
    ).rejects.toMatchObject({
      name: "PdfDownloadError",
      code: "UNSAFE_ADDRESS",
    });
  });

  it("rejects private IPv6 addresses", async () => {
    await expect(
      downloadPdfFromUrl("http://[::1]/document.pdf"),
    ).rejects.toMatchObject({
      name: "PdfDownloadError",
      code: "UNSAFE_ADDRESS",
    });
  });

  it.each([
    ["link-local IPv4", "http://169.254.1.1/document.pdf"],
    ["carrier-grade NAT IPv4", "http://100.64.0.1/document.pdf"],
    ["reserved IPv4", "http://192.0.2.1/document.pdf"],
    ["multicast IPv4", "http://224.0.0.1/document.pdf"],
    ["unique-local IPv6", "http://[fc00::1]/document.pdf"],
    ["link-local IPv6", "http://[fe80::1]/document.pdf"],
    ["reserved IPv6", "http://[2001:db8::1]/document.pdf"],
  ])("rejects %s addresses", async (_description, url) => {
    await expect(downloadPdfFromUrl(url)).rejects.toMatchObject({
      name: "PdfDownloadError",
      code: "UNSAFE_ADDRESS",
    });
  });

  it("exposes a specific error code on download errors", () => {
    const error = new PdfDownloadError(
      "The source URL is invalid.",
      "INVALID_URL",
    );

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("PdfDownloadError");
    expect(error.code).toBe("INVALID_URL");
    expect(error.message).toBe("The source URL is invalid.");
  });

  it("downloads a PDF from a public IP using a mocked HTTP response", async () => {
    const mockAgent = new MockAgent();
    mockAgent.disableNetConnect();

    mockAgent
      .get("https://8.8.8.8")
      .intercept({
        path: "/document.pdf",
        method: "GET",
      })
      .reply(200, Buffer.from(pdfBytes), {
        headers: {
          "content-type": "application/pdf",
        },
      });

    try {
      const result = await downloadPdfFromUrl("https://8.8.8.8/document.pdf", {
        dispatcher: mockAgent,
      });

      expect(result).toEqual(pdfBytes);
    } finally {
      await mockAgent.close();
    }
  });

  it("rejects an HTML response instead of treating it as a PDF", async () => {
    const mockAgent = new MockAgent();
    mockAgent.disableNetConnect();

    mockAgent
      .get("https://8.8.8.8")
      .intercept({
        path: "/document.pdf",
        method: "GET",
      })
      .reply(200, "<html>Not a PDF</html>", {
        headers: {
          "content-type": "text/html",
        },
      });

    try {
      await expect(
        downloadPdfFromUrl("https://8.8.8.8/document.pdf", {
          dispatcher: mockAgent,
        }),
      ).rejects.toMatchObject({
        name: "PdfDownloadError",
        code: "INVALID_PDF",
      });
    } finally {
      await mockAgent.close();
    }
  });

  it("rejects an unsuccessful HTTP response", async () => {
    const mockAgent = new MockAgent();
    mockAgent.disableNetConnect();

    mockAgent
      .get("https://8.8.8.8")
      .intercept({
        path: "/document.pdf",
        method: "GET",
      })
      .reply(404, "Not Found");

    try {
      await expect(
        downloadPdfFromUrl("https://8.8.8.8/document.pdf", {
          dispatcher: mockAgent,
        }),
      ).rejects.toMatchObject({
        name: "PdfDownloadError",
        code: "UPSTREAM_ERROR",
      });
    } finally {
      await mockAgent.close();
    }
  });

  it("rejects a response with PDF content type but invalid PDF signature", async () => {
    const mockAgent = new MockAgent();
    mockAgent.disableNetConnect();

    mockAgent
      .get("https://8.8.8.8")
      .intercept({
        path: "/document.pdf",
        method: "GET",
      })
      .reply(200, "This is not a PDF document.", {
        headers: {
          "content-type": "application/pdf",
        },
      });

    try {
      await expect(
        downloadPdfFromUrl("https://8.8.8.8/document.pdf", {
          dispatcher: mockAgent,
        }),
      ).rejects.toMatchObject({
        name: "PdfDownloadError",
        code: "INVALID_PDF",
      });
    } finally {
      await mockAgent.close();
    }
  });

  it("rejects redirects to private IP addresses", async () => {
    const mockAgent = new MockAgent();
    mockAgent.disableNetConnect();

    mockAgent
      .get("https://8.8.8.8")
      .intercept({
        path: "/document.pdf",
        method: "GET",
      })
      .reply(302, "", {
        headers: {
          location: "http://127.0.0.1/internal.pdf",
        },
      });

    try {
      await expect(
        downloadPdfFromUrl("https://8.8.8.8/document.pdf", {
          dispatcher: mockAgent,
        }),
      ).rejects.toMatchObject({
        name: "PdfDownloadError",
        code: "UNSAFE_ADDRESS",
      });
    } finally {
      await mockAgent.close();
    }
  });

  it("rejects responses that exceed the redirect limit", async () => {
    const mockAgent = new MockAgent();
    mockAgent.disableNetConnect();

    const origin = mockAgent.get("https://8.8.8.8");

    origin
      .intercept({
        path: "/redirect-1",
        method: "GET",
      })
      .reply(302, "", {
        headers: {
          location: "/redirect-2",
        },
      });

    origin
      .intercept({
        path: "/redirect-2",
        method: "GET",
      })
      .reply(302, "", {
        headers: {
          location: "/redirect-3",
        },
      });

    origin
      .intercept({
        path: "/redirect-3",
        method: "GET",
      })
      .reply(302, "", {
        headers: {
          location: "/redirect-4",
        },
      });

    origin
      .intercept({
        path: "/redirect-4",
        method: "GET",
      })
      .reply(302, "", {
        headers: {
          location: "/redirect-5",
        },
      });

    try {
      await expect(
        downloadPdfFromUrl("https://8.8.8.8/redirect-1", {
          dispatcher: mockAgent,
        }),
      ).rejects.toMatchObject({
        name: "PdfDownloadError",
        code: "TOO_MANY_REDIRECTS",
      });
    } finally {
      await mockAgent.close();
    }
  });

  it("rejects a PDF whose declared content length exceeds 10 MiB", async () => {
    const mockAgent = new MockAgent();
    mockAgent.disableNetConnect();

    mockAgent
      .get("https://8.8.8.8")
      .intercept({
        path: "/document.pdf",
        method: "GET",
      })
      .reply(200, "", {
        headers: {
          "content-type": "application/pdf",
          "content-length": String(10 * 1024 * 1024 + 1),
        },
      });

    try {
      await expect(
        downloadPdfFromUrl("https://8.8.8.8/document.pdf", {
          dispatcher: mockAgent,
        }),
      ).rejects.toMatchObject({
        name: "PdfDownloadError",
        code: "DOWNLOAD_TOO_LARGE",
      });
    } finally {
      await mockAgent.close();
    }
  });

  it("rejects a streamed PDF body that exceeds 10 MiB", async () => {
    const mockAgent = new MockAgent();
    mockAgent.disableNetConnect();

    const oversizedPdf = Buffer.concat([
      Buffer.from("%PDF-1.7\n"),
      Buffer.alloc(10 * 1024 * 1024),
    ]);

    mockAgent
      .get("https://8.8.8.8")
      .intercept({
        path: "/document.pdf",
        method: "GET",
      })
      .reply(200, oversizedPdf, {
        headers: {
          "content-type": "application/pdf",
        },
      });

    try {
      await expect(
        downloadPdfFromUrl("https://8.8.8.8/document.pdf", {
          dispatcher: mockAgent,
        }),
      ).rejects.toMatchObject({
        name: "PdfDownloadError",
        code: "DOWNLOAD_TOO_LARGE",
      });
    } finally {
      await mockAgent.close();
    }
  });
});
