import type { Metadata } from 'next'
import Link from 'next/link'
import { Callout, CodeBlock, Prose, PropTable } from '@/components/docs/Prose'

export const metadata: Metadata = {
  title: 'Theme — Caret docs',
  description:
    'The Caret theme system: setTheme, ThemeProvider, useTheme, and per-component overrides.',
}

export default function ThemePage() {
  return (
    <Prose>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
        Concepts · Theme
      </div>
      <h1>Theme</h1>
      <p>
        Themes are how you re-skin Caret without rewriting the components.
        A theme is a deeply-nested object whose leaves are token values —
        colors, motion durations, symbols, spacing, typography. Three
        application surfaces: globally, per React subtree, or per call.
      </p>

      <h2 id="default">The default theme</h2>
      <p>
        <code>defaultTheme</code> is exported from <code>@caret/registry</code>{' '}
        and ships with sensible values for every token. You almost never read
        it directly — you call <code>useTheme()</code> inside an Ink component
        or rely on Caret's components doing the lookup for you.
      </p>
      <CodeBlock language="ts">{`import { defaultTheme } from '@caret/registry'

console.log(defaultTheme.colors.accent.default)  // '#5882f7'
console.log(defaultTheme.motion.duration.default) // 200`}</CodeBlock>

      <h2 id="set">Globally re-skin with setTheme</h2>
      <p>
        Call once at startup before any Caret component renders. Subsequent
        calls take effect for the next render but don't roll back what's
        already painted.
      </p>
      <CodeBlock filename="src/index.ts">{`import { caret } from './caret'

caret.theme.set({
  colors: {
    accent: { default: '#FF6B35' },
  },
  symbols: {
    anchor: '◆',
  },
})`}</CodeBlock>
      <p>
        Overrides are merged shallowly per top-level key. You only specify
        leaves you want to change — Caret fills the rest from the default.
      </p>

      <h2 id="provider">Subtree overrides with ThemeProvider</h2>
      <p>
        For React-tree scoped overrides — useful when one section of a CLI
        needs a different palette without affecting the rest.
      </p>
      <CodeBlock language="tsx">{`import { ThemeProvider } from '@caret/registry'

function DangerZone() {
  return (
    <ThemeProvider theme={{ colors: { accent: { default: '#e5482d' } } }}>
      <DestructiveActions />
    </ThemeProvider>
  )
}`}</CodeBlock>

      <h2 id="use">Reading the active theme with useTheme</h2>
      <p>
        Inside an Ink component, <code>useTheme()</code> returns the merged
        theme that's active at this point in the tree.
      </p>
      <CodeBlock language="tsx">{`import { useTheme, Box, Text } from 'ink'

function Heading({ text }: { text: string }) {
  const theme = useTheme()
  return (
    <Box>
      <Text color={theme.colors.accent.default}>{theme.symbols.anchor} </Text>
      <Text bold>{text}</Text>
    </Box>
  )
}`}</CodeBlock>

      <h2 id="per-call">Per-call overrides</h2>
      <p>
        Every Caret component accepts an optional <code>theme</code> option.
        It's merged with the active theme just for that single call — no
        global side-effects.
      </p>
      <CodeBlock language="ts">{`spinner('Deploying', deploy, {
  theme: {
    colors: { accent: { default: '#10B981' } },
  },
})`}</CodeBlock>

      <h2 id="precedence">Precedence</h2>
      <p>
        From lowest to highest priority — later wins:
      </p>
      <PropTable
        headers={['Source', 'Priority']}
        rows={[
          ['defaultTheme', 'Lowest — applied if nothing else overrides'],
          ['caret.theme.set(...)', 'Global override, replaces defaultTheme leaves'],
          ['<ThemeProvider theme={...}>', 'React subtree override'],
          ['component({ theme: ... })', 'Highest — wins for that single call'],
        ]}
      />

      <Callout kind="info" title="Brand accent only">
        Caret's manifesto says the brand accent is a fixed truecolor. You
        can override it, but the recommendation is: pick one once and stick
        to it across your CLI's lifetime. That accent is what makes a
        Caret CLI recognizable across any terminal.
      </Callout>

      <p>
        Token reference is at <Link href="/docs/concepts/tokens">Tokens</Link>;
        capability detection that gates which tokens are actually rendered is
        at <Link href="/docs/concepts/capability">Capability detection</Link>.
      </p>
    </Prose>
  )
}
