import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { capability, refreshCapability } from '../capability.js'

const ENV_KEYS = ['NO_COLOR', 'CARET_REDUCED_MOTION', 'CARET_NO_NOTIFY', 'TERM', 'COLORTERM']

describe('capability', () => {
  const originalEnv: Record<string, string | undefined> = {}

  beforeEach(() => {
    for (const k of ENV_KEYS) originalEnv[k] = process.env[k]
  })

  afterEach(() => {
    for (const k of ENV_KEYS) {
      if (originalEnv[k] === undefined) delete process.env[k]
      else process.env[k] = originalEnv[k]
    }
    refreshCapability()
  })

  it('returns a Capability object with the expected shape', () => {
    refreshCapability()
    const cap = capability()
    expect(cap).toHaveProperty('isTTY')
    expect(cap).toHaveProperty('truecolor')
    expect(cap).toHaveProperty('hasColor')
    expect(cap).toHaveProperty('noColor')
    expect(cap).toHaveProperty('reducedMotion')
    expect(cap).toHaveProperty('columns')
    expect(cap).toHaveProperty('rows')
  })

  it('respects NO_COLOR env var', () => {
    process.env['NO_COLOR'] = '1'
    const cap = refreshCapability()
    expect(cap.noColor).toBe(true)
    expect(cap.hasColor).toBe(false)
  })

  it('does not consider NO_COLOR set when empty', () => {
    process.env['NO_COLOR'] = ''
    const cap = refreshCapability()
    expect(cap.noColor).toBe(false)
  })

  it('respects CARET_REDUCED_MOTION=1', () => {
    process.env['CARET_REDUCED_MOTION'] = '1'
    const cap = refreshCapability()
    expect(cap.reducedMotion).toBe(true)
  })

  it('respects CARET_NO_NOTIFY=1', () => {
    process.env['CARET_NO_NOTIFY'] = '1'
    const cap = refreshCapability()
    expect(cap.noNotify).toBe(true)
  })

  it('detects truecolor from COLORTERM=truecolor', () => {
    delete process.env['NO_COLOR']
    process.env['TERM'] = 'xterm-256color'
    process.env['COLORTERM'] = 'truecolor'
    const cap = refreshCapability()
    expect(cap.truecolor).toBe(true)
  })

  it('detects 256 color from TERM=xterm-256color', () => {
    delete process.env['NO_COLOR']
    process.env['TERM'] = 'xterm-256color'
    process.env['COLORTERM'] = ''
    const cap = refreshCapability()
    expect(cap.color256).toBe(true)
  })

  it('marks dumb terminal correctly', () => {
    process.env['TERM'] = 'dumb'
    const cap = refreshCapability()
    expect(cap.dumb).toBe(true)
  })

  it('flags narrow terminals (<40 cols)', () => {
    const originalCols = process.stdout.columns
    Object.defineProperty(process.stdout, 'columns', { value: 30, writable: true, configurable: true })
    const cap = refreshCapability()
    expect(cap.narrow).toBe(true)
    Object.defineProperty(process.stdout, 'columns', { value: originalCols, writable: true, configurable: true })
  })
})
