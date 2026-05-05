/**
 * Caret nibgat splash — image-to-art with cache
 *
 *   pnpm --filter @caret/examples nibgat-splash
 *
 * The first run reads /Users/gorkemyildiz/Downloads/logo.png, converts
 * it to truecolor block art via imageToArt(), and writes the result to
 * a local cache file. Subsequent runs read the cache directly — fast,
 * no jimp overhead, and the splash starts instantly.
 *
 * To regenerate the cache, delete .nibgat-logo.cache.txt and run again.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { imageToArt, splash, success, info } from '@caret/registry'

const __dirname = dirname(fileURLToPath(import.meta.url))

const LOGO_SOURCE = '/Users/gorkemyildiz/Downloads/logo.png'
const LOGO_WIDTH = 70
const LOGO_MODE = 'ascii' as const
// Mode + width are part of the cache key so changing them auto-invalidates.
const CACHE_FILE = join(__dirname, `.nibgat-logo.${LOGO_MODE}.w${LOGO_WIDTH}.cache.txt`)

async function getNibgatLogo(): Promise<string> {
  if (existsSync(CACHE_FILE)) {
    return readFileSync(CACHE_FILE, 'utf8')
  }

  info('Converting logo (one-time, cached for next run)…')
  const art = await imageToArt(LOGO_SOURCE, {
    mode: LOGO_MODE,
    width: LOGO_WIDTH,
  })
  writeFileSync(CACHE_FILE, art, 'utf8')
  return art
}

async function main(): Promise<void> {
  const logo = await getNibgatLogo()

  await splash({
    logo,
    title: 'nibgat',
    subtitle: 'The design system for everything else',
  })

  success('Ready')
}

main().catch((err: unknown) => {
  process.stderr.write(`${err instanceof Error ? err.stack ?? err.message : String(err)}\n`)
  process.exit(1)
})
