import type { Metadata } from 'next'
import Link from 'next/link'
import { Callout, CodeBlock, Prose, PropTable } from '@/components/docs/Prose'

export const metadata: Metadata = {
  title: 'Porting Caret — Caret docs',
  description:
    'Port Caret to another language or framework. The spec is the contract; the TypeScript implementation is one possible binding.',
}

export default function PortingPage() {
  return (
    <Prose>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
        Authoring · Porting Caret
      </div>
      <h1>Porting Caret</h1>
      <p>
        Caret is a design language first, an implementation second. The
        TypeScript registry is one binding. Ports to Go, Rust, Python, or
        any other ecosystem are encouraged — what binds them is the spec.
      </p>

      <h2 id="contract">What ports must reproduce</h2>
      <PropTable
        headers={['Layer', 'Source of truth', 'Latitude']}
        rows={[
          ['Component anatomy', 'specs/<name>.md', 'Layout described per-row — port exactly'],
          ['Symbol set', 'specs/look.md + tokens/symbols', 'Use the same glyphs (^, ▸, ●, ○, ✓, ✗, ⚠)'],
          ['Color tokens', 'tokens/colors.ts', 'Brand truecolor fixed; semantic emit ANSI names'],
          ['Capability detection', 'lib/capability.ts', 'Detect TTY / NO_COLOR / Unicode / reduced motion identically'],
          ['API shape', 'specs/<name>.md', 'Match field names; idiomatic style allowed'],
          ['Internal structure', '— / your call', 'Implementation detail — pick whatever fits the language'],
        ]}
      />

      <h2 id="reading-spec">Reading a spec</h2>
      <p>
        Each spec markdown file follows the same shape: title, one-line
        description, and a series of <code>##</code> sections. The standard
        sections are:
      </p>
      <PropTable
        headers={['Section', 'What it gives the porter']}
        rows={[
          ['Anatomy', 'ASCII or block diagram of the component\'s rendered output, row by row'],
          ['API / Options', 'Field names, types, defaults — your binding\'s public surface'],
          ['Behavior', 'State machine — what happens on each input event'],
          ['Keyboard', 'Every key press the component listens for'],
          ['Capability', 'How the component degrades when capabilities are missing'],
          ['Examples', 'Idiomatic usage in TypeScript — translate to your language'],
        ]}
      />

      <h2 id="example">A worked example: prompt.confirm</h2>
      <p>
        From <code>specs/prompt.md</code>:
      </p>
      <CodeBlock language="md">{`### confirm

  ^ Deploy to production?
    [ Yes ]   No
    ←→ toggle · y/n shortcut · ↵ confirm · esc cancel

API:
  label    string                    required
  default  boolean                   default: false

Keys:
  ←/→         toggle the highlighted choice
  y, Y        select Yes
  n, N        select No
  ↵ Enter     submit the highlighted choice
  Esc         cancel — resolve null`}</CodeBlock>
      <p>
        That's enough to write a Go port. The Yes/No glyph is{' '}
        <code>[ ... ]</code> on the highlighted side. Keys are listed
        explicitly. Cancel resolves a null/None — your language's nullable
        equivalent. The brand <code>^</code> mark and the focus glyph are
        token references — pull them from your tokens file.
      </p>

      <h2 id="reference-tools">Reference helmets</h2>
      <p>
        Two libraries Caret leans on at the visual layer have ports already:
      </p>
      <ul>
        <li>
          <strong>Helmlab</strong> — color science, palette generation. JS,
          Python ports exist;{' '}
          <a href="https://github.com/Grkmyldz148/helmlab">github.com/Grkmyldz148/helmlab</a>.
        </li>
        <li>
          <strong>figlet</strong> — ASCII art for splash banners. Has
          implementations in nearly every major language.
        </li>
      </ul>

      <h2 id="ai">Spec + AI workflow</h2>
      <p>
        For ports specifically, AI assistants are useful. Drop the relevant
        spec markdown into the LLM context, give it your{' '}
        <code>caret.md</code>-equivalent for the target language, and ask
        for the implementation. Caret was designed with this loop in mind —
        every spec is unambiguously parseable.
      </p>

      <Callout kind="info" title="One symbol, every binding">
        The reason the manifesto says <em>never customize symbols</em> is
        portability. If a Go port renders a different glyph than the JS
        port, the result feels like two products. Hold the line — same
        glyphs, every language.
      </Callout>

      <p>
        For the symbol reference,{' '}
        <Link href="/docs/concepts/symbols">Symbols</Link>. For the
        capability protocol every port has to reproduce,{' '}
        <Link href="/docs/concepts/capability">Capability detection</Link>.
      </p>
    </Prose>
  )
}
