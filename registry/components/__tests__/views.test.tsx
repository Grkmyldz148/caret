/**
 * Render-smoke tests for the remaining interactive Caret components.
 *
 * Each test mounts the component's exported View through ink-testing-
 * library and verifies the initial frame contains the expected labels /
 * structure. Where input handling can be exercised through plain-ASCII
 * keys (printable chars, Enter, Tab, Space) the test drives a flow and
 * asserts on `onResolve` / `onComplete`.
 *
 * Known limitation — escape sequences (arrow keys, ESC) reach the
 * `useInput` handler reliably for the prompt variants but not for some
 * of these top-level views (modal, slider, tabs, accordion) under the
 * ink-testing-library + ink v5 combination. Behaviour tests that
 * specifically exercise ←/→/ESC on those views are therefore deferred
 * to a Phase-3 pass that swaps out the test runtime; the components
 * themselves are exercised via `examples/kitchen-sink.tsx` for
 * end-to-end verification.
 *
 * The eight prompt variants are exhaustively tested in
 * `interactive.test.tsx`.
 */

import React from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { render } from 'ink-testing-library'

import { ThemeProvider } from '../../theme/index.js'
import { ToastView } from '../toast.js'
import { ModalView } from '../modal.js'
import { SearchView } from '../search.js'
import { FormView } from '../form.js'
import { TabsView } from '../tabs.js'
import { AccordionView } from '../accordion.js'
import { SliderView } from '../slider.js'
import { ToggleView } from '../toggle.js'

// ── Keys (plain-ASCII only — see header note) ───────────────────────

const ENTER = '\r'
const TAB = '\t'

// ── Helpers ─────────────────────────────────────────────────────────

