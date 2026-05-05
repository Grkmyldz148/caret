/**
 * Caret splash — demo
 *
 *   pnpm --filter @caret/examples splash
 *
 * The full opening experience: ASCII logo + title + subtitle, with
 * phased reveal animation. Two ways to provide the logo:
 *   1. A pre-rendered ASCII string (you supply the art)
 *   2. A { text, font } object — figlet converts it
 */

import { splash, success } from '@caret/registry'

async function main(): Promise<void> {
  // Text-based logo (figlet generates it for us)
  await splash({
    logo: { text: 'caret' },
    title: 'Caret',
    subtitle: 'The design system for modern command-line tools',
  })

  success('Ready')
}

main().catch((err: unknown) => {
  process.stderr.write(`${err instanceof Error ? err.stack ?? err.message : String(err)}\n`)
  process.exit(1)
})
