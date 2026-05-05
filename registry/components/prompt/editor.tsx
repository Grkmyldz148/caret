/**
 * Prompt — editor variant
 *
 * Multi-line text input with line numbers and a gutter.
 * Enter adds a new line. Ctrl+D to submit. Esc to cancel.
 */

import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import { useTheme } from '../../theme/index.js'
import { PromptShell, PromptResolved } from './shared.js'

export type PromptEditorOptions = {
  label: string
  description?: string
  placeholder?: string
  default?: string
  validate?: (value: string) => string | null | Promise<string | null>
}

type Status = 'editing' | 'validating' | 'error' | 'submitted' | 'cancelled'

type Props = PromptEditorOptions & {
  onResolve: (value: string | null) => void
}

export function PromptEditor(props: Props) {
  const theme = useTheme()
  const initial = props.default ?? ''
  const initialLines = initial ? initial.split('\n') : ['']

  const [lines, setLines] = useState<string[]>(initialLines)
  const [row, setRow] = useState<number>(initialLines.length - 1)
  const [col, setCol] = useState<number>((initialLines[initialLines.length - 1] ?? '').length)
  const [status, setStatus] = useState<Status>('editing')
  const [error, setError] = useState<string | null>(null)

  useInput(async (input, key) => {
    if (status === 'submitted' || status === 'cancelled' || status === 'validating') return

    if (key.escape) {
      setStatus('cancelled')
      props.onResolve(null)
      return
    }

    // Ctrl+D → submit
    if (key.ctrl && input === 'd') {
      const value = lines.join('\n')
      const validateFn = props.validate
      if (validateFn) {
        setStatus('validating')
        try {
          const result = await validateFn(value)
          if (result) {
            setError(result)
            setStatus('error')
            return
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err))
          setStatus('error')
          return
        }
      }
      setStatus('submitted')
      props.onResolve(value)
      return
    }

    // Enter → new line
    if (key.return) {
      setLines((prev) => {
        const current = prev[row] ?? ''
        const before = current.slice(0, col)
        const after = current.slice(col)
        const next = [...prev]
        next.splice(row, 1, before, after)
        return next
      })
      setRow((r) => r + 1)
      setCol(0)
      if (status === 'error') { setError(null); setStatus('editing') }
      return
    }

    // Navigation
    if (key.upArrow) {
      if (row > 0) {
        const prevLen = (lines[row - 1] ?? '').length
        setRow((r) => r - 1)
        setCol((c) => Math.min(c, prevLen))
      }
      return
    }
    if (key.downArrow) {
      if (row < lines.length - 1) {
        const nextLen = (lines[row + 1] ?? '').length
        setRow((r) => r + 1)
        setCol((c) => Math.min(c, nextLen))
      }
      return
    }
    if (key.leftArrow) {
      if (col > 0) {
        setCol((c) => c - 1)
      } else if (row > 0) {
        setRow((r) => r - 1)
        setCol((lines[row - 1] ?? '').length)
      }
      return
    }
    if (key.rightArrow) {
      const currentLine = lines[row] ?? ''
      if (col < currentLine.length) {
        setCol((c) => c + 1)
      } else if (row < lines.length - 1) {
        setRow((r) => r + 1)
        setCol(0)
      }
      return
    }

    // Ctrl+A → start, Ctrl+E → end
    if (key.ctrl && input === 'a') { setCol(0); return }
    if (key.ctrl && input === 'e') { setCol((lines[row] ?? '').length); return }

    // Ctrl+U → clear line
    if (key.ctrl && input === 'u') {
      setLines((prev) => { const next = [...prev]; next[row] = ''; return next })
      setCol(0)
      if (status === 'error') { setError(null); setStatus('editing') }
      return
    }

    // Backspace
    if (key.backspace || key.delete) {
      if (col > 0) {
        setLines((prev) => {
          const next = [...prev]
          const current = next[row] ?? ''
          next[row] = current.slice(0, col - 1) + current.slice(col)
          return next
        })
        setCol((c) => c - 1)
      } else if (row > 0) {
        const prevLen = (lines[row - 1] ?? '').length
        setLines((prev) => {
          const next = [...prev]
          next[row - 1] = (next[row - 1] ?? '') + (next[row] ?? '')
          next.splice(row, 1)
          return next
        })
        setRow((r) => r - 1)
        setCol(prevLen)
      }
      if (status === 'error') { setError(null); setStatus('editing') }
      return
    }

    // Printable characters
    if (input && !key.ctrl && !key.meta && input.length >= 1) {
      const printable = input
        .split('')
        .filter((ch) => ch >= ' ' && ch !== '\x7f')
        .join('')
      if (printable) {
        setLines((prev) => {
          const next = [...prev]
          const current = next[row] ?? ''
          next[row] = current.slice(0, col) + printable + current.slice(col)
          return next
        })
        setCol((c) => c + printable.length)
        if (status === 'error') { setError(null); setStatus('editing') }
      }
    }
  })

  if (status === 'submitted') {
    const summary = lines.length === 1 ? lines[0]! : `${lines.length} lines`
    return <PromptResolved label={props.label} value={summary} />
  }
  if (status === 'cancelled') {
    return <PromptResolved label={props.label} cancelled />
  }

  const isEmpty = lines.length === 1 && lines[0] === ''
  const showPlaceholder = isEmpty && props.placeholder !== undefined
  const gutterWidth = String(lines.length).length

  return (
    <PromptShell
      label={props.label}
      description={props.description}
      footer="↵ new line  ctrl+d submit  esc cancel"
    >
      {showPlaceholder ? (
        <Box>
          <Text dimColor>{'1'.padStart(gutterWidth)} {theme.symbols.structure.gutter} </Text>
          <Text inverse> </Text>
          <Text dimColor>{props.placeholder!.slice(1)}</Text>
        </Box>
      ) : (
        lines.map((line, i) => {
          const isCurrentRow = i === row
          const lineNum = String(i + 1).padStart(gutterWidth)
          return (
            <Box key={`line-${i}`}>
              <Text dimColor>{lineNum} {theme.symbols.structure.gutter} </Text>
              {isCurrentRow ? (
                <>
                  <Text>{line.slice(0, col)}</Text>
                  <Text inverse>{line[col] ?? ' '}</Text>
                  <Text>{line.slice(col + 1)}</Text>
                </>
              ) : (
                <Text>{line || ' '}</Text>
              )}
            </Box>
          )
        })
      )}

      {error !== null && (
        <Box marginTop={1}>
          <Text color={theme.colors.semantic.danger.ansi}>
            {theme.symbols.state.warning} {error}
          </Text>
        </Box>
      )}
    </PromptShell>
  )
}
