/**
 * Prompt — public API
 *
 * Wraps each Prompt React component in a Promise-returning function.
 * Each variant accepts an optional theme override that's merged with
 * the active global Caret theme.
 *
 * All prompts support `notifyOnWait` — when the prompt is still
 * waiting for input after a delay (default 5 s), an OS notification
 * is fired so the user notices even if the terminal is in the
 * background. Respects CARET_NO_NOTIFY.
 */

import React from 'react'
import { render } from 'ink'
import { ThemeProvider } from '../../theme/index.js'
import type { PartialTheme } from '../../theme/types.js'
import { notifyWaiting } from '../../lib/notify.js'

import { PromptText, type PromptTextOptions } from './text.js'
import { PromptConfirm, type PromptConfirmOptions } from './confirm.js'
import { PromptSelect, type PromptSelectOptions } from './select.js'
import { PromptMultiSelect, type PromptMultiSelectOptions } from './multi-select.js'
import { PromptPassword, type PromptPasswordOptions } from './password.js'
import { PromptNumber, type PromptNumberOptions } from './number.js'
import { PromptAutocomplete, type PromptAutocompleteOptions } from './autocomplete.js'
import { PromptEditor, type PromptEditorOptions } from './editor.js'

export class CaretCancelled extends Error {
  constructor() {
    super('Cancelled by user')
    this.name = 'CaretCancelled'
  }
}

/** Default delay (ms) before firing an "input waiting" notification. */
const DEFAULT_WAIT_DELAY = 5_000

type NotifyOnWait = boolean | { delay?: number }

type WithTheme<T> = T & {
  theme?: PartialTheme
  /**
   * Fire an OS notification when the prompt is still waiting for input
   * after `delay` milliseconds (default 5 000). Set `true` for the
   * default, `{ delay: 3000 }` to customise, or `false` to disable.
   *
   * Default: true.
   */
  notifyOnWait?: NotifyOnWait
}

function runPrompt<TValue>(
  buildElement: (handleResolve: (value: TValue | null) => void) => React.ReactElement,
  themeOverride: PartialTheme | undefined,
  notifyOpts?: { label: string; notifyOnWait?: NotifyOnWait },
): Promise<TValue> {
  return new Promise<TValue>((resolve, reject) => {
    let cancelled = false
    let value: TValue | null = null

    // ── Notify-on-wait timer ──────────────────────────────
    const shouldNotify = notifyOpts?.notifyOnWait !== false
    const delay =
      typeof notifyOpts?.notifyOnWait === 'object'
        ? notifyOpts.notifyOnWait.delay ?? DEFAULT_WAIT_DELAY
        : DEFAULT_WAIT_DELAY

    let waitTimer: ReturnType<typeof setTimeout> | undefined
    if (shouldNotify && notifyOpts?.label) {
      waitTimer = setTimeout(() => {
        notifyWaiting(`Waiting for input: ${notifyOpts.label}`).catch(() => {})
      }, delay)
    }

    const onResolve = (v: TValue | null) => {
      if (waitTimer !== undefined) clearTimeout(waitTimer)
      if (v === null) cancelled = true
      else value = v
      app.unmount()
    }

    const app = render(
      <ThemeProvider theme={themeOverride}>{buildElement(onResolve)}</ThemeProvider>,
    )

    app.waitUntilExit().then(
      () => {
        if (waitTimer !== undefined) clearTimeout(waitTimer)
        if (cancelled) reject(new CaretCancelled())
        else if (value !== null) resolve(value)
        else reject(new Error('Prompt exited without resolution'))
      },
      (err: unknown) => {
        if (waitTimer !== undefined) clearTimeout(waitTimer)
        reject(err)
      },
    )
  })
}

function text(options: WithTheme<PromptTextOptions>): Promise<string> {
  return runPrompt<string>(
    (onResolve) => <PromptText {...options} onResolve={onResolve} />,
    options.theme,
    { label: options.label, notifyOnWait: options.notifyOnWait },
  )
}

function password(options: WithTheme<PromptPasswordOptions>): Promise<string> {
  return runPrompt<string>(
    (onResolve) => <PromptPassword {...options} onResolve={onResolve} />,
    options.theme,
    { label: options.label, notifyOnWait: options.notifyOnWait },
  )
}

function confirm(options: WithTheme<PromptConfirmOptions>): Promise<boolean> {
  return runPrompt<boolean>(
    (onResolve) => <PromptConfirm {...options} onResolve={onResolve} />,
    options.theme,
    { label: options.label, notifyOnWait: options.notifyOnWait },
  )
}

function select<T extends string>(
  options: WithTheme<PromptSelectOptions<T>>,
): Promise<T> {
  return runPrompt<T>(
    (onResolve) => <PromptSelect<T> {...options} onResolve={onResolve} />,
    options.theme,
    { label: options.label, notifyOnWait: options.notifyOnWait },
  )
}

function multiSelect<T extends string>(
  options: WithTheme<PromptMultiSelectOptions<T>>,
): Promise<T[]> {
  return runPrompt<T[]>(
    (onResolve) => <PromptMultiSelect<T> {...options} onResolve={onResolve} />,
    options.theme,
    { label: options.label, notifyOnWait: options.notifyOnWait },
  )
}

function number(options: WithTheme<PromptNumberOptions>): Promise<number> {
  return runPrompt<number>(
    (onResolve) => <PromptNumber {...options} onResolve={onResolve} />,
    options.theme,
    { label: options.label, notifyOnWait: options.notifyOnWait },
  )
}

function autocomplete<T extends string>(
  options: WithTheme<PromptAutocompleteOptions<T>>,
): Promise<T> {
  return runPrompt<T>(
    (onResolve) => <PromptAutocomplete<T> {...options} onResolve={onResolve} />,
    options.theme,
    { label: options.label, notifyOnWait: options.notifyOnWait },
  )
}

function editor(options: WithTheme<PromptEditorOptions>): Promise<string> {
  return runPrompt<string>(
    (onResolve) => <PromptEditor {...options} onResolve={onResolve} />,
    options.theme,
    { label: options.label, notifyOnWait: options.notifyOnWait },
  )
}

export const prompt = {
  text,
  password,
  confirm,
  select,
  multiSelect,
  number,
  autocomplete,
  editor,
}

export type {
  PromptTextOptions,
  PromptPasswordOptions,
  PromptConfirmOptions,
  PromptSelectOptions,
  PromptMultiSelectOptions,
  PromptNumberOptions,
  PromptAutocompleteOptions,
  PromptEditorOptions,
}
