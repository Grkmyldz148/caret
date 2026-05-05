import type { Metadata } from 'next'
import Link from 'next/link'
import { Callout, CodeBlock, Prose } from '@/components/docs/Prose'

export const metadata: Metadata = {
  title: 'Your first CLI — Caret docs',
  description:
    'Build a tiny but real CLI with Caret in five minutes. Prompt the user, run an async task with a spinner, print a structured error.',
}

export default function FirstCliPage() {
  return (
    <Prose>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
        Overview · Your first CLI
      </div>
      <h1>Your first CLI</h1>
      <p>
        This page walks through scaffolding a new CLI, prompting the user,
        running an async task with a spinner, and printing a structured
        error. About five minutes end-to-end.
      </p>

      <h2 id="scaffold">Scaffold</h2>
      <CodeBlock language="sh">{`npx caret-cli init deploy-cli
cd deploy-cli
npm install`}</CodeBlock>
      <p>
        <code>init</code> writes <code>package.json</code>, <code>tsconfig.json</code>,
        <code> src/index.ts</code>, and a <code>caret.md</code> AI-instruction
        file. The starter <code>src/index.ts</code> is a working CLI you can
        run with <code>npm run dev</code> immediately.
      </p>

      <h2 id="add">Add the components you need</h2>
      <p>
        The starter ships with no components yet — pull only what you use.
      </p>
      <CodeBlock language="sh">{`npx caret-cli add prompt
npx caret-cli add spinner
npx caret-cli add error`}</CodeBlock>
      <p>
        Files land under <code>caret/</code>. Each <code>add</code> prints
        the runtime dependencies the component declares — install them once.
      </p>

      <h2 id="write">Write the deploy command</h2>
      <p>
        Replace <code>src/index.ts</code> with this. Three primitives, no
        provider, no theme object.
      </p>
      <CodeBlock filename="src/index.ts">{`import { prompt, spinner, error, success } from './caret'

async function main() {
  const project = await prompt.text({
    label: 'Project name',
    validate: (v) => v.length > 0 ? null : 'Required',
  })

  const env = await prompt.select({
    label: 'Environment',
    options: [
      { value: 'staging', label: 'Staging' },
      { value: 'prod',    label: 'Production' },
    ],
    default: 'staging',
  })

  await spinner(\`Deploying \${project} to \${env}\`, async () => {
    await fakeDeploy(env)
  }, { onSuccess: \`\${project} is live\` })

  success('Done')
}

async function fakeDeploy(env: string) {
  await new Promise((r) => setTimeout(r, 1500))
  if (env === 'prod' && Math.random() < 0.2) {
    throw new Error('Health check failed')
  }
}

main().catch((e) => {
  error('Deploy failed', {
    body: e instanceof Error ? e.message : String(e),
    hint: 'Check the deploy logs and re-run.',
    see: 'https://caret.dev/docs/cli',
  })
  process.exit(1)
})`}</CodeBlock>

      <h2 id="run">Run it</h2>
      <CodeBlock language="sh">{`npm run dev`}</CodeBlock>
      <p>
        You'll see a prompt for the project name, then a select for the
        environment, then a braille spinner that resolves into either a
        green <code>✓</code> or — about one in five times in production — a
        Rust-style error block with <code>hint</code> and <code>see</code>.
      </p>

      <Callout kind="info" title="No theme, no provider">
        The CLI you just wrote has zero configuration. Caret reads the
        active terminal capabilities, picks the right symbol set, and
        respects <code>NO_COLOR</code>. You don't enable any of this — it's
        the manifesto's "Correctness is not opt-in" rule.
      </Callout>

      <h2 id="next">Next</h2>
      <ul>
        <li>
          <Link href="/docs/concepts/principles">Principles</Link> — the
          rules every Caret decision comes back to.
        </li>
        <li>
          <Link href="/docs/cli">CLI reference</Link> — every command, flag,
          and exit code.
        </li>
        <li>
          <Link href="/components">Component catalog</Link> — what else you
          can <code>add</code>.
        </li>
      </ul>
    </Prose>
  )
}
