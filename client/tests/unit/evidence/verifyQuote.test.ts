import { describe, expect, it } from 'vitest'
import { verifyQuote } from '../../../src/domain/evidence/verifyQuote'

describe('verifyQuote', () => {
  it('accepts an exact quotation that exists in the source', () => {
    const sourceText =
      'Constructivist learning emphasizes the active participation of learners in building knowledge.'

    const quote =
      'Constructivist learning emphasizes the active participation of learners'

    expect(verifyQuote(sourceText, quote)).toBe(true)
  })

  it('rejects a quotation that does not exist in the source', () => {
    const sourceText =
      'Constructivist learning emphasizes the active participation of learners in building knowledge.'

    const quote =
      'Constructivist learning requires students to memorize information'

    expect(verifyQuote(sourceText, quote)).toBe(false)
  })

  it('rejects quotations shorter than five words', () => {
    const sourceText = 'Evidence must be traceable to the original source.'

    const quote = 'Evidence must be traceable'

    expect(verifyQuote(sourceText, quote)).toBe(false)
  })

  it('rejects quotations longer than fifty words', () => {
    const sourceText = 'A '.repeat(60)

    const quote = 'A '.repeat(51)

    expect(verifyQuote(sourceText, quote)).toBe(false)
  })
})
