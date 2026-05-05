/**
 * Prompt — autocomplete variant
 *
 * Fuzzy-search input over a list of options. Type to filter,
 * navigate with ↑/↓, ↵ to select.
 */

import React, { useState, useMemo } from 'react'
import { Box, Text, useInput } from 'ink'
import { useTheme } from '../../theme/index.js'
import { PromptShell, PromptResolved } from './shared.js'

export type PromptAutocompleteOption<T extends string> = {
  value: T
  label: string
}

export type PromptAutocompleteOptions<T extends string = string> = {
  label: string
  description?: string
  options: ReadonlyArray<PromptAutocompleteOption<T>>
  placeholder?: string
  /** Maximum visible results. Default: 8. */
  limit?: number
  /** Custom filter. Default: case-insensitive fuzzy match. */
  filter?: (query: string, option: PromptAutocompleteOption<T>) => boolean
}

type Status = 'editing' | 'submitted' | 'cancelled'

type Props<T extends string> = PromptAutocompleteOptions<T> & {
  onResolve: (value: T | null) => void
}

function defaultFilter<T extends string>(
  query: string,
  option: PromptAutocompleteOption<T>,
): boolean {
  const lower = option.label.toLowerCase()
  const q = query.toLowerCase()
  let idx = 0
  for (const ch of q) {
    idx = lower.indexOf(ch, idx)
    if (idx === -1) return false
    idx++
  }
  return true
}

export function PromptAutocomplete<T extends string>(props: Props<T>) {
  const theme = useTheme()
  const limit = props.limit ?? 8
  const filterFn = props.filter ?? defaultFilter

  const [query, setQuery] = useState<string>('')
  const [cursor, setCursor] = useState<number>(0)
  const [inputCursor, setInputCursor] = useState<number>(0)
  const [status, setStatus] = useState<Status>('editing')

  const filtered = useMemo(() => {
    if (query === '') return props.options.slice(0, limit)
    return props.options.filter((opt) => filterFn(query, opt)).slice(0, limit)
  }, [query, props.options, limit, filterFn])

  const activeCursor = Math.min(cursor, Math.max(0, filtered.length - 1))

  useInput((input, key) => {
    if (status !== 'editing') return

    if (key.escape) {
      setStatus('cancelled')
      props.onResolve(null)
      return
    }

    if (key.return) {
      const opt = filtered[activeCursor]
      if (opt) {
        setStatus('submitted')
        props.onResolve(opt.value)
      }
      return
    }

    if (key.upArrow) {
      setCursor((i) => Math.max(0, i - 1))
      return
    }
    if (key.downArrow) {
      setCursor((i) => Math.min(filtered.length - 1, i + 1))
      return
    }

    if (key.leftArrow) {
      setInputCursor((c) => Math.max(0, c - 1))
      return
    }
    if (key.rightArrow) {
      setInputCursor((c) => Math.min(query.length, c + 1))
      return
    }

    if (key.backspace || key.delete) {
      if (inputCursor > 0) {
        setQuery((v) => v.slice(0, inputCursor - 1) + v.slice(inputCursor))
        setInputCursor((c) => c - 1)
        setCursor(0)
      }
      return
    }

    if (key.ctrl && input === 'u') {
      setQuery('')
      setInputCursor(0)
      setCursor(0)
      return
    }

    if (input && !key.ctrl && !key.meta && input.length >= 1) {
      const printable = input
        .split('')
        .filter((ch) => ch >= ' ' && ch !== '\x7f')
        .join('')
      if (printable) {
        setQuery((v) => v.slice(0, inputCursor) + printable + v.slice(inputCursor))
        setInputCursor((c) => c + printable.length)
        setCursor(0)
      }
    }
  })

  if (status === 'submitted') {
    const opt = filtered[activeCursor]
    return <PromptResolved label={props.label} value={opt?.label ?? ''} />
  }
  if (status === 'cancelled') {
    return <PromptResolved label={props.label} cancelled />
  }

  const showPlaceholder = query === '' && props.placeholder !== undefined
  const beforeCursor = query.slice(0, inputCursor)
  const atCursor = query[inputCursor] ?? ' '
  const afterCursor = query.slice(inputCursor + 1)

  return (
    <PromptShell
      label={props.label}
      description={props.description}
      footer="type to filter  ↑↓ navigate  ↵ select  esc cancel"
    >
      {/* Input row */}
      <Box>
        <Text color={theme.colors.accent.default}>{theme.symbols.prefix.focused} </Text>
        {showPlaceholder ? (
          <>
            <Text inverse> </Text>
            <Text dimColor>{props.placeholder!.slice(1)}</Text>
          </>
        ) : (
          <>
            <Text>{beforeCursor}</Text>
            <Text inverse>{atCursor}</Text>
            <Text>{afterCursor}</Text>
          </>
        )}
        {filtered.length > 0 && (
          <Text dimColor>  {filtered.length} match{filtered.length !== 1 ? 'es' : ''}</Text>
        )}
      </Box>

      {/* Spacer */}
      <Box height={1} />

      {/* Results */}
      {filtered.length === 0 ? (
        <Text dimColor italic>  no matches</Text>
      ) : (
        filtered.map((opt, i) => {
          const isCursor = i === activeCursor
          return (
            <Box key={opt.value}>
              {isCursor ? (
                <Text color={theme.colors.accent.default}>
                  {theme.symbols.marker.selected} {opt.label}
                </Text>
              ) : (
                <Text dimColor>
                  {theme.symbols.marker.unselected} {opt.label}
                </Text>
              )}
            </Box>
          )
        })
      )}
    </PromptShell>
  )
}
