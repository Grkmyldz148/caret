/**
 * Caret smart-typewriter component
 *
 * Enhanced typewriter that types with "human-like" rhythm — variable
 * speed, thinking pauses at punctuation, word-level grouping.
 *
 *   await smartTypewriter('Analyzing your codebase... Found 47 issues. Fixing now.')
 *   await smartTypewriter(text, {
 *     speed: 'thoughtful',
 *     cursor: true,
 *   })
 *
 * Speed profiles:
 *   fast:       25ms base, 100ms punctuation pause
 *   normal:     45ms base, 200ms punctuation pause
 *   thoughtful: 60ms base, 400ms punctuation pause, 800ms initial pause
 *   dramatic:   80ms base, 600ms punctuation pause, 1200ms initial pause
 *
 * Auto-instant under reduced motion or non-TTY.
 */

import React, { useState, useEffect, useRef } from 'react'
import { Text, render } from 'ink'
import { ThemeProvider, useTheme } from '../theme/index.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'

export type SpeedProfile = 'fast' | 'normal' | 'thoughtful' | 'dramatic'

type SpeedConfig = {
  baseMs: number
  punctuationMs: number
  initialPauseMs: number
}

const SPEED_PROFILES: Record<SpeedProfile, SpeedConfig> = {
  fast:       { baseMs: 25,  punctuationMs: 100, initialPauseMs: 0    },
  normal:     { baseMs: 45,  punctuationMs: 200, initialPauseMs: 0    },
  thoughtful: { baseMs: 60,  punctuationMs: 400, initialPauseMs: 800  },
  dramatic:   { baseMs: 80,  punctuationMs: 600, initialPauseMs: 1200 },
}

/** Characters that trigger a punctuation pause */
const PUNCTUATION = new Set(['.', ',', '!', '?', ':', '\u2014']) // \u2014 is em-dash

/** Period-like characters get an extra-long pause */
const SENTENCE_END = new Set(['.', '!', '?'])

/**
 * Compute the delay after typing a given character.
 * Applies random variation of +/-30% on the base delay.
 */
function charDelay(char: string, config: SpeedConfig): number {
  const jitter = 0.7 + Math.random() * 0.6 // 0.7 — 1.3

  if (SENTENCE_END.has(char)) {
    return config.punctuationMs * jitter
  }
  if (PUNCTUATION.has(char)) {
    return (config.punctuationMs * 0.6) * jitter
  }
  return config.baseMs * jitter
}

type SmartTypewriterViewProps = {
  text: string
  config: SpeedConfig
  showCursor: boolean
  onComplete: () => void
}

function SmartTypewriterView({
  text,
  config,
  showCursor,
  onComplete,
}: SmartTypewriterViewProps) {
  const theme = useTheme()
  const [displayed, setDisplayed] = useState<string>('')
  const [cursorVisible, setCursorVisible] = useState<boolean>(true)
  const [done, setDone] = useState<boolean>(false)
  const cap = capability()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Main typing effect
  useEffect(() => {
    if (cap.reducedMotion || !cap.isTTY) {
      setDisplayed(text)
      setDone(true)
      const t = setTimeout(onComplete, 50)
      return () => clearTimeout(t)
    }

    let charIndex = 0
    let cancelled = false

    function typeNext() {
      if (cancelled) return

      if (charIndex >= text.length) {
        setDone(true)
        setTimeout(onComplete, 100)
        return
      }

      charIndex++
      setDisplayed(text.slice(0, charIndex))

      const typed = text[charIndex - 1]!
      const delay = charDelay(typed, config)

      timerRef.current = setTimeout(typeNext, delay)
    }

    // Initial pause for thoughtful/dramatic profiles
    if (config.initialPauseMs > 0) {
      timerRef.current = setTimeout(typeNext, config.initialPauseMs)
    } else {
      typeNext()
    }

    return () => {
      cancelled = true
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [text, config])

  // Cursor blink effect
  useEffect(() => {
    if (!showCursor || done || cap.reducedMotion || !cap.isTTY) return

    const interval = setInterval(() => {
      setCursorVisible((v) => !v)
    }, 530)

    return () => clearInterval(interval)
  }, [showCursor, done, cap.reducedMotion, cap.isTTY])

  const cursor = theme.symbols.cursor
  const shouldShowCursor = showCursor && !done && cursorVisible

  return (
    <Text>
      {displayed}
      {shouldShowCursor && (
        <Text color={theme.colors.accent.default}>{cursor}</Text>
      )}
    </Text>
  )
}

export type SmartTypewriterOptions = {
  /** Typing speed profile. Default: 'normal'. */
  speed?: SpeedProfile
  /** Show a blinking cursor during typing. Default: false. */
  cursor?: boolean
  theme?: PartialTheme
}

export async function smartTypewriter(
  text: string,
  options: SmartTypewriterOptions = {},
): Promise<void> {
  const speed = options.speed ?? 'normal'
  const showCursor = options.cursor ?? false
  const config = SPEED_PROFILES[speed]

  return new Promise<void>((resolve) => {
    const app = render(
      <ThemeProvider theme={options.theme}>
        <SmartTypewriterView
          text={text}
          config={config}
          showCursor={showCursor}
          onComplete={() => {
            app.unmount()
            resolve()
          }}
        />
      </ThemeProvider>,
    )
  })
}
