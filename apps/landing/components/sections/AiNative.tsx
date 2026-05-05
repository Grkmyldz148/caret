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
        Caret ships{' '}
        <a
          href="https://github.com/Grkmyldz148/caret-skills"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm text-fg border border-hairline bg-surface px-1.5 py-0.5 rounded hover:border-accent hover:text-accent transition-colors"
        >
          caret-skills
        </a>{' '}
        — two manifesto-checked skills your agent can invoke. They turn
        "write a CLI component" from generic AI output into Caret code on
        the first try.
      </p>

      {/* Two-skill strip — these are the actual skills shipped in
          Grkmyldz148/caret-skills. Keep names exact so users can copy
          them into /plugin install. */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
        <div className="bg-surface border border-hairline rounded-md px-4 py-3 text-left">
          <div className="font-mono text-xs text-accent mb-1">
            /create-caret-component
          </div>
          <div className="text-xs text-muted leading-relaxed">
            Author one Caret component end-to-end — tokens, props, render,
            capability fallbacks, test.
          </div>
        </div>
        <div className="bg-surface border border-hairline rounded-md px-4 py-3 text-left">
          <div className="font-mono text-xs text-accent mb-1">
            /caret-cli-design
          </div>
          <div className="text-xs text-muted leading-relaxed">
            Read an existing CLI repo, output an adoption plan with the
            exact <code className="font-mono">caret-cli add</code> sequence.
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 text-xs font-mono text-muted pt-2 flex-wrap justify-center">
        <span>Claude Code</span>
        <span className="text-hairline-strong">·</span>
        <span>Cursor</span>
        <span className="text-hairline-strong">·</span>
        <span>OpenCode</span>
        <span className="text-hairline-strong">·</span>
        <span>Codex</span>
        <span className="text-hairline-strong">·</span>
        <span className="text-subtle">
          50+ runtimes via{' '}
          <code className="font-mono text-muted">npx skills</code>
        </span>
      </div>
    </section>
  )
}
