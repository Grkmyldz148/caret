import type { Metadata } from 'next'
import Link from 'next/link'
import { Callout, CodeBlock, Prose, PropTable } from '@/components/docs/Prose'

export const metadata: Metadata = {
  title: 'caret add — Caret docs',
  description:
    'Copy a registered component into the current project. Flags, file resolution, dependency installation.',
}

export default function CaretAddPage() {
  return (
    <Prose>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
        CLI · caret add
      </div>
      <h1>caret add</h1>
      <p>
        Copies the files for a single component (and any peer files it
        declares) into the current project. Files are physical sources —
        no symlinks, no <code>node_modules</code> dependency, no version
        bookkeeping. After <code>add</code>, you own the code.
      </p>

      <h2 id="usage">Usage</h2>
      <CodeBlock language="sh">{`caret add <component> [--dir <path>]
# or
npx caret-cli add <component>`}</CodeBlock>

      <h2 id="flags">Flags</h2>
      <PropTable
        headers={['Flag', 'Default', 'Description']}
        rows={[
          ['--dir <path>', 'caret/', 'Target directory (relative to cwd)'],
        ]}
      />

      <h2 id="resolution">Where files come from</h2>
      <p>
        The CLI ships its own copy of the registry inside the npm tarball.
        At <code>add</code> time it searches three locations in order:
      </p>
      <ol className="list-decimal pl-6 my-4 text-[15px] text-muted leading-relaxed">
        <li>
          Bundled with the package —{' '}
          <code>node_modules/caret-cli/registry/</code>
        </li>
        <li>
          Workspace dev environment — useful when contributing to Caret
          itself
        </li>
        <li>
          Current working directory — for advanced custom registry
          overrides
        </li>
      </ol>
      <p>
        First location applies to virtually every consumer.
      </p>

      <h2 id="example">Example</h2>
      <CodeBlock language="sh">{`$ caret add prompt
^ Adding prompt
  text, password, confirm, select, multi-select, number

  + caret/components/prompt/index.tsx
  + caret/components/prompt/shared.tsx
  + caret/components/prompt/text.tsx
  + caret/components/prompt/password.tsx
  + caret/components/prompt/confirm.tsx
  + caret/components/prompt/select.tsx
  + caret/components/prompt/multi-select.tsx
  + caret/components/prompt/number.tsx

✓ 8 file(s) written

Required dependencies:
  npm install ink react

See specs/prompt.md for the full specification.`}</CodeBlock>

      <h2 id="deps">Runtime dependencies</h2>
      <p>
        Each component declares its runtime deps in the registry manifest.{' '}
        <code>add</code> prints them after the copy completes — install
        once per project, reuse for every subsequent <code>add</code>:
      </p>
      <PropTable
        headers={['Common dep', 'Used by']}
        rows={[
          ['ink, react', 'Every interactive component (prompt.*, spinner, form, modal, search, pager, toast)'],
          ['chalk', 'Every component that emits color (most of them)'],
          ['figlet', 'splash, logo, textToArt'],
          ['jimp', 'imageToArt only'],
          ['qrcode', 'qrcode component only'],
        ]}
      />

      <h2 id="overwrite">Re-running add</h2>
      <p>
        Running <code>add</code> for a component you already have copies
        the latest version on top of your local files. Diff first if
        you've modified the component — Caret won't ask before overwriting.
      </p>
      <Callout kind="warning" title="Local edits get overwritten">
        Treat <code>caret add</code> like <code>shadcn add</code> — useful
        for the first installation, intentional and version-controlled
        afterwards. If you've forked a component, run <code>git diff</code>{' '}
        before you re-add.
      </Callout>

      <h2 id="custom-dir">Custom destination</h2>
      <CodeBlock language="sh">{`caret add error --dir src/ui
# writes:  src/ui/components/error.ts`}</CodeBlock>

      <h2 id="exit">Exit codes</h2>
      <PropTable
        headers={['Code', 'Meaning']}
        rows={[
          ['0', 'All files copied successfully'],
          ['1', 'Unknown component, missing file, or IO error'],
        ]}
      />

      <p>
        See <Link href="/docs/cli/list">caret list</Link> for the full
        component catalog.
      </p>
    </Prose>
  )
}