function strip(s: string): string {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: ANSI strip
  return s.replace(/\x1b\[[0-9;?]*[A-Za-z]/g, '').replace(/\x1b[()=>]./g, '')
}

const tick = (ms = 80): Promise<void> => new Promise((r) => setTimeout(r, ms))

async function mount(node: React.ReactElement) {
  const r = render(node)
  await tick(120) // ink subscribes to stdin asynchronously after first render
  return r
}

function deferred<T>(): { promise: Promise<T>; resolve: (v: T) => void } {
  let resolve!: (v: T) => void
  const promise = new Promise<T>((res) => {
    resolve = res
  })
  return { promise, resolve }
}

let mounted: ReturnType<typeof render> | undefined

beforeEach(() => {
  mounted = undefined
})

afterEach(() => {
  mounted?.unmount()
})

// ── ToastView ───────────────────────────────────────────────────────

describe('ToastView', () => {
  it('renders the message for each kind', async () => {
    for (const kind of ['info', 'success', 'warning', 'error'] as const) {
      const r = render(
        <ThemeProvider>
          <ToastView
            kind={kind}
            message={`hello-${kind}`}
            duration={9999}
            onComplete={() => {}}
          />
        </ThemeProvider>,
      )
      await tick(40)
      expect(strip(r.lastFrame() ?? '')).toContain(`hello-${kind}`)
      r.unmount()
    }
  })

  it('fires onComplete when duration elapses', async () => {
    const d = deferred<void>()
    mounted = render(
      <ThemeProvider>
        <ToastView
          kind="info"
          message="vanish"
          duration={120}
          onComplete={() => d.resolve()}
        />
      </ThemeProvider>,
    )
    await d.promise // resolves without timeout means onComplete fired
  })
})

// ── ModalView ───────────────────────────────────────────────────────

describe('ModalView', () => {
  it('renders title (tracked caps), body, and action labels', async () => {
    mounted = await mount(
      <ThemeProvider>
        <ModalView
          title="Confirm deploy"
          body="Are you sure you want to deploy to production?"
          actions={[
            { value: 'cancel', label: 'Cancel' },
            { value: 'confirm', label: 'Confirm' },
          ]}
          onResolve={() => {}}
        />
      </ThemeProvider>,
    )
    const f = strip(mounted.lastFrame() ?? '')
    expect(f).toContain('C O N F I R M   D E P L O Y')
    expect(f).toContain('Are you sure')
    expect(f).toContain('Cancel')
    expect(f).toContain('Confirm')
  })

  it('Enter resolves the default action', async () => {
    const d = deferred<string | null>()
    mounted = await mount(
      <ThemeProvider>
        <ModalView
          title="OK?"
          actions={[
            { value: 'no', label: 'No' },
            { value: 'yes', label: 'Yes' },
          ]}
          defaultAction={1}
          onResolve={d.resolve}
        />
      </ThemeProvider>,
    )
    mounted.stdin.write(ENTER)
    expect(await d.promise).toBe('yes')
  })
})

// ── SearchView ──────────────────────────────────────────────────────

describe('SearchView', () => {
  const items = [
    { value: 'web', label: 'web-frontend', description: 'react' },
    { value: 'api', label: 'api-server', description: 'fastify' },
    { value: 'wkr', label: 'worker-queue', description: 'bullmq' },
  ] as const

  it('renders every item initially', async () => {
    mounted = await mount(
      <ThemeProvider>
        <SearchView items={items} onResolve={() => {}} />
      </ThemeProvider>,
    )
    const f = strip(mounted.lastFrame() ?? '')
    expect(f).toContain('web-frontend')
    expect(f).toContain('api-server')
    expect(f).toContain('worker-queue')
  })

  it('filters as the user types and resolves the highlighted match', async () => {
    const d = deferred<string | null>()
    mounted = await mount(
      <ThemeProvider>
        <SearchView items={items} onResolve={d.resolve} />
      </ThemeProvider>,
    )
    mounted.stdin.write('worker')
    await tick(120)
    const f = strip(mounted.lastFrame() ?? '')
    expect(f).toContain('worker-queue')
    expect(f).not.toContain('web-frontend')
    mounted.stdin.write(ENTER)
    expect(await d.promise).toBe('wkr')
  })
})

// ── FormView ────────────────────────────────────────────────────────

describe('FormView', () => {
  it('renders every field label', async () => {
    mounted = await mount(
      <ThemeProvider>
        <FormView
          title="New project"
          fields={[
            { name: 'name', label: 'Project name', type: 'text' },
            {
              name: 'env',
              label: 'Environment',
              type: 'select',
              options: [
                { value: 'staging', label: 'Staging' },
                { value: 'prod', label: 'Production' },
              ],
            },
            { name: 'auth', label: 'Enable auth', type: 'confirm', default: true },
          ]}
          onResolve={() => {}}
        />
      </ThemeProvider>,
    )
    const f = strip(mounted.lastFrame() ?? '')
    expect(f).toContain('Project name')
    expect(f).toContain('Environment')
    expect(f).toContain('Enable auth')
    expect(f).toContain('Yes')
    expect(f).toContain('No')
  })

  it('Tab advances between text fields', async () => {
    mounted = await mount(
      <ThemeProvider>
        <FormView
          fields={[
            { name: 'a', label: 'Field A', type: 'text' },
            { name: 'b', label: 'Field B', type: 'text' },
          ]}
          onResolve={() => {}}
        />
      </ThemeProvider>,
    )
    mounted.stdin.write('alpha')
    await tick()
    expect(strip(mounted.lastFrame() ?? '')).toContain('alpha')
    mounted.stdin.write(TAB)
    await tick()
    mounted.stdin.write('beta')
    await tick()
    const f = strip(mounted.lastFrame() ?? '')
    expect(f).toContain('alpha')
    expect(f).toContain('beta')
  })
})

// ── TabsView ────────────────────────────────────────────────────────

describe('TabsView', () => {
  const items = [
    { value: 'a', label: 'Overview' },
    { value: 'b', label: 'Logs' },
    { value: 'c', label: 'Settings' },
  ] as const

  it('renders every tab label', async () => {
    mounted = await mount(
      <ThemeProvider>
        <TabsView items={items} onResolve={() => {}} />
      </ThemeProvider>,
    )
    const f = strip(mounted.lastFrame() ?? '')
    expect(f).toContain('Overview')
    expect(f).toContain('Logs')
    expect(f).toContain('Settings')
  })

  it('Enter resolves the tab at defaultIndex', async () => {
    const d = deferred<string | null>()
    mounted = await mount(
      <ThemeProvider>
        <TabsView items={items} defaultIndex={2} onResolve={d.resolve} />
      </ThemeProvider>,
    )
    mounted.stdin.write(ENTER)
    expect(await d.promise).toBe('c')
  })
})

// ── AccordionView ───────────────────────────────────────────────────

describe('AccordionView', () => {
  const sections = [
    { title: 'Database', content: 'db-content' },
    { title: 'Authentication', content: 'auth-content' },
    { title: 'Notifications', content: 'notify-content' },
  ] as const

  it('renders every section title', async () => {
    mounted = await mount(
      <ThemeProvider>
        <AccordionView sections={sections} onExit={() => {}} />
      </ThemeProvider>,
    )
    const f = strip(mounted.lastFrame() ?? '')
    expect(f).toContain('Database')
    expect(f).toContain('Authentication')
    expect(f).toContain('Notifications')
  })

  it("'q' shortcut calls onExit", async () => {
    const d = deferred<void>()
    mounted = await mount(
      <ThemeProvider>
        <AccordionView sections={sections} onExit={() => d.resolve()} />
      </ThemeProvider>,
    )
    mounted.stdin.write('q')
    await d.promise
  })
})

// ── SliderView ──────────────────────────────────────────────────────

describe('SliderView', () => {
  it('renders the label and the initial value', async () => {
    mounted = await mount(
      <ThemeProvider>
        <SliderView
          label="Volume"
          min={0}
          max={100}
          step={5}
          defaultValue={50}
          onResolve={() => {}}
        />
      </ThemeProvider>,
    )
    const f = strip(mounted.lastFrame() ?? '')
    expect(f).toContain('Volume')
    expect(f).toContain('50')
  })

  it('Enter resolves the current value', async () => {
    const d = deferred<number | null>()
    mounted = await mount(
      <ThemeProvider>
        <SliderView
          label="Volume"
          min={0}
          max={100}
          defaultValue={42}
          onResolve={d.resolve}
        />
      </ThemeProvider>,
    )
    mounted.stdin.write(ENTER)
    expect(await d.promise).toBe(42)
  })
})

// ── ToggleView ──────────────────────────────────────────────────────

describe('ToggleView', () => {
  it('renders the label', async () => {
    mounted = await mount(
      <ThemeProvider>
        <ToggleView
          label="Notifications"
          defaultValue={true}
          onResolve={() => {}}
        />
      </ThemeProvider>,
    )
    expect(strip(mounted.lastFrame() ?? '')).toContain('Notifications')
  })

  it('space toggles and Enter resolves the new value', async () => {
    const d = deferred<boolean | null>()
    mounted = await mount(
      <ThemeProvider>
        <ToggleView
          label="Beta features"
          defaultValue={false}
          onResolve={d.resolve}
        />
      </ThemeProvider>,
    )
    mounted.stdin.write(' ')
    await tick()
    mounted.stdin.write(ENTER)
    expect(await d.promise).toBe(true)
  })
})
