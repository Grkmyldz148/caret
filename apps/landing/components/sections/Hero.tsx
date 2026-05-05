import { symbols } from '@/lib/tokens'
import { CaretMark } from '@/components/CaretMark'
import { HighlightedCode } from '@/components/docs/highlight'
import {
  Accent,
  Dim,
  Row,
  Spinner,
  Success,
  TerminalWindow,
} from '@/components/terminal'

const SOURCE = `import { prompt, spinner, success } from './caret'

const name = await prompt.text({
  label: 'Project name',
})

await spinner('Deploying', deploy, {
  onSuccess: \`\${name} is live\`,
})`

const CHIPS = [
  'inline output',
  'NO_COLOR-aware',
  'AI-native',
  'no runtime dep',
] as const

export function Hero() {
  return (
    <section className="py-20 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
      {/* ── Left column ─────────────────────────────────────── */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="font-mono text-xs text-muted flex items-center gap-2.5">
          <CaretMark className="text-accent" size={14} />
          <span>v0 · in active design</span>
        </div>

        <h1 className="text-[clamp(2.25rem,4.4vw+0.75rem,4rem)] font-light tracking-tightest leading-[1.05] text-fg max-w-[14ch]">
          Design system for modern CLIs
          <span className="text-accent">.</span>
          <span className="inline-block text-accent align-baseline caret-blink ml-0.5">
            {symbols.cursor}
          </span>
        </h1>

        <p className="text-base md:text-lg text-muted leading-relaxed max-w-xl font-light">
          Caret is to terminals what shadcn/ui is to the web. Copy-paste
          components, a token system, and a spec — so your CLI ships looking
          like Vercel or Linear built it.
        </p>

        <div className="flex items-center gap-3 pt-1">
          <a
            href="https://www.npmjs.com/package/caret-cli"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-fg text-canvas px-5 py-2.5 font-medium text-sm rounded-md hover:opacity-90 transition-opacity"
          >
            Get started
          </a>
          <a
            href="#components"
            className="text-fg border border-hairline-strong px-5 py-2.5 font-medium text-sm rounded-md hover:border-accent hover:text-accent transition-colors"
          >
            Browse components →
          </a>
        </div>

        {/* Feature chip strip — claims that distinguish a Caret CLI
            from chalk + ora glued together. Mono caps to match the
            rest of Caret's typographic vocabulary. */}
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          {CHIPS.map((chip) => (
            <li key={chip} className="flex items-center gap-1.5">
              <span className="text-success">{symbols.state.success}</span>
              <span>{chip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Right column — code → output diptych ────────────── */}
      <div className="lg:col-span-5 w-full flex flex-col gap-2">
        {/* Source code panel — what the CLI author writes. */}
        <div className="bg-terminal-canvas border border-terminal-hairline rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 h-8 px-3 border-b border-terminal-hairline bg-terminal-surface">
            <svg
              width="10"
              height="10"
              viewBox="0 0 16 16"
              fill="none"
              className="text-terminal-accent"
              aria-hidden
            >
              <path
                d="M2.5 13.5V2.5H10.5L13.5 5.5V13.5H2.5Z"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
            <span className="font-mono text-[10.5px] text-terminal-subtle">
              deploy.ts
            </span>
          </div>
          <pre className="font-mono text-[11.5px] leading-[1.65] px-3.5 py-3 text-terminal-fg whitespace-pre overflow-x-auto">
            <HighlightedCode code={SOURCE} lang="ts" />
          </pre>
        </div>

        {/* Connector hint — visually anchors the relationship
            "this code produces this output". */}
        <div className="flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-subtle py-0.5">
          <span className="hairline-t flex-1 max-w-[64px]" />
          <span>renders</span>
          <span className="text-accent">↓</span>
          <span className="hairline-t flex-1 max-w-[64px]" />
        </div>

        {/* Rendered output — what the user sees in their terminal. */}
        <TerminalWindow title="~/projects/my-cli">
          <Row>
            <Accent>{symbols.anchor}</Accent>{' '}
            <span className="font-medium">
              {'P R O J E C T   N A M E'}
            </span>
          </Row>
          <div className="pl-[2ch]">
            <Row>
              <Accent>{symbols.prefix.focused}</Accent> <span>acme-cli</span>
              <span className="cursor-cell caret-blink">&nbsp;</span>
            </Row>
          </div>
          <Row>{' '}</Row>
          <Spinner
            label="Deploying to production…"
            state="success"
            suffixTime="2.3s"
          />
          <Row>
            <Success>{symbols.state.success}</Success>{' '}
            <span>acme-cli is live</span>{' '}
            <Dim>→ https://acme.sh</Dim>
          </Row>
        </TerminalWindow>
      </div>
    </section>
  )
}
