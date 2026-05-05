import type { Metadata } from 'next'
import Link from 'next/link'
import { Callout, CodeBlock, Prose, PropTable } from '@/components/docs/Prose'

export const metadata: Metadata = {
  title: 'Tokens — Caret docs',
  description:
    'The Caret token system: colors, motion, symbols, spacing, and typography. The visual contract every component reads.',
}

export default function TokensPage() {
  return (
    <Prose>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
        Concepts · Tokens
      </div>
      <h1>Tokens</h1>
      <p>
        Tokens are the contract between Caret and the visual layer. Components never
        write hex codes or magic numbers — they read tokens through the active theme.
        Re-skin the entire system by overriding a single object.
      </p>

      <h2 id="categories">Categories</h2>
      <PropTable
        headers={['Token', 'Lives at', 'Override entry']}
        rows={[
          ['colors', 'registry/tokens/colors.ts', 'theme.colors'],
          ['motion', 'registry/tokens/motion.ts', 'theme.motion'],
          ['symbols', 'registry/tokens/symbols.ts', 'theme.symbols'],
          ['spacing', 'registry/tokens/spacing.ts', 'theme.spacing'],
          ['typography', 'registry/tokens/typography.ts', 'theme.typography'],
        ]}
      />

      <h2 id="colors">Colors</h2>
      <p>
        Caret separates <strong>brand</strong> color (truecolor, fixed — your CLI's
        recognizable accent) from <strong>semantic</strong> colors (ANSI-named, so
        they harmonize with the user's terminal theme).
      </p>
      <PropTable
        headers={['Key', 'Default', 'Purpose']}
        rows={[
          ['accent.default', '#5882f7', 'Brand accent — used for prompts, anchors, primary CTAs'],
          ['accent.muted', '#3a5fb8', 'Lower-emphasis accent for hover or disabled states'],
          ['semantic.success.ansi', 'green', 'Success messages, completed steps'],
          ['semantic.warning.ansi', 'yellow', 'Deprecation, soft warnings'],
          ['semantic.danger.ansi', 'red', 'Errors, failures, destructive actions'],
          ['semantic.info.ansi', 'blue', 'Informational messages'],
          ['fg', "terminal default", 'Foreground — Caret never overrides'],
          ['dim', 'ANSI dim', 'Muted text — descriptions, labels'],
        ]}
      />
      <Callout kind="info" title="Truecolor only for brand">
        Caret emits ANSI names (<code>green</code>, <code>red</code>) for semantic
        colors so they pick up the user's theme. Only <code>accent</code> is a fixed
        truecolor value — that's the part that makes a Caret CLI recognizable across
        any terminal.
      </Callout>

      <h2 id="motion">Motion</h2>
      <p>
        Every animation is bounded and gated by reduced-motion detection. Tokens come
        in two flavors: <strong>durations</strong> (how long a transition runs) and{' '}
        <strong>frame rates</strong> (how often a stepped animation ticks).
      </p>
      <PropTable
        headers={['Key', 'Default (ms)', 'Used by']}
        rows={[
          ['duration.instant', '60', 'Tight feedback (cursor blink window)'],
          ['duration.fast', '120', 'Color/border transitions'],
          ['duration.default', '200', 'Spinner morph, prompt resolve'],
          ['duration.slow', '300', 'Reveals, modal enters'],
          ['spinnerFrameMs', '80', 'Braille spinner step interval'],
          ['blinkMs', '1050', 'Block cursor blink cycle'],
        ]}
      />

      <h2 id="symbols">Symbols</h2>
      <p>
        Symbols are part of the brand. The manifesto says: never customize them. They
        are listed here for reference, not because they're meant to be replaced.
      </p>
      <PropTable
        headers={['Key', 'Glyph', 'Where used']}
        rows={[
          ['anchor', '^', 'Brand mark — banner heads, prompt frames'],
          ['state.success', '✓', 'Successful steps, success() messages'],
          ['state.failure', '✗', 'Failed steps, error() messages'],
          ['state.warning', '⚠', 'warning() messages, alert(kind: warning)'],
          ['state.info', 'ℹ', 'info() messages, alert(kind: info)'],
          ['state.cancelled', '—', 'User-cancelled prompts'],
          ['marker.selected', '●', 'Selected radio / multi-select item'],
          ['marker.unselected', '○', 'Unselected radio / multi-select item'],
          ['progress.arrow', '▸', 'List arrow variant, focus indicator'],
          ['structure.gutter', '│', 'Quote, error, alert left gutter'],
        ]}
      />

      <h2 id="overriding">Overriding tokens</h2>
      <p>
        Two ways to apply a custom theme:
      </p>
      <CodeBlock filename="src/index.ts">{`import { caret } from './caret'

// 1. Globally — affects every Caret call from this point on
caret.theme.set({
  colors: {
    accent: { default: '#FF6B35' },
  },
  symbols: {
    anchor: '◆',
  },
})

// 2. Per call — one-off override, no global state
spinner('Deploying', deploy, {
  theme: { colors: { accent: { default: '#10B981' } } },
})`}</CodeBlock>
      <p>
        Theme overrides are merged shallowly per top-level key. You only specify the
        leaves you want to change — Caret fills the rest from the default theme.
      </p>

      <hr />
      <p>
        Continue with the{' '}
        <Link href="/docs/concepts/principles">Principles</Link> the tokens reflect,
        or jump to the{' '}
        <Link href="/components">component catalog</Link> to see the tokens applied
        in real previews.
      </p>
    </Prose>
  )
}
