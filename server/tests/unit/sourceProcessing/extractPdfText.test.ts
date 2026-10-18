import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import {
  extractPdfText,
  reconstructPdfText,
} from "../../../src/services/sourceProcessing/extractPdfText.js";

describe("reconstructPdfText", () => {
  it("does not insert a space inside a split word", () => {
    const items = [
      {
        str: "on",
        transform: [24, 0, 0, 24, 85, 698],
        width: 20,
        height: 24,
        hasEOL: false,
        dir: "ltr",
        fontName: "Times-Roman",
      },
      {
        str: "e.",
        transform: [24, 0, 0, 24, 105.1, 698],
        width: 20,
        height: 24,
        hasEOL: false,
        dir: "ltr",
        fontName: "Times-Roman",
      },
    ];

    expect(reconstructPdfText(items)).toBe("one.");
  });

  it("inserts a space between fragments separated by a gap", () => {
    const items = [
      {
        str: "Evidence",
        transform: [12, 0, 0, 12, 50, 700],
        width: 45,
        height: 12,
        hasEOL: false,
        dir: "ltr",
        fontName: "Times-Roman",
      },
      {
        str: "matters",
        transform: [12, 0, 0, 12, 100, 700],
        width: 42,
        height: 12,
        hasEOL: false,
        dir: "ltr",
        fontName: "Times-Roman",
      },
    ];

    expect(reconstructPdfText(items)).toBe("Evidence matters");
  });

  it("preserves line breaks", () => {
    const items = [
      {
        str: "First line",
        transform: [12, 0, 0, 12, 50, 700],
        width: 55,
        height: 12,
        hasEOL: true,
        dir: "ltr",
        fontName: "Times-Roman",
      },
      {
        str: "Second line",
        transform: [12, 0, 0, 12, 50, 680],
        width: 65,
        height: 12,
        hasEOL: false,
        dir: "ltr",
        fontName: "Times-Roman",
      },
    ];

    expect(reconstructPdfText(items)).toBe("First line\nSecond line");
  });
});

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
