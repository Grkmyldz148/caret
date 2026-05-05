/**
 * Prompt — shared shell components
 *
 * Every Prompt variant is built from the same anatomy: an anchor + label
 * row, an optional description, an indented body, and an optional footer
 * with keyboard hints. PromptShell encapsulates that anatomy. PromptResolved
 * is the single-line collapsed form used after submit / cancel.
 */

import React, { type ReactNode } from 'react'
import { Box, Text } from 'ink'
import { useTheme } from '../../theme/index.js'
import { tracking } from '../../lib/typography.js'

export type PromptShellProps = {
  label: string
  description?: string
  footer?: string
  children: ReactNode
}

export function PromptShell({ label, description, footer, children }: PromptShellProps) {
  const theme = useTheme()
  return (
    <Box flexDirection="column" marginTop={theme.spacing.sectionBefore}>
      {/* Anchor + tracked CAPS label — the Caret signature (specs/look.md § Typography) */}
      <Box>
        <Text color={theme.colors.accent.default}>{theme.symbols.anchor} </Text>
        <Text bold>{tracking(label)}</Text>
      </Box>

      {/* Indented body */}
      <Box flexDirection="column" paddingLeft={theme.spacing.indent}>
        {description !== undefined && (
          <Text dimColor>{description}</Text>
        )}

        {/* Spacer between description and body */}
        <Box height={theme.spacing.section} />

        {children}

        {footer !== undefined && (
          <>
            <Box height={theme.spacing.section} />
            <Text dimColor italic>{footer}</Text>
          </>
        )}
      </Box>
    </Box>
  )
}

export type PromptResolvedProps = {
  label: string
  /** The submitted value as a display string. */
  value?: string
  /** If true, render the cancelled placeholder instead of a value. */
  cancelled?: boolean
}

export function PromptResolved({ label, value, cancelled }: PromptResolvedProps) {
  const theme = useTheme()
  return (
    <Box marginTop={theme.spacing.sectionBefore}>
      <Text color={theme.colors.accent.default}>{theme.symbols.anchor} </Text>
      <Text dimColor>{tracking(label)}  </Text>
      {cancelled ? (
        <Text dimColor italic>{theme.symbols.state.cancelled}</Text>
      ) : (
        <Text>{value ?? ''}</Text>
      )}
    </Box>
  )
}
