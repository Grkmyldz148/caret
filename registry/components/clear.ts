/**
 * Caret clear utility
 *
 * Clears the terminal screen and moves the cursor to the top-left.
 * Use sparingly — clearing the screen erases context the user may need.
 *
 *   clear()
 *
 * Auto-skips in non-TTY (pipe, log redirect) since clearing pipes
 * makes no sense and would just print escape codes.
 */

import { capability } from '../lib/capability.js'

export function clear(): void {
  const cap = capability()
  if (!cap.isTTY || cap.dumb) return
  // ESC [2J clears the screen, ESC [H moves cursor to home
  process.stdout.write('\x1b[2J\x1b[H')
}
