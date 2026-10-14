import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { extractPdfText } from "../../../src/services/sourceProcessing/extractPdfText.js";

describe("extractPdfText", () => {
  it("extracts text and preserves page numbers", async () => {
    const pdfBuffer = await readFile(
      new URL("../../fixtures/sample.pdf", import.meta.url),
    );

    const pdfData = new Uint8Array(pdfBuffer);
    const pages = await extractPdfText(pdfData);

    expect(pages).toHaveLength(2);
    expect(pages[0]?.pageNumber).toBe(1);
    expect(pages[0]?.text).toContain("CiteSniff PDF extraction test page one.");
    expect(pages[1]?.pageNumber).toBe(2);
    expect(pages[1]?.text).toContain("Second page preserves its page number.");
  });

  it("rejects invalid PDF data", async () => {
    const invalidPdfData = new Uint8Array([1, 2, 3]);

    await expect(extractPdfText(invalidPdfData)).rejects.toThrow();
  });
});
