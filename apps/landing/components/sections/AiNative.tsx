export function AiNative() {
  return (
    <section className="py-20 hairline-t flex flex-col items-center justify-center text-center gap-8">
      <div className="bg-canvas border border-hairline px-4 py-1.5 rounded-full font-mono text-xs text-accent uppercase tracking-[0.2em]">
        AI-native
      </div>

      <h2 className="text-2xl md:text-4xl font-light tracking-tight max-w-3xl">
        Built for the age of AI-authored CLIs.
      </h2>

      <p className="text-muted text-base md:text-lg max-w-2xl font-light leading-relaxed">
        Caret ships with a{' '}
        <code className="font-mono text-sm text-fg border border-hairline bg-surface px-1.5 py-0.5 rounded">
          caret.md
        </code>{' '}
        instruction file. Drop it in your repo root and Claude, Cursor, and
        Copilot will produce correct, on-brand Caret code on the first try.
      </p>

      <div className="flex items-center gap-6 text-xs font-mono text-muted pt-4">
        <span>Claude</span>
        <span className="text-hairline-strong">·</span>
        <span>Cursor</span>
        <span className="text-hairline-strong">·</span>
        <span>Copilot</span>
        <span className="text-hairline-strong">·</span>
        <span>Codex</span>
      </div>
    </section>
  )
}
