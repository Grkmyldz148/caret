/**
 * Caret spinner component
 *
 * Wraps an async function with a braille rotation, success/failure
 * resolution, and optional system notification on completion.
 *
 * See specs/spinner.md for the full specification.
 */

import React, { useState, useEffect } from 'react'
import { Box, Text, render } from 'ink'
import { useTheme, ThemeProvider } from '../theme/index.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'
import { notifyDone, notifyError } from '../lib/notify.js'

type SpinnerStatus = 'spinning' | 'success' | 'failure' | 'cancelled'

type SpinnerViewProps = {
  label: string
  status: SpinnerStatus
  startTime: number
  suffixTime: boolean
}

function SpinnerView({ label, status, startTime, suffixTime }: SpinnerViewProps) {
  const theme = useTheme()
  const [frame, setFrame] = useState<number>(0)
  const [, setTick] = useState<number>(0)
  const [morphPhase, setMorphPhase] = useState<number>(0) // 0..1 progress for resolve morph

  useEffect(() => {
    if (status !== 'spinning') return
    const cap = capability()
    if (cap.reducedMotion || !cap.isTTY) return

    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % theme.symbols.spinner.braille.length)
      setTick((t) => t + 1)
    }, theme.motion.spinnerFrameMs)

    return () => clearInterval(interval)
  }, [status, theme.motion.spinnerFrameMs, theme.symbols.spinner.braille.length])

  // Morph animation when resolving from spinning → success/failure
  useEffect(() => {
    if (status === 'spinning') return
    const cap = capability()
    if (cap.reducedMotion || !cap.isTTY) {
      setMorphPhase(1)
      return
    }
    const start = Date.now()
    const duration = theme.motion.duration.default
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      const t = Math.min(elapsed / duration, 1)
      setMorphPhase(t)
      if (t >= 1) clearInterval(interval)
    }, 16)
    return () => clearInterval(interval)
  }, [status, theme.motion.duration.default])

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1) + 's'

  let symbol: string
  let symbolColor: string | undefined
  let dim = false

  if (status === 'spinning') {
    symbol = theme.symbols.spinner.braille[frame] ?? theme.symbols.spinner.braille[0] ?? '*'
    symbolColor = theme.colors.accent.default
  } else if (status === 'success') {
    // Morph: cycle through final braille frames before settling on ✓
    if (morphPhase < 0.6) {
      const morphFrameIdx =
        Math.floor(morphPhase * theme.symbols.spinner.braille.length * 1.5) %
        theme.symbols.spinner.braille.length
      symbol = theme.symbols.spinner.braille[morphFrameIdx] ?? theme.symbols.state.success
      symbolColor = theme.colors.accent.default
    } else {
      symbol = theme.symbols.state.success
      symbolColor = theme.colors.semantic.success.ansi
    }
  } else if (status === 'failure') {
    if (morphPhase < 0.6) {
      const morphFrameIdx =
        Math.floor(morphPhase * theme.symbols.spinner.braille.length * 1.5) %
        theme.symbols.spinner.braille.length
      symbol = theme.symbols.spinner.braille[morphFrameIdx] ?? theme.symbols.state.failure
      symbolColor = theme.colors.semantic.danger.ansi
    } else {
      symbol = theme.symbols.state.failure
      symbolColor = theme.colors.semantic.danger.ansi
    }
  } else {
    symbol = theme.symbols.state.cancelled
    dim = true
  }

  const showSuffix = suffixTime && status !== 'spinning'

  return (
    <Box>
      <Text color={symbolColor} dimColor={dim}>
        {symbol}
      </Text>
      <Text dimColor={dim}> {label}</Text>
      {showSuffix && <Text dimColor> · {elapsed}</Text>}
    </Box>
  )
}

export type SpinnerCallbackApi = {
  /** Update the spinner label mid-flight. Caret crossfades. */
  update: (label: string) => void
  /** AbortSignal aborted on SIGINT. Honor it for true cancellation. */
  signal: AbortSignal
}

export type SpinnerOptions = {
  onSuccess?: string
  onFailure?: string
  notifyOnComplete?: boolean | { threshold?: number }
  suffixTime?: boolean
  theme?: PartialTheme
}

