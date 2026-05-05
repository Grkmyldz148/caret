import { describe, it, expect } from 'vitest'
import { mergeTheme } from '../merge.js'
import { defaultTheme } from '../default.js'

describe('mergeTheme', () => {
  it('returns the base theme unchanged when override is undefined', () => {
    const result = mergeTheme(defaultTheme, undefined)
    expect(result).toBe(defaultTheme)
  })

  it('shallowly overrides a top-level color', () => {
    const result = mergeTheme(defaultTheme, {
      colors: { accent: { default: '#FF0000' } },
    })
    expect(result.colors.accent.default).toBe('#FF0000')
    // Other accent fields preserved
    expect(result.colors.accent.muted).toBe(defaultTheme.colors.accent.muted)
  })

  it('does not mutate the base theme', () => {
    const originalAccent = defaultTheme.colors.accent.default
    mergeTheme(defaultTheme, {
      colors: { accent: { default: '#FF0000' } },
    })
    expect(defaultTheme.colors.accent.default).toBe(originalAccent)
  })

  it('preserves unrelated nested values', () => {
    const result = mergeTheme(defaultTheme, {
      symbols: { anchor: '◆' },
    })
    expect(result.symbols.anchor).toBe('◆')
    expect(result.symbols.prefix.focused).toBe(defaultTheme.symbols.prefix.focused)
    expect(result.colors).toEqual(defaultTheme.colors)
  })

  it('overrides motion duration values', () => {
    const result = mergeTheme(defaultTheme, {
      motion: { duration: { default: 500 } },
    })
    expect(result.motion.duration.default).toBe(500)
    expect(result.motion.duration.quick).toBe(defaultTheme.motion.duration.quick)
  })

  it('overrides multiple branches at once', () => {
    const result = mergeTheme(defaultTheme, {
      colors: {
        accent: { default: '#00FF00' },
        semantic: { danger: { ansi: 'magenta' } },
      },
    })
    expect(result.colors.accent.default).toBe('#00FF00')
    expect(result.colors.semantic.danger.ansi).toBe('magenta')
    expect(result.colors.semantic.danger.truecolor).toBe(
      defaultTheme.colors.semantic.danger.truecolor,
    )
  })
})
