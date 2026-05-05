/**
 * Caret celebrate component
 *
 * A one-liner celebration for successful deploys, completed tasks, or
 * milestone moments. Combines braille text transition, confetti, and an
 * OS notification sound into a single dramatic effect.
 *
 *   await celebrate('DEPLOY COMPLETE')
 *   await celebrate('v1.0 RELEASED', { sound: false })
 *   await celebrate('ALL TESTS PASSED', { notify: true })
 *
 * Under reduced motion / non-TTY: prints the message on one line with a
 * success symbol and resolves immediately.
 */

import { brailleTransition } from './braille-transition.js'
import { confetti } from './confetti.js'
import { notifyDone } from '../lib/notify.js'
import { getTheme } from '../theme/global.js'
import { mergeTheme } from '../theme/merge.js'
import { paintAccent, paintBold } from '../lib/paint.js'
import { capability } from '../lib/capability.js'
import type { PartialTheme } from '../theme/types.js'

export type CelebrateOptions = {
  /** Confetti duration in ms. Default: 2000. */
  duration?: number
  /** Number of confetti particles. Default: 40. */
  density?: number
  /** Send an OS notification with the celebrate text. Default: false. */
  notify?: boolean
  /** Play a success sound. Default: true. */
  sound?: boolean
  theme?: PartialTheme
}

export async function celebrate(
  message: string,
  options: CelebrateOptions = {},
): Promise<void> {
  const theme = mergeTheme(getTheme(), options.theme)
  const cap = capability()

  // Fire the OS notification early so the sound lands during the animation
  if (options.notify === true || options.sound !== false) {
    // The notify lib plays a system sound on macOS via afplay, even when
    // `notify` is not explicitly requested — but only if we call it.
    notifyDone(message, {
      sound: options.sound === false ? false : undefined,
    }).catch(() => {})
  }

  // Reduced-motion / non-TTY: no animation, just a marked line
  if (cap.reducedMotion || !cap.isTTY) {
    const accent = paintAccent(theme)
    const bold = paintBold()
    const mark = theme.symbols.state.success
    process.stdout.write(`${accent(mark)} ${bold(message)}\n`)
    return
  }

  // 1. Reveal the message via braille transition
  await brailleTransition({
    text: message,
    direction: 'in',
    duration: 700,
    stagger: 20,
    theme: options.theme,
  })

  // 2. Shower confetti over the same area
  await confetti({
    duration: options.duration ?? 2000,
    density: options.density ?? 40,
    theme: options.theme,
  })
}
