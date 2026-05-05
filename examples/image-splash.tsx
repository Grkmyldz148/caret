/**
 * Caret image-splash — splash any image with caching
 *
 *   pnpm --filter @caret/examples image-splash -- <path> [title] [subtitle]
 *
 * Generic version of nibgat-splash. Pass ANY image path, and Caret will:
 *   1. On first run: convert the image with imageToArt(), cache the
 *      result next to the source file as `.<filename>.caret-cache.txt`
 *   2. On subsequent runs: load the cached art instantly
 *
 *   tsx image-splash.tsx ~/Downloads/my-logo.png 'My CLI' 'v2.0.0'
 *   tsx image-splash.tsx ./vercel.png Vercel 'Deploy frontends'
 *
 * Delete the .caret-cache.txt file to regenerate.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { imageToArt, splash, success, info, error } from '@caret/registry'

const LOGO_WIDTH = 60
const LOGO_MODE = 'ascii' as const

async function getCachedArt(imagePath: string): Promise<string> {
  const dir = dirname(imagePath)
  const base = basename(imagePath)
  // Mode + width in the cache name so changes auto-invalidate.
  const cache = join(dir, `.${base}.${LOGO_MODE}.w${LOGO_WIDTH}.caret-cache.txt`)

  if (existsSync(cache)) {
    return readFileSync(cache, 'utf8')
  }

  info(`Converting ${base} (one-time, cached for next run)…`)
  const art = await imageToArt(imagePath, { mode: LOGO_MODE, width: LOGO_WIDTH })
  writeFileSync(cache, art, 'utf8')
  return art
}

async function main(): Promise<void> {
  const imagePath = process.argv[2]
  const title = process.argv[3] ?? 'My CLI'
  const subtitle = process.argv[4]

  if (!imagePath) {
    error('Missing image path', {
      hint: 'Usage: image-splash <path> [title] [subtitle]',
      see: 'examples/image-splash.tsx',
      exit: 1,
    })
    return
  }

  const logo = await getCachedArt(imagePath)

  await splash({
    logo,
    title,
    ...(subtitle !== undefined ? { subtitle } : {}),
  })

  success('Ready')
}

main().catch((err: unknown) => {
  process.stderr.write(`${err instanceof Error ? err.stack ?? err.message : String(err)}\n`)
  process.exit(1)
})
