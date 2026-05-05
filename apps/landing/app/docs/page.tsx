import type { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock, Prose } from '@/components/docs/Prose'

export const metadata: Metadata = {
  title: 'Getting started — Caret docs',
  description:
    'A quick tour of Caret — what it is, what you copy into your repo, and how to ship a CLI that looks like a design-led product on day one.',
}

export default function GettingStartedPage() {
  return (
    <Prose>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
        Overview · Getting started
      </div>
      <h1>Getting started</h1>
      <p>
        Caret is a copy-paste design system for command-line tools. You run{' '}
        <code>npx caret-cli init</code> to scaffold a new CLI, then{' '}
        <code>caret add &lt;component&gt;</code> for each primitive — prompts, spinners,
        tables, errors. The components land in your repo as plain TypeScript files;
        you own them from there.
      </p>

      <h2 id="why-caret">Why Caret</h2>
      <p>
        The web has shadcn/ui. The terminal has nothing equivalent — every CLI
        invents its own colors, spinners, error messages, and prompts, and the result
        looks like five libraries glued together. Caret is the missing layer: one
        opinionated visual identity, one token system, one set of primitives that
        respect <code>NO_COLOR</code>, narrow terminals, and screen readers without
        you opting in to anything.
      </p>

      <h2 id="install">Install</h2>
      <p>
        Caret has no runtime dependency. The CLI is a one-shot installer — it scaffolds
        a project or copies a single component, then exits.
      </p>
      <CodeBlock language="sh">{`# scaffold a new CLI with Caret preinstalled
npx caret-cli init my-cli

# add a component to an existing project
npx caret-cli add prompt
npx caret-cli add spinner

# list every component the registry knows about
npx caret-cli list`}</CodeBlock>
      <p>
        See <Link href="/docs/install">Install</Link> for the full breakdown of what{' '}
        <code>init</code> creates and how the registry resolves component files.
      </p>

      <h2 id="first-cli">Your first CLI</h2>
      <p>
        After <code>caret init my-cli</code>, the project compiles and runs out of the
        box. The starter <code>src/index.ts</code> looks like this:
      </p>
      <CodeBlock filename="src/index.ts">{`import { prompt, success, spinner } from './caret'

const name = await prompt.text({
  label: 'Project name',
  validate: (v) => v.length > 0 ? null : 'Required',
})

await spinner('Deploying', async () => {
  await deploy(name)
}, { onSuccess: 'Deployed' })

success(\`\${name} is live\`)`}</CodeBlock>
      <p>
        Three primitives, no provider, no theme object you forgot to pass down. The
        rest of the manual is on this site — start with{' '}
        <Link href="/docs/concepts/principles">Principles</Link> for what Caret will
        and won't do, then{' '}
        <Link href="/docs/concepts/tokens">Tokens</Link> for how to skin it.
      </p>

      <h2 id="how-it-works">How it works</h2>
      <p>
        Caret has four layers, top-down:
      </p>
      <ul>
        <li>
          <strong>Components</strong> — React components rendered with{' '}
          <a href="https://github.com/vadimdemedes/ink">Ink</a>. Each one is one file
          you can read in a single sitting. They write inline output (scrollback-friendly,
          pipe-friendly), not fullscreen.
        </li>
        <li>
          <strong>Tokens</strong> — colors, motion, symbols, spacing, and typography.
          The component layer never hard-codes hex values; everything routes through
          the token system, so a single <code>setTheme()</code> call re-skins the entire
          tool.
        </li>
        <li>
          <strong>Capability</strong> — <code>lib/capability.ts</code> detects TTY,{' '}
          <code>NO_COLOR</code>, narrow terminals, and reduced motion. Every component
          consults it before painting; that's why colors degrade through truecolor → 256
          → ANSI 16 → plain without your code knowing.
        </li>
        <li>
          <strong>Spec</strong> — every component is documented in{' '}
          <code>specs/&lt;name&gt;.md</code> as the source of truth. If you fork a
          component or port Caret to another language, the spec is what binds them.
        </li>
      </ul>

      <h2 id="next">Next</h2>
      <p>
        Pick a direction:
      </p>
      <ul>
        <li>
          <Link href="/docs/cli">CLI</Link> — every command, every flag.
        </li>
        <li>
          <Link href="/docs/concepts/principles">Principles</Link> — the ten rules every
          Caret decision comes back to.
        </li>
        <li>
          <Link href="/docs/concepts/tokens">Tokens</Link> — the palette, motion, and
          symbol set you'll override.
        </li>
        <li>
          <Link href="/docs/authoring/ai-native">AI-native workflow</Link> — drop{' '}
          <code>caret.md</code> into your repo and Claude / Cursor / Copilot produce
          on-brand Caret code on the first try.
        </li>
        <li>
          <Link href="/components">Component catalog</Link> — 80+ primitives with live
          previews.
        </li>
      </ul>
    </Prose>
  )
}
