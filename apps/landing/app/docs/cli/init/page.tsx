import type { Metadata } from 'next'
import Link from 'next/link'
import { Callout, CodeBlock, Prose, PropTable } from '@/components/docs/Prose'

export const metadata: Metadata = {
  title: 'caret init — Caret docs',
  description:
    'Scaffold a new CLI project with Caret preinstalled. Files written, defaults, exit codes.',
}

export default function CaretInitPage() {
  return (
    <Prose>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
        CLI · caret init
      </div>
      <h1>caret init</h1>
      <p>
        Creates a new directory with a runnable starter project: a typed
        entry file, a tsconfig, an AI-instruction file, and a{' '}
        <code>.gitignore</code>. After init, the project compiles and runs
        out of the box.
      </p>

      <h2 id="usage">Usage</h2>
      <CodeBlock language="sh">{`caret init <name>
# or
npx caret-cli init <name>`}</CodeBlock>

      <h2 id="written">Files written</h2>
      <PropTable
        headers={['File', 'Purpose']}
        rows={[
          ['package.json', 'tsx for dev, tsc for build, ink + react as runtime deps'],
          ['tsconfig.json', 'Strict mode, ESM, JSX preset compatible with Ink'],
          ['src/index.ts', 'Tiny working CLI you can run immediately'],
          ['caret.md', 'AI-instruction file — Claude / Cursor / Copilot read this on every interaction'],
          ['.gitignore', 'node_modules, dist, *.log, .env'],
        ]}
      />

      <h2 id="defaults">What the starter index looks like</h2>
      <CodeBlock filename="src/index.ts">{`#!/usr/bin/env node

console.log('Hello, Caret!')
console.log('Run \`npx caret add prompt\` to add your first component.')`}</CodeBlock>
      <p>
        It's intentionally tiny. The first <code>caret add</code> is what
        turns this into a real Caret CLI — until then there are no
        components to import.
      </p>

      <h2 id="caret-md">Why caret.md ships at init time</h2>
      <p>
        Modern CLIs are mostly written by AI assistants. The{' '}
        <code>caret.md</code> file at your repo root is a short, opinionated
        rule book that tells Claude / Cursor / Copilot exactly how to use
        Caret on the first try. Without it the LLM produces{' '}
        <code>chalk</code> + <code>ora</code> code from its training set;
        with it, the same prompt produces idiomatic Caret.
      </p>
      <p>
        See <Link href="/docs/authoring/ai-native">AI-native workflow</Link>{' '}
        for what's in the file and how to extend it with your own rules.
      </p>

      <Callout kind="warning" title="Target directory must not exist">
        If <code>./&lt;name&gt;/</code> already exists, init aborts with
        exit code 1. Pick a fresh path or remove the existing directory
        first. Init will not overwrite a project in flight.
      </Callout>

      <h2 id="post">After init</h2>
      <CodeBlock language="sh">{`cd my-cli
npm install
npm run dev          # tsx src/index.ts

npx caret add prompt
npx caret add spinner`}</CodeBlock>

      <h2 id="exit">Exit codes</h2>
      <PropTable
        headers={['Code', 'Meaning']}
        rows={[
          ['0', 'Project scaffolded successfully'],
          ['1', 'Target directory exists, no name supplied, or IO error'],
        ]}
      />

      <p>
        Continue with <Link href="/docs/cli/add">caret add</Link>.
      </p>
    </Prose>
  )
}
