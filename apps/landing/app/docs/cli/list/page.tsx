import type { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock, Prose } from '@/components/docs/Prose'

export const metadata: Metadata = {
  title: 'caret list — Caret docs',
  description:
    'Print every component in the bundled registry, grouped by kind, with a one-line description.',
}

export default function CaretListPage() {
  return (
    <Prose>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
        CLI · caret list
      </div>
      <h1>caret list</h1>
      <p>
        Lists every component in the bundled registry, grouped by kind,
        with a one-line description for each. Useful as a quick reference
        — the full catalog with live previews is at{' '}
        <Link href="/components">/components</Link>.
      </p>

      <h2 id="usage">Usage</h2>
      <CodeBlock language="sh">{`caret list
# or
npx caret-cli list`}</CodeBlock>

      <h2 id="output">Output</h2>
      <CodeBlock language="sh">{`Caret components (51)

interactive:
  prompt           text, password, confirm, select, multi-select, number
  spinner          loading with success/failure resolution
  splash           animated opening with logo, title, and subtitle
  typewriter       character-by-character text reveal
  reveal           line-by-line text reveal
  boot             systemd-style sequential loader
  form             multi-field input layout with tab navigation
  modal            bordered overlay with action buttons
  toast            auto-dismissing inline notification
  …

display:
  error            Rust-compiler-style error blocks
  list             vertical list with bullet/numbered/arrow/dash variants
  keyValue         aligned key-value pairs for config dumps
  banner           top-of-output heading
  progress         horizontal progress bar
  step             multi-phase status indicator
  table            typed columns and rows
  …

utility:
  link             OSC 8 clickable hyperlinks
  kbd              keyboard hint badge — [Ctrl+C]
  badge            colored inline badge — [production]
  code             inline code marker — \`caret init\`
  …`}</CodeBlock>

      <h2 id="kinds">Kinds</h2>
      <p>
        Each component is tagged with one of three kinds in the registry
        manifest. The grouping reflects how it's used at runtime, not how
        it's implemented:
      </p>
      <ul>
        <li>
          <strong>interactive</strong> — blocks for user input or animates
          while running. Lives inside an Ink render loop.
        </li>
        <li>
          <strong>display</strong> — synchronous, writes once and exits. Used
          via plain function calls in normal control flow.
        </li>
        <li>
          <strong>utility</strong> — single-line helpers (badge, kbd, link)
          or functions returning strings rather than writing themselves.
        </li>
      </ul>

      <h2 id="grep">Filter via shell</h2>
      <p>
        <code>list</code> doesn't take a query flag — pipe to{' '}
        <code>grep</code> instead.
      </p>
      <CodeBlock language="sh">{`caret list | grep prompt
caret list | grep -E "interactive|table|tree"`}</CodeBlock>

      <h2 id="next">Next</h2>
      <p>
        Pick a component and run <code>caret add &lt;name&gt;</code>. Or
        browse <Link href="/components">/components</Link> for live previews
        of every primitive in the catalog.
      </p>
    </Prose>
  )
}
