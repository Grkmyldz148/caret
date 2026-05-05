/**
 * Caret modal component
 *
 * An interactive bordered overlay with a title, body, and one or more
 * action buttons. Returns the value of the selected action.
 *
 *   const action = await modal({
 *     title: 'Confirm deletion',
 *     body: 'This will permanently delete 47 files. Are you sure?',
 *     actions: [
 *       { label: 'Cancel', value: 'cancel' },
 *       { label: 'Delete', value: 'delete', danger: true },
 *     ],
 *   })
 *
 * Use ←/→ to switch actions, ↵ to confirm, esc to cancel (returns null).
 *
 * Modal is the one component allowed a full rounded box frame per
 * specs/look.md § Borders & surfaces. Every row is composed as a
 * single ANSI-colored string and rendered as one <Text> so Ink never
 * splits, wraps, or re-measures segments — the borders always align.
 */

import React, { useState } from 'react'
import { Box, Text, render, useInput } from 'ink'
import chalk from 'chalk'
import { ThemeProvider, useTheme } from '../theme/index.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'
import { tracking, trackingLength } from '../lib/typography.js'
import { visibleLength } from '../lib/paint.js'
import { notifyWaiting } from '../lib/notify.js'

export type ModalAction<T extends string = string> = {
  label: string
  value: T
  /** Render this action in the danger color. */
  danger?: boolean
}

export type ModalOptions<T extends string = string> = {
  title: string
  body?: string
  actions: ReadonlyArray<ModalAction<T>>
  /** Default action index. Default: 0. */
  /**
   * Fire an OS notification when the modal is still waiting for input
   * after `delay` ms (default 5 000). Default: true.
   */
  notifyOnWait?: boolean | { delay?: number }
  defaultAction?: number
  theme?: PartialTheme
}

type Status = 'open' | 'submitted' | 'cancelled'

export type ModalViewProps<T extends string> = ModalOptions<T> & {
  onResolve: (value: T | null) => void
}

