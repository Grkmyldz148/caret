import type { Metadata } from 'next'
import Link from 'next/link'
import { Prose } from '@/components/docs/Prose'

export const metadata: Metadata = {
  title: 'Principles — Caret docs',
  description:
    'The ten rules every Caret design decision comes back to.',
}

const PRINCIPLES = [
  {
    n: '01',
    title: 'You own the code',
    body:
      'caret add prompt copies the component into your repo. Modify, fork, or delete it. Caret is a starting point, not a dependency.',
  },
  {
    n: '02',
    title: 'Beautiful by default',
    body:
      'Caret has one strong opinion about how things should look. You shouldn\'t need to configure anything to ship a CLI that looks like Vercel or Linear built it.',
  },
  {
    n: '03',
    title: 'Transactional first',
    body:
      'Caret is optimized for CLIs that run a command and exit. Output is inline — scrollback-friendly, log-friendly, copy-paste-friendly. Fullscreen modes exist, but they are opt-in.',
  },
  {
    n: '04',
    title: 'Never touch the background',
    body:
      "Your terminal has a background. Caret does not set it. Ever. A Caret CLI works on light themes, dark themes, Solarized, Dracula, and anything else — because it doesn't fight the user's environment.",
  },
  {
    n: '05',
    title: "Respect the user's theme",
    body:
      "Foreground text uses the terminal's own foreground color. Semantic colors — success, warning, danger, info — are emitted as ANSI names so they harmonize with the user's theme. Brand colors are truecolor and fixed — that's Caret's visual signature.",
  },
  {
    n: '06',
    title: 'Color is a bonus, not a requirement',
    body:
      'Every semantic state has a symbol: ✓ ✗ ⚠ ℹ. Hierarchy uses bold, dim, and italic before color. NO_COLOR, piped output, dumb terminals, and screen readers all get a first-class Caret experience.',
  },
  {
    n: '07',
    title: 'Correctness is not opt-in',
    body:
      "Caret respects NO_COLOR, detects isatty, adapts to narrow terminals, and gracefully falls back through truecolor → 256 → ANSI 16 → plain. You don't enable any of this. You would have to go out of your way to break it.",
  },
  {
    n: '08',
    title: 'AI-native from day one',
    body:
      'Caret assumes AI tools write most of tomorrow\'s CLIs. A caret.md instruction file ships with the project so Cursor, Claude Code, and Copilot produce correct Caret code on the first try.',
  },
  {
    n: '09',
    title: 'Motion has meaning',
    body:
      'Every state transition is a designed moment. Spinners resolve into checkmarks, selections slide, progress pulses, errors reveal. Transitions are bounded (≤300ms), inline-safe, and disabled outside a live terminal or when the user prefers reduced motion.',
  },
  {
    n: '10',
    title: 'Notifications, not beeps',
    body:
      'For long-running tasks, Caret can dispatch system notifications via the OS native API. Never terminal bell. Never custom sounds. Notifications are opt-in, threshold-gated (default 10s), respect Do Not Disturb, and fall back silently when unavailable.',
  },
] as const

export default function PrinciplesPage() {
  return (
    <Prose>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
        Concepts · Principles
      </div>
      <h1>Principles</h1>
      <p>
        Caret is small enough to fit inside ten rules. Every component, every token,
        every CLI flag traces back to one of them. When the rules say "no", the code
        says no — even when it would be easier to add a flag and look the other way.
      </p>

      {PRINCIPLES.map((p) => (
        <section key={p.n}>
          <h2
            id={p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}
          >
            <span className="font-mono text-muted text-base mr-3 align-middle">
              {p.n}
            </span>
            {/*
              Literal space before the title so the right-rail TOC
              (which reads h2 textContent) gets "01 You own the code"
              instead of "01You own the code". The visual margin is
              still controlled by the span's mr-3.
            */}
            {' '}
            {p.title}
          </h2>
          <p>{p.body}</p>
        </section>
      ))}

      <hr />
      <p>
        Continue with{' '}
        <Link href="/docs/concepts/tokens">Tokens</Link> for the visual vocabulary
        these principles produce, or{' '}
        <Link href="/docs/authoring/ai-native">AI-native workflow</Link> for how the
        manifesto is enforced when an LLM is writing your CLI.
      </p>
    </Prose>
  )
}
