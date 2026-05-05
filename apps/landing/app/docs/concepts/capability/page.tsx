import type { Metadata } from 'next'
import Link from 'next/link'
import { Callout, CodeBlock, Prose, PropTable } from '@/components/docs/Prose'

export const metadata: Metadata = {
  title: 'Capability detection — Caret docs',
  description:
    'How Caret reads the active terminal: TTY, NO_COLOR, narrow widths, reduced motion, dumb terminals — and how each component picks the right rendering path.',
}

export default function CapabilityPage() {
  return (
    <Prose>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
        Concepts · Capability detection
      </div>
      <h1>Capability detection</h1>
      <p>
        Every Caret component asks one question before painting:{' '}
        <em>what does this terminal actually support?</em> The answer comes
        from <code>lib/capability.ts</code>, a single synchronous read that
        every primitive consults. You don't enable any of this — you'd have
        to go out of your way to break it.
      </p>

      <h2 id="signals">What it detects</h2>
      <PropTable
        headers={['Signal', 'Source', 'Effect']}
        rows={[
          ['isTTY', 'process.stdout.isTTY', 'Pipe-aware fallback — when piped, components emit plain text without escape codes'],
          ['hasColor', 'NO_COLOR env var, FORCE_COLOR, CI heuristics', 'Strips chalk colors entirely when set'],
          ['truecolor', 'COLORTERM=truecolor / TERM=*-256color', 'Picks 24-bit RGB vs 256-color vs ANSI 16'],
          ['unicode', 'LANG / LC_ALL contains UTF-8', 'Falls glyphs back to ASCII (✓ → +, │ → |) when missing'],
          ['columns', 'process.stdout.columns', 'Wraps tables, banners, paragraphs to fit narrow terminals'],
          ['reducedMotion', 'CARET_REDUCED_MOTION, prefers-reduced-motion shim', 'Disables spinner / typewriter / reveal animations'],
          ['dumb', 'TERM=dumb', 'Plain output, no escape codes, no animation'],
        ]}
      />

      <h2 id="api">Reading capability in your own code</h2>
      <p>
        If you're authoring a custom component or extending a Caret one, call{' '}
        <code>capability()</code> directly. It's cheap — synchronous, no
        cache invalidation needed.
      </p>
      <CodeBlock language="ts">{`import { capability } from './caret/lib/capability'

const cap = capability()

if (!cap.isTTY) {
  // Output is being piped — emit plain JSON, not pretty terminal UI.
  console.log(JSON.stringify(result))
  return
}

if (cap.dumb || !cap.unicode) {
  // Use ASCII fallbacks throughout this command.
}`}</CodeBlock>

      <h2 id="fallback-chain">The color fallback chain</h2>
      <p>
        Components walk the same chain in this exact order — first match
        wins:
      </p>
      <ol className="list-decimal pl-6 my-4 text-[15px] text-muted leading-relaxed">
        <li>
          <strong><code>NO_COLOR</code> set?</strong> Plain text, no escape
          codes at all.
        </li>
        <li>
          <strong>Not a TTY?</strong> Plain text — pipe-friendly.
        </li>
        <li>
          <strong>Truecolor terminal?</strong> Brand accent emitted as 24-bit
          RGB; semantic colors as ANSI named.
        </li>
        <li>
          <strong>256-color terminal?</strong> Brand accent quantized to the
          closest 256-color slot.
        </li>
        <li>
          <strong>ANSI 16 terminal?</strong> Brand accent maps to the closest
          named ANSI color.
        </li>
        <li>
          <strong>Dumb terminal?</strong> Plain text, hierarchy expressed via
          symbols only.
        </li>
      </ol>

      <h2 id="env">Environment variables</h2>
      <PropTable
        headers={['Variable', 'Effect']}
        rows={[
          ['NO_COLOR=1', 'Disable color in all Caret output (also strips third-party chalk via Caret\'s paint helper)'],
          ['FORCE_COLOR=3', 'Force truecolor even when stdout is not a TTY (CI snapshots)'],
          ['CARET_REDUCED_MOTION=1', 'Disable all motion regardless of OS preference'],
          ['CARET_NO_NOTIFY=1', 'Disable system notifications from spinner / prompts.notifyOnWait'],
          ['TERM=dumb', 'Plain output, ASCII glyphs, no animation'],
        ]}
      />

      <Callout kind="info" title="Always TTY-aware">
        Caret components NEVER write escape codes when{' '}
        <code>process.stdout.isTTY</code> is false. Pipe a Caret CLI through{' '}
        <code>grep</code>, <code>jq</code>, or save it to a file —
        scrollback stays clean. The manifesto rule:{' '}
        <em>"stdout is for data, stderr is for messages."</em>
      </Callout>

      <h2 id="testing">Testing under different capabilities</h2>
      <p>
        For local development, the easiest way to test capability paths:
      </p>
      <CodeBlock language="sh">{`# No color
NO_COLOR=1 my-cli deploy

# Force truecolor in CI
FORCE_COLOR=3 my-cli deploy

# Pipe — non-interactive
my-cli deploy | cat

# Dumb terminal
TERM=dumb my-cli deploy`}</CodeBlock>
      <p>
        Each variant should produce sensible output. If you find a component
        that emits escape codes through a pipe, it's a bug — file an issue.
      </p>

      <p>
        Continue with <Link href="/docs/concepts/motion">Motion</Link> — the
        animation tokens that capability detection gates.
      </p>
    </Prose>
  )
}
