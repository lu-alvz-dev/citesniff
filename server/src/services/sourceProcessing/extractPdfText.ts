import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

export interface ExtractedPdfPage {
  pageNumber: number;
  text: string;
}

interface PdfTextItem {
  str: string;
  transform: number[];
  width: number;
  height: number;
  hasEOL: boolean;
  dir: string;
  fontName: string;
}

export function reconstructPdfText(items: PdfTextItem[]): string {
  let text = "";

  for (let index = 0; index < items.length; index += 1) {
    const current = items[index];

    if (!current) {
      continue;
    }

    const previous = items[index - 1];

    if (previous) {
      const previousX = previous.transform[4] ?? 0;
      const currentX = current.transform[4] ?? 0;
      const previousY = previous.transform[5] ?? 0;
      const currentY = current.transform[5] ?? 0;

      const lineHeight = Math.max(previous.height, current.height);
      const lineChanged = Math.abs(previousY - currentY) > lineHeight * 0.5;

      if (previous.hasEOL || lineChanged) {
        text += "\n";
      } else {
        const previousEndX = previousX + previous.width;
        const horizontalGap = currentX - previousEndX;
        const spaceThreshold = lineHeight * 0.2;

        const hasExistingSpace =
          /\s$/.test(previous.str) || /^\s/.test(current.str);

        if (horizontalGap > spaceThreshold && !hasExistingSpace) {
          text += " ";
        }
      }
    }

    text += current.str;
  }

  return text.trim();
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

      const textItems = textContent.items.filter(
        (item): item is PdfTextItem => "str" in item,
      );

      pages.push({
        pageNumber,
        text: reconstructPdfText(textItems),
      });
    }

    return pages;
  } finally {
    await loadingTask.destroy();
  }
}
