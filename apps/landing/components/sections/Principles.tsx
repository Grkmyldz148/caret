const PRINCIPLES = [
  {
    n: '01',
    title: 'You own the code',
    body: '`npx caret add prompt` copies the component into your repo. Modify, fork, or delete it. Caret is a starting point, not a dependency.',
  },
  {
    n: '02',
    title: 'Beautiful by default',
    body: 'One strong opinion about how things should look. No configuration needed to ship a CLI that looks like Vercel built it.',
  },
  {
    n: '03',
    title: 'Never touch the background',
    body: 'Your terminal has a background. Caret does not set it. Ever. Works on every theme because it doesn’t fight the user’s environment.',
  },
  {
    n: '04',
    title: 'Respect the user’s theme',
    body: 'Foreground uses the terminal’s fg. Semantic colors emit ANSI names so they harmonize. Only the accent is fixed truecolor.',
  },
  {
    n: '05',
    title: 'AI-native from day one',
    body: 'A caret.md instruction file ships with the project so Cursor, Claude Code, and Copilot produce correct Caret code on the first try.',
  },
  {
    n: '06',
    title: 'Motion has meaning',
    body: 'Spinners resolve into checkmarks, progress pulses, errors reveal. Bounded to 300ms, inline-safe, disabled under reduced motion.',
  },
] as const

export function Principles() {
  return (
    <section className="py-24 hairline-t">
      <div className="mb-16 max-w-3xl">
        <div className="font-mono text-xs text-accent mb-4 uppercase tracking-[0.2em]">
          Principles
        </div>
        <h2 className="text-3xl md:text-4xl font-light tracking-tight">
          Every decision comes back to these.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-14">
        {PRINCIPLES.map((p, i) => (
          <div key={p.n} className="flex flex-col gap-3">
            <div
              className={`font-mono text-xl font-light ${
                i === 0 ? 'text-accent' : 'text-fg'
              }`}
            >
              {p.n}
            </div>
            <h3 className="text-lg text-fg font-medium tracking-tight">
              {p.title}
            </h3>
            <p className="text-muted text-sm leading-relaxed">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
