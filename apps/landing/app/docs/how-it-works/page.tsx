import type { Metadata } from 'next'
import Link from 'next/link'
import { Prose, PropTable } from '@/components/docs/Prose'

export const metadata: Metadata = {
  title: 'How it works — Caret docs',
  description:
    'The four layers of Caret — components, tokens, capability, spec — and how they coordinate at build time and runtime.',
}

export default function HowItWorksPage() {
  return (
    <Prose>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
        Overview · How it works
      </div>
      <h1>How it works</h1>
      <p>
        Caret has four layers. Top-down, each layer reads only from the one
        below it. There is no central state, no config, no provider tree — a
        change in any leaf is a one-file edit.
      </p>

      <h2 id="layers">The four layers</h2>
      <PropTable
        headers={['Layer', 'What it does', 'Lives in']}
        rows={[
          ['Components', 'React-for-the-terminal primitives — prompts, spinners, tables, errors. One file each.', 'registry/components/'],
          ['Tokens', 'Colors, motion, symbols, spacing, typography. The visual contract.', 'registry/tokens/'],
          ['Capability', 'Detects TTY, NO_COLOR, narrow terminals, reduced motion. Components consult it before painting.', 'registry/lib/capability.ts'],
          ['Spec', 'Per-component markdown describing anatomy, API, keyboard shortcuts. Source of truth for AI assistants and ports.', 'specs/'],
        ]}
      />

      <h2 id="components">Components</h2>
      <p>
        Each component is a single file rendered with{' '}
        <a href="https://github.com/vadimdemedes/ink">Ink</a> (React for
        terminal). Output is inline — scrollback-friendly, pipe-friendly,
        log-friendly. Components emit foreground colors and attributes, not
        backgrounds. They never assume a TTY; the capability layer tells them
        when they have one.
      </p>
      <p>
        A component's API is a single options object. No positional args, no
        method chains, no fluent builders. <code>prompt.text(&#123;
        label, validate &#125;)</code> is the same shape as <code>error(title,
        &#123; body, hint, see &#125;)</code> — and AI assistants treat them
        the same way.
      </p>

      <h2 id="tokens">Tokens</h2>
      <p>
        Tokens are the contract between Caret and the visual layer. Components
        never write hex codes or magic numbers — they read tokens through the
        active theme. Re-skin the entire system with a single{' '}
        <code>setTheme()</code> call, or pass a <code>theme</code> override
        per-component for a one-off.
      </p>
      <p>
        Brand color is one fixed truecolor; semantic colors are emitted as
        ANSI names (<code>green</code>, <code>red</code>) so they harmonize
        with the user's terminal theme. See{' '}
        <Link href="/docs/concepts/tokens">Tokens</Link> for the full table.
      </p>

      <h2 id="capability">Capability</h2>
      <p>
        <code>lib/capability.ts</code> is one synchronous read — TTY,{' '}
        <code>NO_COLOR</code>, terminal width, dumb terminal, reduced motion.
        Components call it once at render time and choose the right path:
        truecolor → 256 → ANSI 16 → plain. You don't enable the fallback
        chain; you'd have to go out of your way to break it.
      </p>

      <h2 id="spec">Spec</h2>
      <p>
        Every component has a <code>specs/&lt;name&gt;.md</code> file —
        anatomy diagrams, API tables, keyboard shortcuts, accessibility
        notes. Specs are language-agnostic. Someone porting Caret to Go,
        Rust, or Python implements from the spec, not from TypeScript source.
      </p>
      <p>
        Specs also bind AI assistants. The <code>caret.md</code> file at
        your project root tells Claude / Cursor / Copilot to consult the
        spec before guessing at behaviour.
      </p>

      <h2 id="lifecycle">Lifecycle</h2>
      <ol className="list-decimal pl-6 my-4 text-[15px] text-muted leading-relaxed">
        <li>
          <code>npx caret-cli init</code> scaffolds a project (one-time).
        </li>
        <li>
          <code>caret add &lt;component&gt;</code> copies that component's
          files into <code>caret/</code> in your repo (per component, per
          decision).
        </li>
        <li>
          You import from <code>./caret</code>, run your CLI, and the
          components render via Ink.
        </li>
        <li>
          Updates? Re-run <code>caret add</code> with the same name to pull
          the latest version. Diff the changes, accept what you want.
        </li>
      </ol>

      <h2 id="not">What Caret is not</h2>
      <ul>
        <li>
          <strong>Not a TUI framework.</strong> Caret is for CLIs that print
          and exit, not fullscreen apps like <code>k9s</code> or{' '}
          <code>lazygit</code>. For those, reach for Ink, Textual, or Ratatui
          directly.
        </li>
        <li>
          <strong>Not a runtime dependency.</strong> Components live in your
          repo, not in <code>node_modules/@caret/...</code>.
        </li>
        <li>
          <strong>Not a terminal emulator.</strong> Caret runs inside iTerm,
          Alacritty, Wezterm, Ghostty — whatever you use.
        </li>
      </ul>
    </Prose>
  )
}
