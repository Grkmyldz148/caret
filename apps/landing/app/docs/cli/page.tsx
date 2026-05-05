import type { Metadata } from 'next'
import { CodeBlock, Prose, PropTable } from '@/components/docs/Prose'

export const metadata: Metadata = {
  title: 'CLI — Caret docs',
  description:
    'Every command, flag, and exit code for the caret-cli binary.',
}

export default function CliOverviewPage() {
  return (
    <Prose>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
        CLI · Overview
      </div>
      <h1>CLI</h1>
      <p>
        <code>caret-cli</code> is a one-shot installer. Each command runs to
        completion and exits — there is no daemon, no long-running process, no
        config file to maintain.
      </p>

      <h2 id="commands">Commands</h2>
      <PropTable
        headers={['Command', 'Purpose']}
        rows={[
          ['caret init [name]', 'Scaffold a new CLI project with Caret preinstalled'],
          ['caret add <component>', 'Copy a registered component into the current project'],
          ['caret list', 'Print every component the bundled registry exposes'],
          ['caret help', 'Show the splash + usage'],
          ['caret --version', 'Print the installed version'],
        ]}
      />

      <h2 id="init">caret init</h2>
      <p>
        Creates a new directory containing a runnable starter project: a typed entry
        file, a tsconfig, a <code>caret.md</code> AI-instruction file, and a{' '}
        <code>.gitignore</code>.
      </p>
      <CodeBlock language="sh">{`caret init my-cli`}</CodeBlock>
      <p>
        If the target directory already exists, init aborts with a non-zero exit code.
        Pick a fresh path or remove the existing directory first.
      </p>

      <h2 id="add">caret add</h2>
      <p>
        Copies the files for a single component (and its peer files, if any) into the
        current project. Default destination is <code>caret/&lt;component&gt;/</code>.
      </p>
      <CodeBlock language="sh">{`caret add prompt
caret add spinner --dir src/ui`}</CodeBlock>
      <PropTable
        headers={['Flag', 'Default', 'Description']}
        rows={[
          ['--dir <path>', 'caret', 'Target directory (relative to cwd)'],
        ]}
      />
      <p>
        After copying, <code>add</code> prints any runtime dependencies the component
        declares (typically <code>ink</code>, <code>react</code>, <code>chalk</code>) so
        you can <code>npm install</code> them.
      </p>

      <h2 id="list">caret list</h2>
      <p>
        Lists every component in the bundled registry, grouped by kind, with a
        one-line description for each. Useful as a quick reference; the full catalog
        with live previews is at <code>/components</code>.
      </p>
      <CodeBlock language="sh">{`caret list`}</CodeBlock>

      <h2 id="exit-codes">Exit codes</h2>
      <PropTable
        headers={['Code', 'Meaning']}
        rows={[
          ['0', 'Success'],
          ['1', 'Generic failure (unknown command, missing component, IO error)'],
        ]}
      />

      <h2 id="environment">Environment</h2>
      <PropTable
        headers={['Variable', 'Effect']}
        rows={[
          ['NO_COLOR', 'Strips all color from CLI output (and from components Caret renders)'],
          ['CI', 'Adopted by Caret components for non-interactive fallbacks'],
        ]}
      />
    </Prose>
  )
}
