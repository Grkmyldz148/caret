import { describe, it, expect } from 'vitest'
import { pad, visibleLength, truncate } from '../paint.js'

describe('pad', () => {
  it('left-pads to target width by default', () => {
    expect(pad('hi', 5)).toBe('hi   ')
  })

  it('right-aligns when align=right', () => {
    expect(pad('hi', 5, 'right')).toBe('   hi')
  })

  it('center-aligns when align=center', () => {
    expect(pad('hi', 6, 'center')).toBe('  hi  ')
  })

  it('returns the string unchanged when already at target width', () => {
    expect(pad('hello', 5)).toBe('hello')
  })

  it('returns the string unchanged when longer than target width', () => {
    expect(pad('hello world', 5)).toBe('hello world')
  })
})

describe('visibleLength', () => {
  it('returns plain string length for ASCII', () => {
    expect(visibleLength('hello')).toBe(5)
  })

  it('strips ANSI escape sequences', () => {
    expect(visibleLength('\x1b[31mhello\x1b[0m')).toBe(5)
  })

  it('handles empty string', () => {
    expect(visibleLength('')).toBe(0)
  })
})

describe('truncate', () => {
  it('returns the string unchanged if already short enough', () => {
    expect(truncate('hello', 10)).toBe('hello')
  })

  it('truncates with ellipsis if too long', () => {
    expect(truncate('hello world', 8)).toBe('hello w…')
  })

  it('uses custom ellipsis character', () => {
    expect(truncate('hello world', 8, '...')).toBe('hello...')
  })
})
