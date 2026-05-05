import type { Metadata } from 'next'
import Link from 'next/link'
import { Prose } from '@/components/docs/Prose'

export const metadata: Metadata = {
  title: 'FAQ — Caret docs',
  description:
    'Frequent questions about Caret — runtime model, scope, AI workflow, theming, ports.',
}

export default function FaqPage() {
  return (
    <Prose>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
        Reference · FAQ
      </div>
      <h1>FAQ</h1>

      <h2 id="copy-paste">Why copy-paste instead of npm install?</h2>
      <p>
        Components live in your repo, not in <code>node_modules</code>. You
        can read them in a single sitting, fork them, delete them, or change
        the colors directly. There's no <code>@caret/ui</code> version to
        lock, no breaking change to track. Caret is a starting point, not a
        runtime dependency. shadcn/ui pioneered this model on the web; Caret
        applies it to the terminal.
      </p>

      <h2 id="ink">Why Ink, not raw ANSI escape codes?</h2>
      <p>
        Ink is React for terminals. It handles input keys, layout, and
        re-renders for free. Writing the same components against raw stdout
        with manual cursor positioning works for a single-purpose CLI but
        falls apart at any non-trivial interaction. Caret is to Ink what
        shadcn/ui is to Radix — a proven primitive layer to build on, not
        replace.
      </p>

      <h2 id="tui">Can I build a fullscreen TUI with Caret?</h2>
      <p>
        Caret optimizes for transactional CLIs that print and exit (
        <code>git status</code>, <code>vercel deploy</code>). For fullscreen
        apps like <code>k9s</code>, <code>lazygit</code>, <code>btop</code> —
        reach for Ink, Textual, or Ratatui directly. Caret's symbols and
        principles still translate, but the components are inline-output by
        design.
      </p>

      <h2 id="ai">How does Caret help AI-generated CLIs?</h2>
      <p>
        Two things: every component has a spec at{' '}
        <code>specs/&lt;name&gt;.md</code>, and the project ships a{' '}
        <code>caret.md</code> root file that AI assistants read on every
        interaction. The result: ask an LLM to "add a deploy command with a
        spinner" and it produces idiomatic Caret — not five glued-together{' '}
        <code>chalk.red()</code> calls. See{' '}
        <Link href="/docs/authoring/ai-native">AI-native workflow</Link>.
      </p>

      <h2 id="no-color">Does Caret respect NO_COLOR?</h2>
      <p>
        Yes — without you opting in. The capability layer detects{' '}
        <code>NO_COLOR</code>, <code>FORCE_COLOR</code>, <code>TERM=dumb</code>,
        whether stdout is a TTY, narrow terminal widths, and reduced-motion
        preferences. Components consult it before painting and fall back
        through truecolor → 256 → ANSI 16 → plain automatically. See{' '}
        <Link href="/docs/concepts/capability">Capability detection</Link>.
      </p>

      <h2 id="theme">Can I change the brand color?</h2>
      <p>
        Yes — <code>caret.theme.set(&#123; colors: &#123; accent: &#123; default:
        '#FF6B35' &#125; &#125; &#125;)</code> at startup re-skins everything. The
        manifesto says the accent should be fixed across your CLI's lifetime
        — but it's still your CLI, your accent. See{' '}
        <Link href="/docs/authoring/custom-theme">Custom theme</Link>.
      </p>

      <h2 id="symbols-customize">Can I change the symbols?</h2>
      <p>
        You can, but you shouldn't. The symbol set (<code>^ ▸ ● ○ ✓ ✗ ⚠ —
        │</code>) is the brand. A user who recognizes <code>^</code> from
        one Caret CLI should recognize it in every other Caret CLI. The
        manifesto lists this as one of seven hard rules. See{' '}
        <Link href="/docs/concepts/symbols">Symbols</Link>.
      </p>

      <h2 id="ports">Are there ports to other languages?</h2>
      <p>
        Caret is in active design and the TypeScript binding is the first
        implementation. Ports are explicitly encouraged — every component
        has a language-agnostic spec at <code>specs/&lt;name&gt;.md</code>{' '}
        precisely so someone can implement it in Go, Rust, Python, or
        another ecosystem. See{' '}
        <Link href="/docs/authoring/porting">Porting Caret</Link>.
      </p>

      <h2 id="updates">How do I get updates?</h2>
      <p>
        Re-run <code>caret add &lt;name&gt;</code> for a component you
        already have. The new version overwrites your local copy — diff
        first if you've forked it. There's no automatic update prompt;
        Caret won't change your code without you running a command.
      </p>

      <h2 id="bell">Does Caret play sounds?</h2>
      <p>
        Never the terminal bell. For long-running tasks, opt into system
        notifications via <code>caret.notify</code> — they respect OS focus
        and Do Not Disturb, threshold-gate at 10 seconds by default, and
        fall back silently when unavailable. This is the manifesto's{' '}
        <em>"Notifications, not beeps"</em> rule.
      </p>

      <h2 id="background">Why no background colors?</h2>
      <p>
        Your terminal has a background already. The user might be on
        Solarized Light, Dracula, a custom Helmlab theme, or
        whatever-Vercel-team-uses. Caret doesn't fight the user's
        environment — it emits foreground colors and attributes only.
        That's why a Caret CLI looks correct on every terminal without
        configuration.
      </p>

      <p>
        Other questions? Open an issue or check{' '}
        <Link href="/docs/reference/troubleshooting">Troubleshooting</Link>.
      </p>
    </Prose>
  )
}
