import type { Metadata } from 'next'
import Link from 'next/link'
import { Callout, CodeBlock, Prose } from '@/components/docs/Prose'

export const metadata: Metadata = {
  title: 'Troubleshooting — Caret docs',
  description:
    'Common issues and how to fix them — installer errors, alignment problems, missing colors, broken animations.',
}

export default function TroubleshootingPage() {
  return (
    <Prose>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
        Reference · Troubleshooting
      </div>
      <h1>Troubleshooting</h1>
      <p>
        Most Caret problems trace to one of four causes: capability
        misdetection, missing runtime deps, font fallback for box-drawing
        glyphs, or stale registry. Quick triage by symptom below.
      </p>

      <h2 id="install">caret init / add fails</h2>

      <h3 id="dir-exists">"Target directory exists"</h3>
      <p>
        <code>init</code> refuses to scaffold over an existing directory.
        Pick a fresh name or remove the existing one.
      </p>
      <CodeBlock language="sh">{`rm -rf my-cli
npx caret-cli init my-cli`}</CodeBlock>

      <h3 id="unknown-component">"Unknown component"</h3>
      <p>
        <code>caret add</code> printed an unknown name. Run{' '}
        <code>caret list</code> to see exact slugs (case matters —{' '}
        <code>codeBlock</code> not <code>code-block</code>).
      </p>

      <h3 id="registry-not-found">"Could not locate Caret registry"</h3>
      <p>
        The CLI's registry resolver failed. Likely cause: you ran the CLI
        from a corrupted{' '}
        <code>node_modules/caret-cli/registry/</code>. Reinstall:
      </p>
      <CodeBlock language="sh">{`npm uninstall -g caret-cli
npm install -g caret-cli@latest`}</CodeBlock>

      <h2 id="rendering">Output looks wrong</h2>

      <h3 id="boxes">Box-drawing characters misaligned</h3>
      <p>
        Symptoms: <code>│ ├ └ ─</code> drift by a pixel between rows.
        Cause: terminal mixing two monospace fonts (one for letters, one
        for box-drawing). Caret can't fix this from the CLI side — the
        user's terminal needs a font that ships the full Unicode
        block-element + box-drawing range. Fonts that work: JetBrains
        Mono, Berkeley Mono, Iosevka, Cascadia Code.
      </p>

      <h3 id="no-color">No colors at all</h3>
      <p>
        Caret detected <code>NO_COLOR</code>, a non-TTY stdout, or{' '}
        <code>TERM=dumb</code>. Verify with:
      </p>
      <CodeBlock language="sh">{`env | grep -E "NO_COLOR|FORCE_COLOR|TERM"
node -e "console.log(process.stdout.isTTY)"`}</CodeBlock>
      <p>
        If you want to force color in CI, set{' '}
        <code>FORCE_COLOR=3</code>. If you don't want color, that's working
        as designed — Caret respects every standard color-disabling
        signal.
      </p>

      <h3 id="braille">Spinner shows squares instead of braille</h3>
      <p>
        Cause: terminal font missing the braille range (U+2800–U+28FF).
        Fix: set <code>CARET_REDUCED_MOTION=1</code> to fall back to a
        static glyph, or switch to a font that ships braille.
      </p>

      <h3 id="narrow">Tables wrap or truncate ugly</h3>
      <p>
        Caret detects terminal width via <code>process.stdout.columns</code>{' '}
        and adapts. Resize the terminal, or pass an explicit{' '}
        <code>width</code> option to{' '}
        <code>banner / table / paragraph</code>.
      </p>

      <h2 id="interactive">Interactive components don't respond</h2>

      <h3 id="raw-mode">"setRawMode is not a function"</h3>
      <p>
        Cause: <code>process.stdin</code> is not a TTY (piped input,
        running in a non-interactive shell). Interactive prompts only work
        in a TTY. For non-interactive flows, accept input via flags or
        environment variables instead.
      </p>

      <h3 id="ctrl-c">Ctrl+C doesn't exit cleanly</h3>
      <p>
        Caret resolves prompts to <code>null</code> on Esc, throws{' '}
        <code>CaretCancelled</code> on Ctrl+C from <code>caret.prompt</code>{' '}
        wrappers. Catch it explicitly:
      </p>
      <CodeBlock language="ts">{`import { CaretCancelled } from './caret'

try {
  const name = await prompt.text({ label: 'Project name' })
} catch (e) {
  if (e instanceof CaretCancelled) {
    process.exit(130) // standard SIGINT exit code
  }
  throw e
}`}</CodeBlock>

      <h2 id="theme-issues">Theme issues</h2>

      <h3 id="brand-not-applied">Brand accent not appearing</h3>
      <p>
        <code>caret.theme.set</code> must be called BEFORE the component
        renders. Calling it after the spinner has started won't repaint
        already-emitted output. Move it to the top of your{' '}
        <code>main()</code>.
      </p>

      <h3 id="setTheme-typecheck">PartialTheme typing complains</h3>
      <p>
        Ensure you import <code>PartialTheme</code> from your local copy at{' '}
        <code>caret/theme/types.ts</code> (it lands there after{' '}
        <code>npx caret add theme</code>) and not the full <code>Theme</code>.
        PartialTheme makes every leaf optional.
      </p>

      <h2 id="ai-issues">AI assistants generate non-Caret code</h2>
      <p>
        Cause: <code>caret.md</code> isn't at the repo root, or the
        assistant isn't loading repo-level instructions. Fix:
      </p>
      <ol className="list-decimal pl-6 my-4 text-[15px] text-muted leading-relaxed">
        <li>
          Confirm <code>caret.md</code> exists at the project root (run{' '}
          <code>caret init</code> writes one automatically).
        </li>
        <li>
          For Cursor / Claude Code: confirm the file is checked into the
          repo and not gitignored.
        </li>
        <li>
          Re-state the rules at the top of your prompt:{' '}
          <em>"Use Caret components from ./caret. Don't import chalk or
          ora."</em>
        </li>
      </ol>

      <Callout kind="info" title="Still stuck?">
        Open an issue at{' '}
        <a href="https://github.com/gorkemyildiz/caret">
          github.com/gorkemyildiz/caret
        </a>{' '}
        with the output of <code>node --version</code>,{' '}
        <code>caret --version</code>, your terminal, and{' '}
        <code>echo $TERM $LANG</code>.
      </Callout>

      <p>
        See <Link href="/docs/reference/faq">FAQ</Link> for higher-level
        questions about why Caret behaves the way it does.
      </p>
    </Prose>
  )
}
