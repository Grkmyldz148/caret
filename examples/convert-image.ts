/**
 * Caret convert-image — generic CLI tool
 *
 * Convert ANY image file (PNG, JPG, GIF, BMP, etc.) to ASCII art or
 * truecolor blocks. Output goes to stdout — pipe to a file to cache.
 *
 *   pnpm --filter @caret/examples convert-image <path> [mode] [width]
 *
 * Examples:
 *   tsx convert-image.ts ~/logos/my-cli.png
 *   tsx convert-image.ts ~/logos/my-cli.png color 60
 *   tsx convert-image.ts ~/logos/my-cli.png ascii 80
 *   tsx convert-image.ts ~/logos/my-cli.png mono 50
 *
 *   # Cache the result for use in your CLI
 *   tsx convert-image.ts ~/logos/my-cli.png > my-cli-logo.txt
 *
 * Modes:
 *   color (default) — truecolor half-block ▀ rendering, looks like the image
 *   ascii           — character density (' .:-=+*#%@'), no color
 *   mono            — character density in a single accent color
 */

import { imageToArt, type ImageToArtMode } from '@caret/registry'

async function main(): Promise<void> {
  const path = process.argv[2]
  const mode = (process.argv[3] as ImageToArtMode) ?? 'color'
  const widthArg = process.argv[4]
  const width = widthArg ? parseInt(widthArg, 10) : 60

  if (!path) {
    process.stderr.write('Usage: convert-image <path> [color|ascii|mono] [width]\n')
    process.stderr.write('\n')
    process.stderr.write('Examples:\n')
    process.stderr.write('  convert-image logo.png\n')
    process.stderr.write('  convert-image logo.png color 80\n')
    process.stderr.write('  convert-image logo.png ascii 60\n')
    process.stderr.write('  convert-image logo.png mono 50\n')
    process.exit(1)
  }

  if (!['color', 'ascii', 'mono'].includes(mode)) {
    process.stderr.write(`Invalid mode: ${mode}. Use color, ascii, or mono.\n`)
    process.exit(1)
  }

  if (!Number.isFinite(width) || width < 4 || width > 400) {
    process.stderr.write(`Invalid width: ${width}. Use 4-400.\n`)
    process.exit(1)
  }

  try {
    const art = await imageToArt(path, { mode, width })
    process.stdout.write(art + '\n')
  } catch (err) {
    process.stderr.write(
      `Failed to convert image: ${err instanceof Error ? err.message : String(err)}\n`,
    )
    process.exit(1)
  }
}

main()
