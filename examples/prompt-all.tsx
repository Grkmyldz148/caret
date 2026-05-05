/**
 * Caret prompt — full variant tour
 *
 *   pnpm --filter @caret/examples prompt:all
 *
 * Walks through every prompt variant in sequence and prints the resolved
 * values at the end. Press esc at any prompt to cancel; ctrl+c to exit.
 */

import { prompt, CaretCancelled } from '@caret/registry/components/index.js'

async function main(): Promise<void> {
  try {
    const name = await prompt.text({
      label: 'Project name',
      description: 'What should we call your project?',
      placeholder: 'my-project',
      validate: (v) =>
        /^[a-z][a-z0-9-]*$/.test(v) ? null : 'Lowercase letters, numbers, and dashes only',
    })

    const framework = await prompt.select({
      label: 'Framework',
      description: 'Choose your frontend framework',
      options: [
        { value: 'next', label: 'Next.js' },
        { value: 'remix', label: 'Remix' },
        { value: 'svelte', label: 'SvelteKit' },
        { value: 'astro', label: 'Astro' },
      ],
      default: 'next',
    })

    const features = await prompt.multiSelect({
      label: 'Features',
      description: 'Select what to include',
      options: [
        { value: 'auth', label: 'Authentication' },
        { value: 'db', label: 'Database' },
        { value: 'email', label: 'Email' },
        { value: 'storage', label: 'File storage' },
      ],
      defaults: ['auth', 'db'],
      min: 1,
    })

    const token = await prompt.password({
      label: 'API token',
      description: 'Paste your personal access token',
    })

    const port = await prompt.number({
      label: 'Port',
      description: 'Local development port',
      default: 3000,
      min: 1024,
      max: 65535,
    })

    const ok = await prompt.confirm({
      label: 'Looks good?',
      description: 'Continue with these settings',
      default: true,
    })

    process.stdout.write('\nResolved:\n')
    process.stdout.write(`  name:       ${name}\n`)
    process.stdout.write(`  framework:  ${framework}\n`)
    process.stdout.write(`  features:   ${features.join(', ')}\n`)
    process.stdout.write(`  token:      ${'•'.repeat(token.length)}\n`)
    process.stdout.write(`  port:       ${port}\n`)
    process.stdout.write(`  confirmed:  ${ok}\n`)
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
