/**
 * Caret boot component
 *
 * A systemd-style sequential loader. Each step has a label and an async
 * task. Caret renders all steps at once, marks the active one, runs the
 * task, transitions to done/failed, then advances. Visible scrollback —
 * the user sees the whole boot sequence at the end.
 *
 *   await boot({
 *     steps: [
 *       { label: 'Loading configuration', task: () => loadConfig() },
 *       { label: 'Connecting to API',     task: () => connect() },
 *       { label: 'Warming caches',        task: () => warmCaches() },
 *     ],
 *   })
 *
 * Output (mid-flight):
 *   ✓ Loading configuration
 *   ✓ Connecting to API
 *   ⠙ Warming caches
 *
 * Per manifesto: no `[  OK  ]` badges — symbols carry the meaning,
 * labels stay in plain body text. Matches the step component's idiom.
 *
 * Auto-degrades to a one-pass plain log under non-TTY.
 */

import React, { useState, useEffect } from 'react'
import { Box, Text, render } from 'ink'
import { ThemeProvider, useTheme } from '../theme/index.js'
import type { PartialTheme } from '../theme/types.js'
import { notifyDone, notifyError } from '../lib/notify.js'

export type BootStepStatus = 'pending' | 'active' | 'done' | 'failed' | 'skipped'

export type BootStep = {
  label: string
  task: () => void | Promise<void>
}

type BootViewProps = {
  steps: ReadonlyArray<BootStep>
  statuses: ReadonlyArray<BootStepStatus>
}

function BootView({ steps, statuses }: BootViewProps) {
  const theme = useTheme()
  const [tick, setTick] = useState<number>(0)

  // Animate the active step's spinner frame
  useEffect(() => {
    if (!statuses.includes('active')) return
    const interval = setInterval(() => setTick((t) => t + 1), 80)
    return () => clearInterval(interval)
  }, [statuses])

  const spinnerFrames = theme.symbols.spinner.braille

  return (
    <Box flexDirection="column">
      {steps.map((s, i) => {
        const status = statuses[i] ?? 'pending'
        let symbol: string
        let symbolColor: string | undefined
        let dim = false

        if (status === 'done') {
          symbol = theme.symbols.state.success
          symbolColor = theme.colors.semantic.success.ansi
        } else if (status === 'failed') {
          symbol = theme.symbols.state.failure
          symbolColor = theme.colors.semantic.danger.ansi
        } else if (status === 'skipped') {
          symbol = theme.symbols.state.cancelled
          dim = true
        } else if (status === 'active') {
          symbol = spinnerFrames[tick % spinnerFrames.length]!
          symbolColor = theme.colors.accent.default
        } else {
          symbol = theme.symbols.marker.unselected
          dim = true
        }

        const failed = status === 'failed'

        return (
          <Box key={i}>
            <Text color={symbolColor} dimColor={dim}>
              {symbol}
            </Text>
            <Text color={failed ? theme.colors.semantic.danger.ansi : undefined} dimColor={dim}>
              {' '}
              {s.label}
            </Text>
          </Box>
        )
      })}
    </Box>
  )
}

export type BootOptions = {
  steps: ReadonlyArray<BootStep>
  /** Stop running remaining steps after a failure. Default: true. */
  stopOnError?: boolean
  /**
   * Fire an OS notification when boot completes (success or failure).
   * Pass `true` for defaults, or an object with a `threshold` in ms —
   * the notification only fires if boot took longer than the threshold.
   * Default: false.
   */
  notifyOnComplete?: boolean | { threshold?: number }
  theme?: PartialTheme
}

export async function boot(options: BootOptions): Promise<void> {
  const startTime = Date.now()
  const stopOnError = options.stopOnError !== false
  const statuses: BootStepStatus[] = options.steps.map(() => 'pending')

  const app = render(
    <ThemeProvider theme={options.theme}>
      <BootView steps={options.steps} statuses={statuses} />
    </ThemeProvider>,
  )

  const rerender = () => {
    app.rerender(
      <ThemeProvider theme={options.theme}>
        <BootView steps={options.steps} statuses={[...statuses]} />
      </ThemeProvider>,
    )
  }

  let firstError: unknown = null

  for (let i = 0; i < options.steps.length; i++) {
    if (firstError && stopOnError) {
      statuses[i] = 'skipped'
      rerender()
      continue
    }

    statuses[i] = 'active'
    rerender()

    try {
      await options.steps[i]!.task()
      statuses[i] = 'done'
      rerender()
    } catch (err) {
      statuses[i] = 'failed'
      rerender()
      if (firstError === null) firstError = err
    }
  }

  app.unmount()

  // ── Notify on complete ──────────────────────────────────
  if (options.notifyOnComplete) {
    const elapsed = Date.now() - startTime
    const threshold =
      typeof options.notifyOnComplete === 'object' && options.notifyOnComplete.threshold !== undefined
        ? options.notifyOnComplete.threshold
        : 5_000
    if (elapsed >= threshold) {
      try {
        if (firstError !== null) {
          await notifyError('Boot failed')
        } else {
          await notifyDone('Boot complete')
        }
      } catch {
        // best-effort
      }
    }
  }

  if (firstError !== null) {
    throw firstError
  }
}
