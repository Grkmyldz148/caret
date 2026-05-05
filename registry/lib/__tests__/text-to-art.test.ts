import { describe, it, expect } from 'vitest'
import { textToArt } from '../text-to-art.js'

describe('textToArt', () => {
  it('returns a multi-line string for simple input', () => {
    const result = textToArt('hi')
    expect(typeof result).toBe('string')
    expect(result.split('\n').length).toBeGreaterThan(1)
  })

  it('uses ANSI Shadow font by default', () => {
    const result = textToArt('a')
    // ANSI Shadow contains box-drawing characters
    expect(result).toMatch(/[█╗╝]/)
  })

  it('falls back to plain text on totally invalid font', () => {
    // Pass a font that doesn't exist; should fall back to Standard or plain text
    const result = textToArt('x', { font: 'this-font-does-not-exist-12345' })
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('handles empty string without crashing', () => {
    const result = textToArt('')
    expect(typeof result).toBe('string')
  })
})
