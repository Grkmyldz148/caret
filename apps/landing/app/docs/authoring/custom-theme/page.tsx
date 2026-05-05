import type { Metadata } from 'next'
import Link from 'next/link'
import { Callout, CodeBlock, Prose, PropTable } from '@/components/docs/Prose'

export const metadata: Metadata = {
  title: 'Custom theme — Caret docs',
  description:
    'Build a Caret theme from a brand color: derive a palette, ensure WCAG contrast, ship it as a single object.',
}

export default function CustomThemePage() {
  return (
    <Prose>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
        Authoring · Custom theme
      </div>
      <h1>Custom theme</h1>
      <p>
        A Caret theme is a deeply-nested object with token leaves. Most
        consumers only override <code>colors.accent</code> and{' '}
        <code>symbols.anchor</code>, but the full surface is open. This page
        walks through derivation: brand color → palette → theme → applied.
      </p>

      <h2 id="minimal">A minimal override</h2>
      <p>
        For most CLIs, a single accent color is the entire theme. Set it
        once at startup; <code>caret.theme.set</code> merges with the default.
      </p>
      <CodeBlock filename="src/index.ts">{`import { caret } from './caret'

caret.theme.set({
  colors: {
    accent: { default: '#FF6B35' },
  },
})`}</CodeBlock>
      <p>
        Now every <code>^</code>, every prompt prefix, every spinner braille
        glyph paints with your brand orange.
      </p>

      <h2 id="palette">Derive a palette from a single color</h2>
      <p>
        Caret's color tokens are powered by{' '}
        <a href="https://helmlab.space">Helmlab</a>. The same library
        generates a Tailwind-style 50–950 scale from any brand color, with
        gamut mapping and WCAG-aware lightness steps:
      </p>
      <CodeBlock language="ts">{`import { Helmlab } from 'helmlab'

const hl = new Helmlab()
const scale = hl.semanticScale('#FF6B35')
// → { '50': '#fff7f3', ..., '500': '#FF6B35', ..., '950': '#3a1505' }

caret.theme.set({
  colors: {
    accent: {
      default:    scale['500'],
      muted:      scale['600'],
      emphasized: scale['400'],
    },
  },
})`}</CodeBlock>

      <h2 id="contrast">Enforce WCAG contrast</h2>
      <p>
        For inline UI like badges, buttons, or selected items, you need
        contrast against the surface. Helmlab's{' '}
        <code>ensureContrast</code> nudges a color until it hits a target
        ratio:
      </p>
      <CodeBlock language="ts">{`import { Helmlab } from 'helmlab'

const hl = new Helmlab()
const safeAccent = hl.ensureContrast('#FF6B35', '#0a0a0a', 4.5)
// minimum 4.5:1 against the canvas — meets WCAG AA for normal text`}</CodeBlock>

      <h2 id="shape">Full theme shape</h2>
      <PropTable
        headers={['Top-level key', 'What it covers']}
        rows={[
          ['colors', 'accent, semantic states, fg, dim — see /docs/concepts/tokens'],
          ['motion', 'durations, frame rates — see /docs/concepts/motion'],
          ['symbols', 'brand glyph, state, marker, structure — usually leave alone'],
          ['spacing', 'gap, indent — usually leave alone'],
          ['typography', 'tracking widths used by tracking() helper'],
        ]}
      />

      <Callout kind="warning" title="Symbols are the brand">
        The manifesto rule: never customize the symbol set. You CAN override{' '}
        <code>symbols</code> via setTheme, but the result stops being a
        Caret CLI — recognizability collapses, spec portability breaks. Pick
        a different brand color, not a different glyph.
      </Callout>

      <h2 id="distribute">Distributing a theme</h2>
      <p>
        For teams running multiple CLIs that should share a brand, ship the
        theme as a plain object from your shared package:
      </p>
      <CodeBlock filename="@acme/cli-theme/index.ts">{`import type { PartialTheme } from '@caret/registry'

export const acmeTheme: PartialTheme = {
  colors: {
    accent: { default: '#FF6B35' },
  },
  motion: {
    duration: { default: 180 },
  },
}`}</CodeBlock>
      <CodeBlock filename="apps/billing-cli/src/index.ts">{`import { acmeTheme } from '@acme/cli-theme'
import { caret } from './caret'

caret.theme.set(acmeTheme)`}</CodeBlock>

      <h2 id="next">Next</h2>
      <p>
        Read <Link href="/docs/concepts/theme">Theme</Link> for runtime
        precedence, or <Link href="/docs/concepts/tokens">Tokens</Link> for
        the full token reference.
      </p>
    </Prose>
  )
}
