const ISSUES = [
  'Colors applied at random, clashing with the user’s terminal theme.',
  'Spinners and prompts copy-pasted from five different libraries.',
  'Error messages that look nothing like the rest of the tool.',
  'No respect for NO_COLOR, non-interactive pipes, or narrow terminals.',
] as const

export function Problem() {
  return (
    <section className="py-24 hairline-t grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
      <div className="md:col-span-5">
        <h2 className="text-3xl md:text-4xl font-light tracking-tight">
          Every CLI is an island.
        </h2>
      </div>

      <div className="md:col-span-7 flex flex-col gap-8">
        <ul className="space-y-5 font-light">
          {ISSUES.map((text) => (
            <li key={text} className="flex items-start gap-4">
              <span className="font-mono text-danger leading-none pt-1 text-lg">
                ✗
              </span>
              <span className="text-muted text-base md:text-lg">{text}</span>
            </li>
          ))}
        </ul>

        <p className="text-fg italic text-lg opacity-80 mt-4 border-l border-hairline pl-6">
          The web already solved this. The terminal has no equivalent — until
          now.
        </p>
      </div>
    </section>
  )
}
