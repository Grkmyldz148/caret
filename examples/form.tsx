/**
 * Caret form — demo
 *
 *   pnpm --filter @caret/examples form
 */

import { form, success, CaretCancelled } from '@caret/registry'

async function main(): Promise<void> {
  try {
    const result = await form({
      title: 'Create project',
      description: 'Configure your new project (tab to navigate)',
      fields: [
        {
          name: 'name',
          label: 'Project name',
          type: 'text',
          description: 'Lowercase letters and dashes',
          validate: (v) =>
            typeof v === 'string' && /^[a-z][a-z0-9-]*$/.test(v)
              ? null
              : 'Lowercase letters, numbers, and dashes only',
        },
        {
          name: 'environment',
          label: 'Environment',
          type: 'select',
          default: 'production',
          options: [
            { value: 'staging', label: 'Staging' },
            { value: 'production', label: 'Production' },
          ],
        },
        {
          name: 'auth',
          label: 'Enable authentication',
          type: 'confirm',
          default: true,
        },
        {
          name: 'token',
          label: 'API token (optional)',
          type: 'password',
        },
      ],
    })

    success('Project configured')
    process.stdout.write('\nResolved:\n')
    process.stdout.write(JSON.stringify(result, null, 2) + '\n')
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
