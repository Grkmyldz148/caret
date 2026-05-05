/**
 * Caret typewriter component
 *
 * Animates text appearing character by character. Use for dramatic
 * one-liners — version banners, slogans, "starting up" messages.
 *
 *   await typewriter('Welcome to my CLI v2.0')
 *   await typewriter({ text: 'Loading…', speed: 60 })
 *
 * Auto-instant under reduced motion or non-TTY.
 */

import React, { useState, useEffect } from 'react'
import { Text, render } from 'ink'
import { ThemeProvider } from '../theme/index.js'
import type { PartialTheme } from '../theme/types.js'
import { capability } from '../lib/capability.js'

type TypewriterViewProps = {
  text: string
  speed: number
  onComplete: () => void
}

function TypewriterView({ text, speed, onComplete }: TypewriterViewProps) {
  const [displayed, setDisplayed] = useState<string>('')
  const cap = capability()

  useEffect(() => {
    if (cap.reducedMotion || !cap.isTTY) {
      setDisplayed(text)
      const t = setTimeout(onComplete, 50)
      return () => clearTimeout(t)
    }

    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        setTimeout(onComplete, 100)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  return <Text>{displayed}</Text>
}

export type TypewriterOptions = {
  text: string
  /** Milliseconds per character. Default: 40. */
  speed?: number
  theme?: PartialTheme
}

export async function typewriter(input: string | TypewriterOptions): Promise<void> {
  const options: TypewriterOptions = typeof input === 'string' ? { text: input } : input
  const speed = options.speed ?? 40

  return new Promise<void>((resolve) => {
    const app = render(
      <ThemeProvider theme={options.theme}>
        <TypewriterView
          text={options.text}
          speed={speed}
          onComplete={() => {
            app.unmount()
            resolve()
          }}
        />
      </ThemeProvider>,
    )
  })
}
