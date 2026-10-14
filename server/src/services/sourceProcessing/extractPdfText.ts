import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

export interface ExtractedPdfPage {
  pageNumber: number;
  text: string;
}

export async function extractPdfText(
  pdfData: Uint8Array,
): Promise<ExtractedPdfPage[]> {
  const loadingTask = getDocument({ data: pdfData });

  try {
    const pdf = await loadingTask.promise;
    const pages: ExtractedPdfPage[] = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();

      const text = textContent.items
        .filter((item) => "str" in item)
        .map((item) => item.str)
        .join("")
        .trim();

      pages.push({ pageNumber, text });
    }

    return pages;
  } finally {
    await loadingTask.destroy();
  }
}
