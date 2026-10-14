import { normalizeText } from "./normalizeText.js";

const MIN_QUOTE_WORDS = 5;
const MAX_QUOTE_WORDS = 50;

function countWords(text: string): number {
  return text.split(" ").filter(Boolean).length;
}

export function verifyQuote(sourceText: string, quote: string): boolean {
  const normalizedQuote = normalizeText(quote);
  const normalizedSource = normalizeText(sourceText);
  const quoteWordCount = countWords(normalizedQuote);

  if (quoteWordCount < MIN_QUOTE_WORDS || quoteWordCount > MAX_QUOTE_WORDS) {
    return false;
  }

  return normalizedSource.includes(normalizedQuote);
}
