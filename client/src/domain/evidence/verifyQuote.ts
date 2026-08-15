const MIN_QUOTE_WORDS = 5
const MAX_QUOTE_WORDS = 50

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

export function verifyQuote(sourceText: string, quote: string): boolean {
  const quoteWordCount = countWords(quote)

  if (quoteWordCount < MIN_QUOTE_WORDS || quoteWordCount > MAX_QUOTE_WORDS) {
    return false
  }

  return sourceText.includes(quote)
}