export function ModalView<T extends string>(props: ModalViewProps<T>) {
  const theme = useTheme()
  const cap = capability()
  const [selected, setSelected] = useState<number>(props.defaultAction ?? 0)
  const [status, setStatus] = useState<Status>('open')

  useInput((_input, key) => {
    if (status !== 'open') return

    if (key.escape) {
      setStatus('cancelled')
      props.onResolve(null)
      return
    }
    if (key.return) {
      setStatus('submitted')
      props.onResolve(props.actions[selected]!.value)
      return
    }
    if (key.leftArrow) {
      setSelected((s) => (s - 1 + props.actions.length) % props.actions.length)
      return
    }
    if (key.rightArrow || key.tab) {
      setSelected((s) => (s + 1) % props.actions.length)
      return
    }
  })

  if (status !== 'open') {
    // Resolved → render a single line summary in scrollback
    const action = status === 'submitted' ? props.actions[selected]! : null
    return (
      <Box>
        <Text color={theme.colors.accent.default}>{theme.symbols.anchor} </Text>
        <Text dimColor>{props.title}: </Text>
        {action !== null ? (
          <Text>{action.label}</Text>
        ) : (
          <Text dimColor italic>
            {theme.symbols.state.cancelled}
          </Text>
        )}
      </Box>
    )
  }

  // ─── Painters ─────────────────────────────────────────────
  // Truecolor when available; fall back to named ANSI otherwise.
  const accentColor = theme.colors.accent.default
  const dangerColor = theme.colors.semantic.danger.truecolor
  const dangerAnsi = theme.colors.semantic.danger.ansi

  const paintBorder = cap.truecolor
    ? (s: string) => chalk.hex(accentColor)(s)
    : (s: string) => chalk.blue(s)

  const paintActionSelected = cap.truecolor
    ? (s: string) => chalk.hex(accentColor).bold(s)
    : (s: string) => chalk.blue.bold(s)

  const paintActionDanger = cap.truecolor
    ? (s: string) => chalk.hex(dangerColor).bold(s)
    : (s: string) => (chalk as unknown as Record<string, typeof chalk>)[dangerAnsi]!.bold(s)

  // ─── Layout ───────────────────────────────────────────────
  const b = theme.symbols.borders
  const trackedTitle = tracking(props.title)
  const titleLen = trackingLength(props.title)

  const bodyLines = props.body !== undefined ? props.body.split('\n') : []
  const bodyMaxLen = bodyLines.reduce((m, l) => Math.max(m, visibleLength(l)), 0)

  // Each action renders as either `[ label ]` or `  label  ` — both
  // width = label.length + 4. A single space separator between actions.
  const actionWidths = props.actions.map((a) => a.label.length + 4)
  const actionsTotalWidth =
    actionWidths.reduce((sum, w) => sum + w, 0) + Math.max(0, props.actions.length - 1)

  // Inner content width (between the two `│` borders), with 1-char
  // left gutter for rows that have a leading space.
  const inner = Math.max(titleLen, bodyMaxLen, actionsTotalWidth, 30) + 4

  const rule = b.horizontal.repeat(inner)
  const emptyRow = `${paintBorder(b.vertical)}${' '.repeat(inner)}${paintBorder(b.vertical)}`

  const padRow = (content: string, contentWidth: number): string => {
    const pad = ' '.repeat(Math.max(0, inner - contentWidth - 1))
    return `${paintBorder(b.vertical)} ${content}${pad}${paintBorder(b.vertical)}`
  }

  // ─── Rows ─────────────────────────────────────────────────
  const rows: string[] = []

  // Top border
  rows.push(paintBorder(`${b.topLeft}${rule}${b.topRight}`))

  // Title row — tracked CAPS, bold
  rows.push(padRow(chalk.bold(trackedTitle), titleLen))

  // Spacer
  rows.push(emptyRow)

  // Body rows
  for (const line of bodyLines) {
    rows.push(padRow(line, visibleLength(line)))
  }

  // Spacer
  rows.push(emptyRow)

  // Actions row
  const actionSegments = props.actions.map((action, i) => {
    const isSelected = i === selected
    const label = isSelected ? `[ ${action.label} ]` : `  ${action.label}  `
    if (isSelected) {
      return action.danger ? paintActionDanger(label) : paintActionSelected(label)
    }
    return chalk.dim(label)
  })
  const actionsContent = actionSegments.join(' ')
  rows.push(padRow(actionsContent, actionsTotalWidth))

  // Bottom border
  rows.push(paintBorder(`${b.bottomLeft}${rule}${b.bottomRight}`))

  return (
    <Box flexDirection="column">
      {rows.map((row, i) => (
        <Text key={i}>{row}</Text>
      ))}

      {/* Hint footer */}
      <Box marginTop={1} marginLeft={2}>
        <Text dimColor italic>
          ←→ navigate · ↵ select · esc cancel
        </Text>
      </Box>
    </Box>
  )
}

export async function modal<T extends string = string>(options: ModalOptions<T>): Promise<T | null> {
  return new Promise<T | null>((resolve) => {
    let value: T | null = null

    // ── Notify-on-wait ────────────────────────────────────
    const shouldNotify = options.notifyOnWait !== false
    const waitDelay =
      typeof options.notifyOnWait === 'object'
        ? options.notifyOnWait.delay ?? 5_000
        : 5_000
    let waitTimer: ReturnType<typeof setTimeout> | undefined
    if (shouldNotify) {
      waitTimer = setTimeout(() => {
        notifyWaiting(`Waiting for input: ${options.title}`).catch(() => {})
      }, waitDelay)
    }

    const onResolve = (v: T | null) => {
      if (waitTimer !== undefined) clearTimeout(waitTimer)
      value = v
      app.unmount()
    }

    const app = render(
      <ThemeProvider theme={options.theme}>
        <ModalView<T> {...options} onResolve={onResolve} />
      </ThemeProvider>,
    )

    app.waitUntilExit().then(() => resolve(value))
  })
}
