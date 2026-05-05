/**
 * Interactive Ink-component behavior tests.
 *
 * These tests render Caret prompt components directly with
 * ink-testing-library and simulate keypresses, instead of going
 * through the public Promise-returning wrapper. The wrapper just
 * mounts the same React component via Ink's `render()` — testing
 * the component is testing the wrapper minus the I/O glue.
 */

import React from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { render } from 'ink-testing-library'

import { ThemeProvider } from '../../theme/index.js'
import { PromptText } from '../prompt/text.js'
import { PromptPassword } from '../prompt/password.js'
import { PromptNumber } from '../prompt/number.js'
import { PromptConfirm } from '../prompt/confirm.js'
import { PromptSelect } from '../prompt/select.js'
import { PromptMultiSelect } from '../prompt/multi-select.js'
import { PromptAutocomplete } from '../prompt/autocomplete.js'
import { PromptEditor } from '../prompt/editor.js'

// ── Keys ────────────────────────────────────────────────────────────
//
// Arrow keys are CSI sequences: ESC + '[' + letter. Caret's prompts
// are wired through ink's `useInput`, which parses these the same way
// a real terminal sends them.

const ESC = ''
const ENTER = '\r'
const UP = `${ESC}[A`
const DOWN = `${ESC}[B`
const LEFT = `${ESC}[D`
const RIGHT = `${ESC}[C`
const TAB = '\t'
const BACKSPACE = ''
const CTRL_D = ''

// ── Helpers ─────────────────────────────────────────────────────────

