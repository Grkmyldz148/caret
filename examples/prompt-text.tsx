/**
 * Caret prompt.text — runnable example
 *
 *   pnpm install        # in the workspace root
 *   pnpm --filter @caret/examples prompt:text
 *
 * or directly:
 *
 *   cd examples && npx tsx prompt-text.tsx
 *
 * Press enter to submit, esc to cancel, ctrl+c to exit.
 */

import { prompt, CaretCancelled } from '@caret/registry/components/index.js'

async function main(): Promise<void> {
  try {
    const name = await prompt.text({
      label: 'Project name',
      description: 'What should we call your project?',
      placeholder: 'my-project',
      validate: (v) =>
        /^[a-z][a-z0-9-]*$/.test(v)
          ? null
          : 'Lowercase letters, numbers, and dashes only',
    })

    process.stdout.write(`\nResolved: ${name}\n`)
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
