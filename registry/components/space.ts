/**
 * Caret space utility
 *
 * Writes vertical whitespace to stdout. A cleaner alternative to
 * `process.stdout.write('\n')` when you want N blank lines.
 *
 *   space()       // 1 blank line
 *   space(3)      // 3 blank lines
 */

export function space(lines = 1): void {
  if (lines < 1) return
  process.stdout.write('\n'.repeat(lines))
}
