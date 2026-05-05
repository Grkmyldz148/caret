/**
 * Caret theme override — demo
 *
 *   pnpm --filter @caret/examples theme:override
 *
 * Shows how to re-skin Caret globally via setTheme(). Every component
 * after this point uses the orange accent and diamond anchor.
 */

import { setTheme } from '@caret/registry/theme/index.js'
import { prompt, CaretCancelled } from '@caret/registry/components/index.js'

setTheme({
  colors: {
    accent: {
      default: '#FF6B35',
      muted: '#B84A22',
      emphasized: '#FF8B5A',
    },
  },
  symbols: {
    anchor: '◆',
    prefix: { focused: '›', idle: '·' },
    marker: { selected: '◉', unselected: '◯' },
  },
})

async function main(): Promise<void> {
  try {
    const name = await prompt.text({
      label: 'Project name',
      description: 'Notice the orange accent and diamond anchor',
      placeholder: 'my-project',
    })

    const framework = await prompt.select({
      label: 'Framework',
      description: 'Custom markers, custom accent',
      options: [
        { value: 'next', label: 'Next.js' },
        { value: 'remix', label: 'Remix' },
        { value: 'astro', label: 'Astro' },
      ],
    })

    process.stdout.write(`\nResolved: ${name} on ${framework}\n`)
  } catch (err) {
    if (err instanceof CaretCancelled) {
      process.stdout.write('\nCancelled.\n')
      process.exit(130)
    }
    throw err
  }
}

main().catch((err: unknown) => {
  process.stderr.write(`${err instanceof Error ? err.stack ?? err.message : String(err)}\n`)
  process.exit(1)
})
