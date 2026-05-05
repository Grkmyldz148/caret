import { describe, it, expect } from 'vitest'
import chalk from 'chalk'
import {
  tracking,
  trackingLength,
  dottedLeader,
  leaderAt,
} from '../typography.js'

describe('tracking', () => {
  it('spaces each letter of a single word', () => {
    expect(tracking('Caret')).toBe('C A R E T')
  })

  it('uppercases mixed-case input', () => {
    expect(tracking('deploying')).toBe('D E P L O Y I N G')
    expect(tracking('DePlOy')).toBe('D E P L O Y')
  })

  it('handles multi-word strings — existing spaces become inter-letter spaces', () => {
    // "A B" → "A   B" (A, space-between-letters, space-from-original, space-between-letters, B)
    // Actually: split('').join(' ') on "AB" → "A B"; on "A B" → "A   B" (3 spaces: one after A, the original space, one before B)
    expect(tracking('Ab')).toBe('A B')
    expect(tracking('Caret CLI')).toBe('C A R E T   C L I')
  })

  it('returns empty string for empty input', () => {
    expect(tracking('')).toBe('')
  })

  it('returns a single letter unchanged (no trailing space)', () => {
    expect(tracking('x')).toBe('X')
  })

  it('handles punctuation and symbols verbatim', () => {
    expect(tracking('y/n')).toBe('Y / N')
    expect(tracking('confirm?')).toBe('C O N F I R M ?')
  })
})

describe('trackingLength', () => {
  it('returns 0 for empty input', () => {
    expect(trackingLength('')).toBe(0)
  })

  it('returns 1 for a single character', () => {
    expect(trackingLength('x')).toBe(1)
  })

  it('returns 2N - 1 for an N-character input', () => {
    expect(trackingLength('ab')).toBe(3)     // "A B"
    expect(trackingLength('caret')).toBe(9)  // "C A R E T"
  })

  it('matches the actual length of tracking() output', () => {
    const inputs = ['', 'x', 'caret', 'deploying', 'y/n']
    for (const input of inputs) {
      expect(trackingLength(input)).toBe(tracking(input).length)
    }
  })
})

describe('dottedLeader', () => {
  it('fills the gap with middle dots by default', () => {
    const row = dottedLeader('Region', 'us-east-1', { width: 30 })
    expect(row.length).toBe(30)
    expect(row.startsWith('Region ')).toBe(true)
    expect(row.endsWith(' us-east-1')).toBe(true)
    // Between label+space and space+value there is a run of '·'
    expect(row).toMatch(/Region ·+ us-east-1/)
  })

  it('respects a custom dot character', () => {
    const row = dottedLeader('Name', 'John', { width: 20, dot: '.' })
    expect(row.length).toBe(20)
    expect(row).toMatch(/Name \.+ John/)
  })

  it('enforces minDots when label and value overflow the target width', () => {
    // label(5) + value(5) + 2 pad = 12, width 10 — already overflowing
    const row = dottedLeader('Hello', 'World', { width: 10 })
    expect(row).toBe('Hello ··· World')
  })

  it('enforces a custom minDots value', () => {
    const row = dottedLeader('Hi', 'Bye', { width: 5, minDots: 5 })
    expect(row).toBe('Hi ····· Bye')
  })

  it('allows flush leader with pad: 0', () => {
    const row = dottedLeader('A', 'B', { width: 5, pad: 0 })
    // width 5 - 1 - 1 - 0 = 3 dots
    expect(row).toBe('A···B')
    expect(row.length).toBe(5)
  })

  it('ignores ANSI color escapes when computing width', () => {
    const coloredLabel = chalk.dim('Region')
    const coloredValue = chalk.bold('us-east-1')
    const row = dottedLeader(coloredLabel, coloredValue, { width: 30 })
    // The visible length is still 30, even though the raw string is longer
    // because of escape sequences.
    const plain = row.replace(/\x1b\[[0-9;]*m/g, '')
    expect(plain.length).toBe(30)
  })
})

describe('leaderAt', () => {
  it('anchors the dot column regardless of label length', () => {
    const a = leaderAt('Region',      'us-east-1', 16, 40)
    const b = leaderAt('Environment', 'prod',      16, 40)
    // The dot run starts at column 16 in both rows.
    expect(a.indexOf('·')).toBe(16)
    expect(b.indexOf('·')).toBe(16)
  })

  it('produces rows with consistent width', () => {
    const a = leaderAt('Region',      'us-east-1', 16, 40)
    const b = leaderAt('Environment', 'prod',      16, 40)
    expect(a.length).toBe(40)
    expect(b.length).toBe(40)
  })

  it('still enforces minDots', () => {
    const row = leaderAt('VeryLongLabelName', 'value', 8, 20)
    // Label already exceeds labelCol; leader should still exist (minDots)
    expect(row).toContain('···')
    expect(row.endsWith('value')).toBe(true)
  })
})
