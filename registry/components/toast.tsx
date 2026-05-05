/**
 * Caret toast component
 *
 * A brief inline notification that auto-dismisses after a timeout.
 * Useful for transient feedback that doesn't need to stay in scrollback.
 *
 *   await toast.success('Saved')                    // 2s default
 *   await toast.info('Loading…', { duration: 1500 })
 *   await toast.warning('Disconnected')
 *   await toast.error('Failed')
 *
 * Toasts are non-blocking visually but they DO await internally so you
 * can sequence them. To dispatch a fire-and-forget toast, don't await.
 */

import React, { useState, useEffect } from 'react'
import { Box, Text, render } from 'ink'
import { ThemeProvider, useTheme } from '../theme/index.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'

export type ToastKind = 'info' | 'success' | 'warning' | 'error'

export type ToastOptions = {
  /** Duration in milliseconds. Default: 2000. */
  duration?: number
  theme?: PartialTheme
}

export type ToastViewProps = {
  kind: ToastKind
  message: string
  duration: number
  onComplete: () => void
}

export function ToastView({ kind, message, duration, onComplete }: ToastViewProps) {
  const theme = useTheme()
  const [visible, setVisible] = useState<boolean>(true)
  const cap = capability()

  useEffect(() => {
    if (cap.reducedMotion || !cap.isTTY) {
      const t = setTimeout(() => {
        setVisible(false)
        onComplete()
      }, Math.min(duration, 100))
      return () => clearTimeout(t)
    }

    const t = setTimeout(() => {
      setVisible(false)
      onComplete()
    }, duration)
    return () => clearTimeout(t)
  }, [duration, cap.reducedMotion, cap.isTTY])

  if (!visible) return null

  let symbol: string
  let color: string
  let label: string
  switch (kind) {
    case 'success':
      symbol = theme.symbols.state.success
      color = theme.colors.semantic.success.ansi
      label = 'success'
      break
    case 'warning':
      symbol = theme.symbols.state.warning
      color = theme.colors.semantic.warning.ansi
      label = 'warning'
      break
    case 'error':
      symbol = theme.symbols.state.failure
      color = theme.colors.semantic.danger.ansi
      label = 'error'
      break
    case 'info':
    default:
      symbol = theme.symbols.state.info
      color = theme.colors.semantic.info.ansi
      label = 'info'
      break
  }

  return (
    <Box>
      <Text color={color}>{symbol} </Text>
      <Text color={color} bold>
        {label}:
      </Text>
      <Text> {message}</Text>
    </Box>
  )
}

async function showToast(kind: ToastKind, message: string, options: ToastOptions = {}): Promise<void> {
  const duration = options.duration ?? 2000

  return new Promise<void>((resolve) => {
    const app = render(
      <ThemeProvider theme={options.theme}>
        <ToastView
          kind={kind}
          message={message}
          duration={duration}
          onComplete={() => {
            app.unmount()
            resolve()
          }}
        />
      </ThemeProvider>,
    )
  })
}

export const toast = {
  info: (message: string, options?: ToastOptions) => showToast('info', message, options),
  success: (message: string, options?: ToastOptions) => showToast('success', message, options),
  warning: (message: string, options?: ToastOptions) => showToast('warning', message, options),
  error: (message: string, options?: ToastOptions) => showToast('error', message, options),
}
