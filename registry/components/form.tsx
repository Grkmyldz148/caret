/**
 * Caret form component
 *
 * Multi-field input layout — multiple prompts in one frame, navigated
 * with Tab / Shift+Tab. Submit on the last field (or Ctrl+Enter from any
 * field) returns an object keyed by field name.
 *
 *   const result = await form({
 *     title: 'Create project',
 *     fields: [
 *       { name: 'name',  label: 'Project name', type: 'text' },
 *       { name: 'env',   label: 'Environment',  type: 'select',
 *         options: [
 *           { value: 'staging', label: 'Staging' },
 *           { value: 'prod',    label: 'Production' },
 *         ],
 *       },
 *       { name: 'auth',  label: 'Enable authentication', type: 'confirm', default: true },
 *     ],
 *   })
 *
 * Returns: { name: 'foo', env: 'prod', auth: true }
 */

import React, { useState } from 'react'
import { Box, Text, render, useInput } from 'ink'
import { ThemeProvider, useTheme } from '../theme/index.js'
import type { PartialTheme } from '../theme/types.js'
import { tracking } from '../lib/typography.js'
import { notifyWaiting } from '../lib/notify.js'

export type FormFieldType = 'text' | 'password' | 'confirm' | 'select'

export type FormSelectOption = { value: string; label: string }

export type FormField = {
  name: string
  label: string
  type: FormFieldType
  description?: string
  default?: string | boolean
  options?: ReadonlyArray<FormSelectOption>
  validate?: (value: string | boolean) => string | null
}

export type FormOptions = {
  title?: string
  description?: string
  fields: ReadonlyArray<FormField>
  /**
   * Fire an OS notification when the form is still waiting for input
   * after `delay` ms (default 5 000). Default: true.
   */
  notifyOnWait?: boolean | { delay?: number }
  theme?: PartialTheme
}

export type FormResult = Record<string, string | boolean>

class CaretCancelled extends Error {
  constructor() {
    super('Cancelled by user')
    this.name = 'CaretCancelled'
  }
}

type FieldState = {
  value: string | boolean
  error: string | null
}

export type FormViewProps = FormOptions & {
  onResolve: (result: FormResult | null) => void
}

