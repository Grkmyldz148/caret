import type { Metadata } from 'next'
import Link from 'next/link'
import { Callout, CodeBlock, Prose } from '@/components/docs/Prose'

export const metadata: Metadata = {
  title: 'AI-native workflow — Caret docs',
  description:
    'How Caret stays on-brand when an LLM is writing your CLI. The caret.md instruction file, the rules it enforces, and the AI tools it works with.',
}

export default function AiNativePage() {
  return (
    <Prose>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
        Authoring · AI-native workflow
      </div>
      <h1>AI-native workflow</h1>
      <p>
        Most CLIs written this year and next will be authored by an AI assistant.
        Caret was designed with that in mind — every component has a spec, every
        token is named, every error is structured. The{' '}
        <code>caret.md</code> file ties it together: a single instruction document
        that tells Claude, Cursor, Codex, or Copilot exactly how to use Caret on the
        first try.
      </p>

      <h2 id="how-it-works">How it works</h2>
      <p>
        When you scaffold with <code>caret init</code>, Caret writes a{' '}
        <code>caret.md</code> at your repo root. It's a short, opinionated rule book
        — not documentation. AI assistants read it before generating CLI code and
        produce output that uses Caret components instead of <code>chalk</code>,{' '}
        <code>ora</code>, <code>console.log</code>, or whatever else is in their
        training data.
      </p>

      <Callout kind="success" title="Verified with">
        Claude Code, Cursor, Codex, GitHub Copilot. The file uses standard markdown
        and idiomatic code blocks, so any tool that consumes repo-level instructions
        picks it up.
      </Callout>

      <h2 id="example">An example</h2>
      <p>
        Without <code>caret.md</code>, asking an LLM to "add a deploy command with a
        spinner and an error message" typically produces something like:
      </p>
      <CodeBlock language="ts">{`import chalk from 'chalk'
import ora from 'ora'

const spinner = ora('Deploying').start()
try {
  await deploy()
  spinner.succeed(chalk.green('Done'))
} catch (e) {
  spinner.fail(chalk.red('Error: ' + e.message))
}`}</CodeBlock>
      <p>With <code>caret.md</code> in the repo:</p>
      <CodeBlock language="ts">{`import { spinner, error } from './caret'

await spinner('Deploying', async () => {
  await deploy()
}, { onSuccess: 'Deployed' })`}</CodeBlock>
      <p>
        The second one is a Caret CLI. It respects <code>NO_COLOR</code>, falls back
        on dumb terminals, and prints structured errors with <code>hint:</code> and{' '}
        <code>see:</code> URLs — without you asking for any of it.
      </p>

      <h2 id="rules">Rules in caret.md</h2>
      <p>
        The hard rules <code>caret.md</code> enforces:
      </p>
      <ul>
        <li>
          <strong>Don't import</strong> <code>chalk</code>, <code>kleur</code>,{' '}
          <code>picocolors</code>, <code>ora</code>, <code>cli-spinners</code>,{' '}
          <code>enquirer</code>, <code>prompts</code>, <code>clack</code>,{' '}
          <code>inquirer</code>, <code>cli-table</code>. Caret owns those layers.
        </li>
        <li>
          <strong>Use <code>error()</code> not <code>throw</code></strong> at the CLI
          boundary. Errors are display, not control flow.
        </li>
        <li>
          <strong>Wrap long-running async work</strong> in{' '}
          <code>spinner('label', fn)</code>.
        </li>
        <li>
          <strong>stdout is for data, stderr is for messages.</strong> Caret
          components route automatically; never <code>console.log</code> a status
          message.
        </li>
        <li>
          <strong>Never customize Caret symbols.</strong>{' '}
          <code>^ ▸ ● ○ ✓ ✗ ⚠ — │</code> are the brand.
        </li>
        <li>
          <strong>Never set the terminal background.</strong>
        </li>
        <li>
          <strong>Never use the terminal bell.</strong> Use{' '}
          <code>caret.notify</code> for system notifications.
        </li>
      </ul>

      <h2 id="catalog">Component catalog as a contract</h2>
      <p>
        <code>caret.md</code> includes a cheat sheet for every component — exact
        signature, common props, idiomatic call site. AI assistants treat it as the
        ground truth and don't have to invent prop names.
      </p>
      <CodeBlock language="ts">{`// Excerpt from the cheat sheet:

await spinner('Building', async () => {
  await build()
}, { onSuccess: 'Built', onFailure: 'Build failed' })

error('Deploy failed', {
  body: 'Vercel returned 401.',
  hint: 'Run my-cli login to refresh your token.',
  see: 'https://my-cli.dev/docs/auth',
})

const region = await prompt.select({
  label: 'Region',
  options: [
    { value: 'us-east-1', label: 'US East' },
    { value: 'eu-west-1', label: 'Europe' },
  ],
})`}</CodeBlock>

      <h2 id="custom">Adding rules to caret.md</h2>
      <p>
        Project-specific conventions belong in the same file. Append your own rules
        — error code prefixes, custom theme colors, a domain glossary. AI assistants
        will read them on every interaction.
      </p>

      <hr />
      <p>
        Continue with{' '}
        <Link href="/docs/concepts/principles">Principles</Link> for the philosophy
        the rules in <code>caret.md</code> follow, or browse the{' '}
        <Link href="/components">component catalog</Link> to see the cheat sheet
        applied at scale.
      </p>
    </Prose>
  )
}