type SpinnerFn<T> =
  | (() => Promise<T>)
  | ((api: SpinnerCallbackApi) => Promise<T>)

export async function spinner<T>(
  label: string,
  fn: SpinnerFn<T>,
  options: SpinnerOptions = {},
): Promise<T> {
  const startTime = Date.now()
  let currentLabel = label
  let currentStatus: SpinnerStatus = 'spinning'
  const suffixTime = options.suffixTime !== false

  const renderInstance = render(
    <ThemeProvider theme={options.theme}>
      <SpinnerView
        label={currentLabel}
        status={currentStatus}
        startTime={startTime}
        suffixTime={suffixTime}
      />
    </ThemeProvider>,
  )

  const rerender = () => {
    renderInstance.rerender(
      <ThemeProvider theme={options.theme}>
        <SpinnerView
          label={currentLabel}
          status={currentStatus}
          startTime={startTime}
          suffixTime={suffixTime}
        />
      </ThemeProvider>,
    )
  }

  const updateLabel = (l: string) => {
    currentLabel = l
    rerender()
  }

  const abortController = new AbortController()
  const handleSigint = () => {
    abortController.abort()
    currentStatus = 'cancelled'
    rerender()
  }
  process.once('SIGINT', handleSigint)

  const cleanup = () => {
    process.removeListener('SIGINT', handleSigint)
    renderInstance.unmount()
  }

  const maybeNotify = async (kind: 'done' | 'error') => {
    if (!options.notifyOnComplete) return
    const elapsed = Date.now() - startTime
    const threshold =
      typeof options.notifyOnComplete === 'object' && options.notifyOnComplete.threshold !== undefined
        ? options.notifyOnComplete.threshold
        : 10_000
    if (elapsed < threshold) return
    try {
      if (kind === 'done') {
        await notifyDone(currentLabel)
      } else {
        await notifyError(currentLabel)
      }
    } catch {
      // best-effort
    }
  }

  try {
    let result: T
    if (fn.length === 0) {
      result = await (fn as () => Promise<T>)()
    } else {
      result = await (fn as (api: SpinnerCallbackApi) => Promise<T>)({
        update: updateLabel,
        signal: abortController.signal,
      })
    }

    currentStatus = 'success'
    if (options.onSuccess !== undefined) currentLabel = options.onSuccess
    rerender()
    cleanup()
    await maybeNotify('done')

    return result
  } catch (err) {
    currentStatus = 'failure'
    if (options.onFailure !== undefined) currentLabel = options.onFailure
    rerender()
    cleanup()
    await maybeNotify('error')

    throw err
  }
}

// Manual control API for cases where the function-wrapping form doesn't fit.
export type SpinnerHandle = {
  update: (label: string) => void
  success: (label?: string) => void
  fail: (label?: string) => void
  stop: () => void
}

spinner.start = function start(label: string, options: SpinnerOptions = {}): SpinnerHandle {
  const startTime = Date.now()
  let currentLabel = label
  let currentStatus: SpinnerStatus = 'spinning'
  const suffixTime = options.suffixTime !== false

  const renderInstance = render(
    <ThemeProvider theme={options.theme}>
      <SpinnerView
        label={currentLabel}
        status={currentStatus}
        startTime={startTime}
        suffixTime={suffixTime}
      />
    </ThemeProvider>,
  )

  const rerender = () => {
    renderInstance.rerender(
      <ThemeProvider theme={options.theme}>
        <SpinnerView
          label={currentLabel}
          status={currentStatus}
          startTime={startTime}
          suffixTime={suffixTime}
        />
      </ThemeProvider>,
    )
  }

  return {
    update(l: string) {
      currentLabel = l
      rerender()
    },
    success(l?: string) {
      currentStatus = 'success'
      if (l !== undefined) currentLabel = l
      rerender()
      renderInstance.unmount()
    },
    fail(l?: string) {
      currentStatus = 'failure'
      if (l !== undefined) currentLabel = l
      rerender()
      renderInstance.unmount()
    },
    stop() {
      renderInstance.unmount()
    },
  }
}
