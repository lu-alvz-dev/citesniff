import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { PdfDownloadError } from "../../src/services/sourceProcessing/downloadPdfFromUrl.js";

const { downloadPdfFromUrlMock, extractPdfTextMock } = vi.hoisted(() => ({
  downloadPdfFromUrlMock: vi.fn(),
  extractPdfTextMock: vi.fn(),
}));

vi.mock(
  "../../src/services/sourceProcessing/downloadPdfFromUrl.js",
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import("../../src/services/sourceProcessing/downloadPdfFromUrl.js")
      >();

    return {
      ...actual,
      downloadPdfFromUrl: downloadPdfFromUrlMock,
    };
  },
);

vi.mock("../../src/services/sourceProcessing/extractPdfText.js", () => ({
  extractPdfText: extractPdfTextMock,
}));

describe("POST /api/sources/url", () => {
  const sourceUrl = "https://example.com/document.pdf";

  const pdfData = new Uint8Array([37, 80, 68, 70, 45]);

  const extractedPages = [
    {
      pageNumber: 1,
      text: "This is sample text extracted from a PDF document.",
    },
    {
      pageNumber: 2,
      text: "This is the second page of the PDF document.",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    downloadPdfFromUrlMock.mockResolvedValue(pdfData);
    extractPdfTextMock.mockResolvedValue(extractedPages);
  });

  it("downloads a PDF and returns its extracted text and source URL", async () => {
    const response = await request(app)
      .post("/api/sources/url")
      .send({ url: sourceUrl });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      sourceUrl,
      pageCount: 2,
      pages: extractedPages,
    });

    expect(downloadPdfFromUrlMock).toHaveBeenCalledOnce();
    expect(downloadPdfFromUrlMock).toHaveBeenCalledWith(sourceUrl);

    expect(extractPdfTextMock).toHaveBeenCalledOnce();
    expect(extractPdfTextMock).toHaveBeenCalledWith(pdfData);
  });

  it("rejects a request without a URL", async () => {
    const response = await request(app).post("/api/sources/url").send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");

    expect(downloadPdfFromUrlMock).not.toHaveBeenCalled();
    expect(extractPdfTextMock).not.toHaveBeenCalled();
  });

  it("rejects URLs that do not use HTTP or HTTPS", async () => {
    const response = await request(app)
      .post("/api/sources/url")
      .send({ url: "ftp://example.com/document.pdf" });

    expect(response.status).toBe(400);

    expect(downloadPdfFromUrlMock).not.toHaveBeenCalled();
    expect(extractPdfTextMock).not.toHaveBeenCalled();
  });

  it("rejects URLs containing credentials", async () => {
    const response = await request(app)
      .post("/api/sources/url")
      .send({ url: "https://user:password@example.com/document.pdf" });

    expect(response.status).toBe(400);

    expect(downloadPdfFromUrlMock).not.toHaveBeenCalled();
    expect(extractPdfTextMock).not.toHaveBeenCalled();
  });

  it.each([
    {
      code: "UNSAFE_ADDRESS",
      expectedStatus: 400,
    },
    {
      code: "DOWNLOAD_TOO_LARGE",
      expectedStatus: 413,
    },
    {
      code: "INVALID_PDF",
      expectedStatus: 422,
    },
    {
      code: "UPSTREAM_ERROR",
      expectedStatus: 502,
    },
    {
      code: "TOO_MANY_REDIRECTS",
      expectedStatus: 502,
    },
    {
      code: "DOWNLOAD_TIMEOUT",
      expectedStatus: 504,
    },
  ] as const)(
    "returns HTTP $expectedStatus when the download fails with $code",
    async ({ code, expectedStatus }) => {
      downloadPdfFromUrlMock.mockRejectedValueOnce(
        new PdfDownloadError("PDF download failed.", code),
      );

      const response = await request(app)
        .post("/api/sources/url")
        .send({ url: sourceUrl });

      expect(response.status).toBe(expectedStatus);
      expect(response.body).toMatchObject({
        error: "PDF download failed.",
        code,
      });

      expect(extractPdfTextMock).not.toHaveBeenCalled();
    },
  );

  it("returns 422 when PDF text extraction fails", async () => {
    extractPdfTextMock.mockRejectedValueOnce(
      new Error("PDF extraction failed."),
    );

    const response = await request(app)
      .post("/api/sources/url")
      .send({ url: sourceUrl });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: "Could not extract text from the PDF source",
    });
  });
});