export function FormView(props: FormViewProps) {
  const theme = useTheme()
  const [active, setActive] = useState<number>(0)
  const [states, setStates] = useState<FieldState[]>(() =>
    props.fields.map((f) => ({
      value: f.default ?? (f.type === 'confirm' ? false : ''),
      error: null,
    })),
  )

  const updateState = (idx: number, patch: Partial<FieldState>) => {
    setStates((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx]!, ...patch }
      return next
    })
  }

  const validateAll = (): boolean => {
    let allValid = true
    const newStates = [...states]
    props.fields.forEach((field, i) => {
      if (field.validate) {
        const err = field.validate(newStates[i]!.value)
        if (err) {
          newStates[i] = { ...newStates[i]!, error: err }
          allValid = false
        }
      }
    })
    if (!allValid) setStates(newStates)
    return allValid
  }

  useInput((input, key) => {
    const field = props.fields[active]!
    const state = states[active]!

    if (key.escape) {
      props.onResolve(null)
      return
    }

    if (key.ctrl && (input === '\r' || key.return)) {
      if (validateAll()) {
        const result: FormResult = {}
        props.fields.forEach((f, i) => {
          result[f.name] = states[i]!.value
        })
        props.onResolve(result)
      }
      return
    }

    if (key.tab && key.shift) {
      setActive((a) => (a - 1 + props.fields.length) % props.fields.length)
      return
    }

    if (key.tab) {
      setActive((a) => (a + 1) % props.fields.length)
      return
    }

    if (key.return) {
      // On last field, submit. Otherwise advance.
      if (active === props.fields.length - 1) {
        if (validateAll()) {
          const result: FormResult = {}
          props.fields.forEach((f, i) => {
            result[f.name] = states[i]!.value
          })
          props.onResolve(result)
        }
      } else {
        setActive((a) => a + 1)
      }
      return
    }

    // Field-specific input handling
    if (field.type === 'text' || field.type === 'password') {
      if (key.backspace || key.delete) {
        updateState(active, {
          value: (state.value as string).slice(0, -1),
          error: null,
        })
        return
      }
      if (input && !key.ctrl && !key.meta && input.length >= 1) {
        const printable = input
          .split('')
          .filter((ch) => ch >= ' ' && ch !== '\x7f')
          .join('')
        if (printable) {
          updateState(active, {
            value: (state.value as string) + printable,
            error: null,
          })
        }
      }
      return
    }

    if (field.type === 'confirm') {
      if (key.leftArrow || key.rightArrow || input === ' ') {
        updateState(active, { value: !state.value })
        return
      }
      if (input === 'y' || input === 'Y') {
        updateState(active, { value: true })
        return
      }
      if (input === 'n' || input === 'N') {
        updateState(active, { value: false })
        return
      }
    }

    if (field.type === 'select' && field.options) {
      const idx = field.options.findIndex((o) => o.value === state.value)
      if (key.upArrow) {
        const next = (idx - 1 + field.options.length) % field.options.length
        updateState(active, { value: field.options[next]!.value })
        return
      }
      if (key.downArrow) {
        const next = (idx + 1) % field.options.length
        updateState(active, { value: field.options[next]!.value })
        return
      }
    }
  })

  return (
    <Box flexDirection="column">
      {props.title !== undefined && (
        <Box>
          <Text color={theme.colors.accent.default}>{theme.symbols.anchor} </Text>
          <Text bold>{tracking(props.title)}</Text>
        </Box>
      )}
      {props.description !== undefined && (
        <Box marginLeft={2} marginBottom={1}>
          <Text dimColor>{props.description}</Text>
        </Box>
      )}

      {props.fields.map((field, i) => {
        const state = states[i]!
        const isActive = i === active
        const prefix = isActive
          ? theme.symbols.prefix.focused
          : theme.symbols.prefix.idle

        return (
          <Box key={field.name} flexDirection="column" marginTop={1}>
            <Box>
              <Text
                color={isActive ? theme.colors.accent.default : undefined}
                dimColor={!isActive}
              >
                {prefix}{' '}
              </Text>
              <Text bold dimColor={!isActive}>
                {field.label}
              </Text>
            </Box>

            {field.description !== undefined && isActive && (
              <Box marginLeft={2}>
                <Text dimColor>{field.description}</Text>
              </Box>
            )}

            <Box marginLeft={2}>
              {(field.type === 'text' || field.type === 'password') && (
                <>
                  <Text dimColor={!isActive}>
                    {field.type === 'password'
                      ? '•'.repeat((state.value as string).length)
                      : (state.value as string) || ' '}
                  </Text>
                  {isActive && <Text>█</Text>}
                </>
              )}

              {field.type === 'confirm' && (() => {
                const v = state.value === true
                return (
                  <Box>
                    <Text
                      color={v ? theme.colors.accent.default : undefined}
                      dimColor={!v}
                    >
                      {v
                        ? theme.symbols.marker.selected
                        : theme.symbols.marker.unselected}{' '}
                      Yes
                    </Text>
                    <Text>    </Text>
                    <Text
                      color={!v ? theme.colors.accent.default : undefined}
                      dimColor={v}
                    >
                      {!v
                        ? theme.symbols.marker.selected
                        : theme.symbols.marker.unselected}{' '}
                      No
                    </Text>
                  </Box>
                )
              })()}

              {field.type === 'select' && field.options && (
                <Box flexDirection="column">
                  {field.options.map((opt) => {
                    const sel = opt.value === state.value
                    return (
                      <Text
                        key={opt.value}
                        color={sel ? theme.colors.accent.default : undefined}
                        dimColor={!sel}
                      >
                        {sel
                          ? theme.symbols.marker.selected
                          : theme.symbols.marker.unselected}{' '}
                        {opt.label}
                      </Text>
                    )
                  })}
                </Box>
              )}
            </Box>

            {state.error !== null && (
              <Box marginLeft={2}>
                <Text color={theme.colors.semantic.danger.ansi}>
                  {theme.symbols.state.warning} {state.error}
                </Text>
              </Box>
            )}
          </Box>
        )
      })}

      <Box marginTop={1} marginLeft={2}>
        <Text dimColor italic>
          tab/shift+tab navigate · ctrl+↵ submit · esc cancel
        </Text>
      </Box>
    </Box>
  )
}

export async function form(options: FormOptions): Promise<FormResult> {
  return new Promise<FormResult>((resolve, reject) => {
    let result: FormResult | null = null
    let cancelled = false

    // ── Notify-on-wait ──────────────────────────────────
    const shouldNotify = options.notifyOnWait !== false
    const waitDelay =
      typeof options.notifyOnWait === 'object'
        ? options.notifyOnWait.delay ?? 5_000
        : 5_000
    let waitTimer: ReturnType<typeof setTimeout> | undefined
    if (shouldNotify) {
      const label = options.title ?? 'Form'
      waitTimer = setTimeout(() => {
        notifyWaiting(`Waiting for input: ${label}`).catch(() => {})
      }, waitDelay)
    }

    const onResolve = (r: FormResult | null) => {
      if (waitTimer !== undefined) clearTimeout(waitTimer)
      if (r === null) cancelled = true
      else result = r
      app.unmount()
    }

    const app = render(
      <ThemeProvider theme={options.theme}>
        <FormView {...options} onResolve={onResolve} />
      </ThemeProvider>,
    )

    app.waitUntilExit().then(
      () => {
        if (waitTimer !== undefined) clearTimeout(waitTimer)
        if (cancelled) reject(new CaretCancelled())
        else if (result !== null) resolve(result)
        else reject(new Error('Form exited without resolution'))
      },
      (err: unknown) => {
        if (waitTimer !== undefined) clearTimeout(waitTimer)
        reject(err)
      },
    )
  })
}
