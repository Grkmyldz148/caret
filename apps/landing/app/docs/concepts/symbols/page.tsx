import type { Metadata } from 'next'
import Link from 'next/link'
import { Callout, Prose, PropTable } from '@/components/docs/Prose'

export const metadata: Metadata = {
  title: 'Symbols — Caret docs',
  description:
    'The Caret brand symbol set — the glyphs the manifesto says you must not customize.',
}

export default function SymbolsPage() {
  return (
    <Prose>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
        Concepts · Symbols
      </div>
      <h1>Symbols</h1>
      <p>
        Caret ships ten glyphs that carry brand identity across every
        component. The manifesto lists them as one of the seven hard rules:{' '}
        <em>"Never customize Caret symbols. They are the brand."</em> A user
        who has seen <code>^</code> and <code>▸</code> and <code>✓</code> in
        one Caret CLI should recognize them in every other Caret CLI.
      </p>

      <h2 id="brand">Brand mark</h2>
      <PropTable
        headers={['Glyph', 'Token', 'Where used']}
        rows={[
          ['^', 'symbols.anchor', 'Banner heads, prompt frames, splash logos. The mark.'],
        ]}
      />

      <h2 id="state">State indicators</h2>
      <PropTable
        headers={['Glyph', 'Token', 'Meaning']}
        rows={[
          ['✓', 'symbols.state.success', 'Operation completed successfully'],
          ['✗', 'symbols.state.failure', 'Operation failed'],
          ['⚠', 'symbols.state.warning', 'Soft problem — attention but not error'],
          ['ℹ', 'symbols.state.info', 'Informational message'],
          ['—', 'symbols.state.cancelled', 'User cancelled (Esc on a prompt)'],
        ]}
      />

      <h2 id="markers">Selection markers</h2>
      <PropTable
        headers={['Glyph', 'Token', 'Meaning']}
        rows={[
          ['●', 'symbols.marker.selected', 'Selected radio / multi-select item'],
          ['○', 'symbols.marker.unselected', 'Unselected radio / multi-select item'],
          ['▸', 'symbols.progress.arrow', 'Focus indicator, list arrow variant'],
        ]}
      />

      <h2 id="structure">Structure</h2>
      <PropTable
        headers={['Glyph', 'Token', 'Where used']}
        rows={[
          ['│', 'symbols.structure.gutter', 'Quote, error, alert left gutter'],
          ['─', 'symbols.ruler', 'Banner rule, divider, section separator'],
        ]}
      />

      <h2 id="why">Why "do not customize"</h2>
      <p>
        Two reasons. First, <strong>recognizability</strong>: a CLI users
        identify as "Caret-built" gives them confidence about the rest of
        the interaction — they know <code>✓</code> means done, <code>✗</code>{' '}
        means failed, no need to relearn.
      </p>
      <p>
        Second, <strong>spec portability</strong>: the spec for{' '}
        <code>error</code> says <em>"prefix with{' '}
        <code>symbols.state.failure</code>"</em>. A Go port reads the spec,
        renders the same glyph, and the result feels like the same product.
        If symbols were customizable, the spec would have to say "the{' '}
        <em>concept</em> of failure", and ports would diverge.
      </p>

      <Callout kind="warning" title="If you really need to change them">
        You can override <code>symbols</code> via{' '}
        <Link href="/docs/concepts/theme">setTheme</Link>. Caret won't stop
        you. But it stops being a Caret CLI at that point — that's the
        point of the rule.
      </Callout>

      <h2 id="fallback">ASCII fallback</h2>
      <p>
        On dumb terminals or when <code>NO_COLOR</code> is set, glyphs that
        rely on Unicode (<code>✓ ✗ ⚠ ℹ ● ○ ▸ ─ │</code>) fall back to ASCII
        equivalents (<code>+ x ! i [x] [ ] {'>'} - |</code>) automatically.
        The capability layer makes this decision; you don't opt in. See{' '}
        <Link href="/docs/concepts/capability">Capability detection</Link>.
      </p>
    </Prose>
  )
}
