/**
 * Caret splash component
 *
 * The opening moment of your CLI. Renders an optional logo, a title,
 * and an optional subtitle with line-by-line and character-by-character
 * reveal animation.
 *
 *   await splash({
 *     logo: { text: 'caret' },
 *     title: 'Caret',
 *     subtitle: 'The design system for modern command-line tools',
 *   })
 *
 * Animation phases (skipped under reduced motion / non-TTY):
 *   1. Logo lines reveal top-down
 *   2. Title types out character by character
 *   3. Subtitle fades in
 *   4. Hold
 *   5. Done
 */

import React, { useState, useEffect, useMemo } from 'react'
import { Box, Text, render } from 'ink'
import { ThemeProvider, useTheme } from '../theme/index.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'
import { textToArt } from '../lib/text-to-art.js'
import { tracking } from '../lib/typography.js'

type Phase = 'logo-revealing' | 'title-typing' | 'subtitle-fading' | 'hold' | 'done'

type Durations = {
  logoLineMs: number
  titleCharMs: number
  subtitleDelayMs: number
  holdMs: number
}

type SplashViewProps = {
  logo?: string
  title: string
  subtitle?: string
  durations: Durations
  onComplete: () => void
}

function SplashView({ logo, title, subtitle, durations, onComplete }: SplashViewProps) {
  const theme = useTheme()
  const cap = capability()
  const reduced = cap.reducedMotion || !cap.isTTY

  // Manifesto: display titles use tracked CAPS.
  const displayTitle = useMemo(() => tracking(title), [title])

  const logoLines = useMemo(() => {
    if (logo === undefined) return []
    return logo.replace(/^\n/, '').replace(/\n$/, '').split('\n')
  }, [logo])

  const logoHasAnsi = logo !== undefined && /\x1b\[/.test(logo)

  const [logoVisibleLines, setLogoVisibleLines] = useState<number>(
    reduced ? logoLines.length : 0,
  )
  const [titleVisibleChars, setTitleVisibleChars] = useState<number>(
    reduced ? displayTitle.length : 0,
  )
  const [subtitleVisible, setSubtitleVisible] = useState<boolean>(reduced)

  const initialPhase: Phase = reduced
    ? 'done'
    : logoLines.length > 0
      ? 'logo-revealing'
      : 'title-typing'

  const [phase, setPhase] = useState<Phase>(initialPhase)

  // Reduced motion: render everything immediately, then complete
  useEffect(() => {
    if (!reduced) return
    const t = setTimeout(onComplete, 50)
    return () => clearTimeout(t)
  }, [reduced, onComplete])

  // Phase: logo-revealing → reveals logo lines top-down
  useEffect(() => {
    if (phase !== 'logo-revealing') return
    if (logoLines.length === 0) {
      setPhase('title-typing')
      return
    }
    let i = 0
    const interval = setInterval(() => {
      i++
      setLogoVisibleLines(i)
      if (i >= logoLines.length) {
        clearInterval(interval)
        setTimeout(() => setPhase('title-typing'), 150)
      }
    }, durations.logoLineMs)
    return () => clearInterval(interval)
  }, [phase, logoLines.length, durations.logoLineMs])

  // Phase: title-typing → types out title character by character
  useEffect(() => {
    if (phase !== 'title-typing') return
    if (displayTitle.length === 0) {
      setPhase('subtitle-fading')
      return
    }
    let i = 0
    const interval = setInterval(() => {
      i++
      setTitleVisibleChars(i)
      if (i >= displayTitle.length) {
        clearInterval(interval)
        setTimeout(() => setPhase('subtitle-fading'), durations.subtitleDelayMs)
      }
    }, durations.titleCharMs)
    return () => clearInterval(interval)
  }, [phase, displayTitle.length, durations.titleCharMs, durations.subtitleDelayMs])

  // Phase: subtitle-fading → reveal subtitle, then transition to hold
  useEffect(() => {
    if (phase !== 'subtitle-fading') return
    setSubtitleVisible(true)
    const t = setTimeout(() => setPhase('hold'), 200)
    return () => clearTimeout(t)
  }, [phase])

  // Phase: hold → pause then complete
  useEffect(() => {
    if (phase !== 'hold') return
    const t = setTimeout(() => {
      setPhase('done')
      onComplete()
    }, durations.holdMs)
    return () => clearTimeout(t)
  }, [phase, durations.holdMs, onComplete])

  // Render
  const visibleLogoLines = logoLines.slice(0, logoVisibleLines)
  const showTitle = phase !== 'logo-revealing'
  const showSubtitle = subtitleVisible && subtitle !== undefined

  return (
    <Box flexDirection="column">
      {visibleLogoLines.length > 0 && (
        <Box flexDirection="column">
          {visibleLogoLines.map((line, i) =>
            logoHasAnsi ? (
              <Text key={i}>{line}</Text>
            ) : (
              <Text key={i} color={theme.colors.accent.default}>
                {line}
              </Text>
            ),
          )}
        </Box>
      )}

      {(visibleLogoLines.length > 0 || showTitle) && <Box height={1} />}

      {showTitle && (
        <Text bold>
          {displayTitle.slice(0, titleVisibleChars)}
          {/* Show a typing cursor while still typing */}
          {phase === 'title-typing' && titleVisibleChars < displayTitle.length && (
            <Text color={theme.colors.accent.default}>{theme.symbols.cursor}</Text>
          )}
        </Text>
      )}

      {showSubtitle && <Text dimColor>{subtitle}</Text>}
    </Box>
  )
}

export type SplashLogoText = {
  text: string
  font?: string
}

export type SplashOptions = {
  logo?: string | SplashLogoText
  title: string
  subtitle?: string
  /** Animation profile. Default: 'normal'. */
  duration?: 'instant' | 'fast' | 'normal' | 'slow'
  /** Override hold time after all elements appear. */
  hold?: number
  theme?: PartialTheme
}

const PROFILES: Record<NonNullable<SplashOptions['duration']>, Durations> = {
  instant: { logoLineMs: 0, titleCharMs: 0, subtitleDelayMs: 0, holdMs: 0 },
  fast: { logoLineMs: 30, titleCharMs: 30, subtitleDelayMs: 150, holdMs: 400 },
  normal: { logoLineMs: 60, titleCharMs: 50, subtitleDelayMs: 200, holdMs: 800 },
  slow: { logoLineMs: 100, titleCharMs: 80, subtitleDelayMs: 350, holdMs: 1500 },
}

export async function splash(options: SplashOptions): Promise<void> {
  const profile = PROFILES[options.duration ?? 'normal']
  const durations: Durations = {
    ...profile,
    holdMs: options.hold ?? profile.holdMs,
  }

  // Normalize logo: object → ASCII art via figlet, string → as-is
  const logoString =
    options.logo !== undefined && typeof options.logo === 'object'
      ? textToArt(options.logo.text, { font: options.logo.font })
      : options.logo

  return new Promise<void>((resolve) => {
    const app = render(
      <ThemeProvider theme={options.theme}>
        <SplashView
          logo={logoString}
          title={options.title}
          subtitle={options.subtitle}
          durations={durations}
          onComplete={() => {
            app.unmount()
            resolve()
          }}
        />
      </ThemeProvider>,
    )
  })
}
