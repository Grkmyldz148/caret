/**
 * ThemeProvider + useTheme hook
 *
 * Wraps the React tree with a theme context. Components inside read the
 * active theme via useTheme(). Without a provider, useTheme() falls back
 * to the global theme (set via setTheme() or the default).
 */

import React, { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { Theme, PartialTheme } from './types.js'
import { mergeTheme } from './merge.js'
import { getTheme } from './global.js'

const ThemeContext = createContext<Theme | null>(null)

export type ThemeProviderProps = {
  /** Partial theme override merged onto the current global theme. */
  theme?: PartialTheme
  children: ReactNode
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const merged = useMemo(() => mergeTheme(getTheme(), theme), [theme])
  return <ThemeContext.Provider value={merged}>{children}</ThemeContext.Provider>
}

/** Read the active Caret theme inside any component. */
export function useTheme(): Theme {
  const ctx = useContext(ThemeContext)
  return ctx ?? getTheme()
}