function strip(s: string): string {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: ANSI strip
  return s.replace(/\x1b\[[0-9;?]*[A-Za-z]/g, '').replace(/\x1b[()=>]./g, '')
}

function deferred<T>(): { promise: Promise<T>; resolve: (v: T) => void } {
  let resolve!: (v: T) => void
  const promise = new Promise<T>((res) => {
    resolve = res
  })
  return { promise, resolve }
}

const tick = (ms = 60): Promise<void> => new Promise((r) => setTimeout(r, ms))

/**
 * Mount, wait for ink to subscribe to stdin (otherwise early writes
 * are dropped), then return the rendered handle.
 */
async function mount(node: React.ReactElement) {
  const r = render(node)
  await tick(80) // ink subscribes asynchronously after first render
  return r
}

let mounted: ReturnType<typeof render> | undefined

beforeEach(() => {
  mounted = undefined
})

afterEach(() => {
  mounted?.unmount()
})

// ── prompt.text ─────────────────────────────────────────────────────

describe('PromptText', () => {
  it('renders the label as tracked caps', async () => {
    const { resolve } = deferred<string | null>()
    mounted = await mount(
      <ThemeProvider>
        <PromptText label="Project name" onResolve={resolve} />
      </ThemeProvider>,
    )
    // Headers are rendered with the typography `tracking()` helper.
    expect(strip(mounted.lastFrame() ?? '')).toContain('P R O J E C T   N A M E')
  })

  it('captures typed input and resolves on Enter', async () => {
    const d = deferred<string | null>()
    mounted = await mount(
      <ThemeProvider>
        <PromptText label="Name" onResolve={d.resolve} />
      </ThemeProvider>,
    )
    mounted.stdin.write('caret')
    await tick()
    expect(strip(mounted.lastFrame() ?? '')).toContain('caret')
    mounted.stdin.write(ENTER)
    expect(await d.promise).toBe('caret')
  })

  it('resolves null when Escape is pressed', async () => {
    const d = deferred<string | null>()
    mounted = await mount(
      <ThemeProvider>
        <PromptText label="Name" onResolve={d.resolve} />
      </ThemeProvider>,
    )
    mounted.stdin.write(ESC)
    expect(await d.promise).toBeNull()
  })

  it('uses the default value when present', async () => {
    const d = deferred<string | null>()
    mounted = await mount(
      <ThemeProvider>
        <PromptText label="Region" default="us-east-1" onResolve={d.resolve} />
      </ThemeProvider>,
    )
    expect(strip(mounted.lastFrame() ?? '')).toContain('us-east-1')
    mounted.stdin.write(ENTER)
    expect(await d.promise).toBe('us-east-1')
  })

  it('runs validate and surfaces the error message', async () => {
    const d = deferred<string | null>()
    mounted = await mount(
      <ThemeProvider>
        <PromptText
          label="Name"
          validate={(v) => (v.length >= 3 ? null : 'too short')}
          onResolve={d.resolve}
        />
      </ThemeProvider>,
    )
    mounted.stdin.write('hi')
    await tick()
    mounted.stdin.write(ENTER)
    await tick(80)
    expect(strip(mounted.lastFrame() ?? '')).toContain('too short')
    // Add a third char and submit again — validate now passes.
    mounted.stdin.write('!')
    await tick()
    mounted.stdin.write(ENTER)
    expect(await d.promise).toBe('hi!')
  })
})

// ── prompt.password ─────────────────────────────────────────────────

describe('PromptPassword', () => {
  it('masks input but resolves the cleartext', async () => {
    const d = deferred<string | null>()
    mounted = await mount(
      <ThemeProvider>
        <PromptPassword label="Password" onResolve={d.resolve} />
      </ThemeProvider>,
    )
    mounted.stdin.write('s3cret')
    await tick()
    const frame = strip(mounted.lastFrame() ?? '')
    expect(frame).not.toContain('s3cret')
    // Mask glyph appears for each char (default '•', plus possible cursor block).
    expect(frame).toMatch(/[•*●·]/)
    mounted.stdin.write(ENTER)
    expect(await d.promise).toBe('s3cret')
  })
})

// ── prompt.number ───────────────────────────────────────────────────

describe('PromptNumber', () => {
  it('rejects non-numeric characters and resolves a real number', async () => {
    const d = deferred<number | null>()
    mounted = await mount(
      <ThemeProvider>
        <PromptNumber label="Port" onResolve={d.resolve} />
      </ThemeProvider>,
    )
    mounted.stdin.write('abc') // dropped
    await tick()
    expect(strip(mounted.lastFrame() ?? '')).not.toMatch(/abc/)
    mounted.stdin.write('42')
    await tick()
    mounted.stdin.write(ENTER)
    expect(await d.promise).toBe(42)
  })

  it('rejects an out-of-range value', async () => {
    const d = deferred<number | null>()
    mounted = await mount(
      <ThemeProvider>
        <PromptNumber label="Port" min={1} max={100} onResolve={d.resolve} />
      </ThemeProvider>,
    )
    mounted.stdin.write('200')
    await tick()
    mounted.stdin.write(ENTER)
    await tick(80)
    // The component shows a bounded-range complaint of some kind.
    expect(strip(mounted.lastFrame() ?? '')).toMatch(/(must|max|range|≤|<=|between|100)/i)
    mounted.unmount()
  })
})

// ── prompt.confirm ──────────────────────────────────────────────────

describe('PromptConfirm', () => {
  it('toggles with arrow key and resolves the new value', async () => {
    const d = deferred<boolean | null>()
    mounted = await mount(
      <ThemeProvider>
        <PromptConfirm label="Deploy?" default={false} onResolve={d.resolve} />
      </ThemeProvider>,
    )
    mounted.stdin.write(LEFT) // toggle
    await tick()
    mounted.stdin.write(ENTER)
    expect(await d.promise).toBe(true)
  })

  it('y shortcut sets true and submits with Enter', async () => {
    const d = deferred<boolean | null>()
    mounted = await mount(
      <ThemeProvider>
        <PromptConfirm label="OK?" onResolve={d.resolve} />
      </ThemeProvider>,
    )
    mounted.stdin.write('y')
    await tick()
    mounted.stdin.write(ENTER)
    expect(await d.promise).toBe(true)
  })

  it('Escape resolves null', async () => {
    const d = deferred<boolean | null>()
    mounted = await mount(
      <ThemeProvider>
        <PromptConfirm label="OK?" onResolve={d.resolve} />
      </ThemeProvider>,
    )
    mounted.stdin.write(ESC)
    expect(await d.promise).toBeNull()
  })
})

// ── prompt.select ───────────────────────────────────────────────────

describe('PromptSelect', () => {
  const opts = [
    { value: 'staging', label: 'Staging' },
    { value: 'preview', label: 'Preview' },
    { value: 'prod', label: 'Production' },
  ] as const

  it('renders all options and resolves the highlighted one', async () => {
    const d = deferred<string | null>()
    mounted = await mount(
      <ThemeProvider>
        <PromptSelect label="Env" options={opts} onResolve={d.resolve} />
      </ThemeProvider>,
    )
    const frame = strip(mounted.lastFrame() ?? '')
    expect(frame).toContain('Staging')
    expect(frame).toContain('Preview')
    expect(frame).toContain('Production')
    mounted.stdin.write(DOWN)
    await tick()
    mounted.stdin.write(DOWN)
    await tick()
    mounted.stdin.write(ENTER)
    expect(await d.promise).toBe('prod')
  })

  it('honors a default value', async () => {
    const d = deferred<string | null>()
    mounted = await mount(
      <ThemeProvider>
        <PromptSelect
          label="Env"
          options={opts}
          default="preview"
          onResolve={d.resolve}
        />
      </ThemeProvider>,
    )
    mounted.stdin.write(ENTER)
    expect(await d.promise).toBe('preview')
  })

  it('wraps from last to first on ↓', async () => {
    const d = deferred<string | null>()
    mounted = await mount(
      <ThemeProvider>
        <PromptSelect
          label="Env"
          options={opts}
          default="prod"
          onResolve={d.resolve}
        />
      </ThemeProvider>,
    )
    mounted.stdin.write(DOWN)
    await tick()
    mounted.stdin.write(ENTER)
    expect(await d.promise).toBe('staging')
  })
})

// ── prompt.multi-select ─────────────────────────────────────────────

describe('PromptMultiSelect', () => {
  const opts = [
    { value: 'auth', label: 'Authentication' },
    { value: 'db', label: 'Database' },
    { value: 'mail', label: 'Email' },
  ] as const

  it('toggles selections with space and resolves the array', async () => {
    const d = deferred<readonly string[] | null>()
    mounted = await mount(
      <ThemeProvider>
        <PromptMultiSelect label="Modules" options={opts} onResolve={d.resolve} />
      </ThemeProvider>,
    )
    mounted.stdin.write(' ')
    await tick()
    mounted.stdin.write(DOWN)
    await tick()
    mounted.stdin.write(' ')
    await tick()
    mounted.stdin.write(ENTER)
    expect(await d.promise).toEqual(['auth', 'db'])
  })

  it('Escape resolves null', async () => {
    const d = deferred<readonly string[] | null>()
    mounted = await mount(
      <ThemeProvider>
        <PromptMultiSelect label="Modules" options={opts} onResolve={d.resolve} />
      </ThemeProvider>,
    )
    mounted.stdin.write(ESC)
    expect(await d.promise).toBeNull()
  })
})

// ── prompt.autocomplete ─────────────────────────────────────────────

describe('PromptAutocomplete', () => {
  const branches = [
    { value: 'main', label: 'main' },
    { value: 'develop', label: 'develop' },
    { value: 'feat/sounds', label: 'feat/sounds' },
    { value: 'fix/types', label: 'fix/types' },
  ] as const

  it('resolves the highlighted match after the user types and presses Enter', async () => {
    const d = deferred<string | null>()
    mounted = await mount(
      <ThemeProvider>
        <PromptAutocomplete label="Branch" options={branches} onResolve={d.resolve} />
      </ThemeProvider>,
    )
    mounted.stdin.write('feat')
    await tick(80)
    expect(strip(mounted.lastFrame() ?? '')).toContain('feat/sounds')
    mounted.stdin.write(ENTER)
    expect(await d.promise).toBe('feat/sounds')
  })
})

// ── prompt.editor ───────────────────────────────────────────────────

describe('PromptEditor', () => {
  it('captures multi-line input and submits on Ctrl+D', async () => {
    const d = deferred<string | null>()
    mounted = await mount(
      <ThemeProvider>
        <PromptEditor label="Commit message" onResolve={d.resolve} />
      </ThemeProvider>,
    )
    mounted.stdin.write('first line')
    await tick()
    mounted.stdin.write(ENTER)
    await tick()
    mounted.stdin.write('second line')
    await tick()
    mounted.stdin.write(CTRL_D)
    const out = await d.promise
    expect(out).toContain('first line')
    expect(out).toContain('second line')
  })
})
