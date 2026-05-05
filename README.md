# Caret

**The design system for modern command-line tools.**

Caret is to terminals what shadcn/ui is to the web: an opinionated, copy-paste design system that gives your CLI the taste and polish of a design-led product — out of the box.

---

## The problem

In the AI era, anyone can ship a CLI. And they are — thousands of new command-line tools every month, most written by developers who built their first one this week. The output is predictable:

- Colors applied at random. Is red an error, a brand, or a highlight?
- Spinners, prompts, and tables copy-pasted from five different libraries, each with its own conventions.
- Error messages that look nothing like the rest of the tool, let alone any other tool.
- No respect for `NO_COLOR`. No respect for pipes. No respect for narrow terminals. No respect for screen readers.
- Every CLI is an island.

The web already solved this. Bootstrap, then Tailwind, then shadcn/ui gave solo developers a shared visual vocabulary that produces professional results on day one.

**The terminal has no equivalent.** Caret is that equivalent.

---

## What Caret is

A design language first, an implementation second.

- **Components** you copy into your project — prompts, errors, spinners, tables, progress, banners, key-values, step indicators.
- **A token system** — colors, spacing, borders, typography attributes, symbols — built on the [Helmlab](https://helmlab.space) color science library.
- **A CLI** — `npx caret add <component>` drops a component into your repo. You own the code.
- **A specification** — the rules behind the components, so anyone can port Caret to another language or framework.

Caret is built on top of [Ink](https://github.com/vadimdemedes/ink) — React for the terminal. Ink is to Caret what Radix is to shadcn/ui: a proven headless primitive layer to build on, not replace.

---

## What Caret is not

- **Not a terminal emulator.** Caret runs inside iTerm, Alacritty, Wezterm, Ghostty, Windows Terminal, or whatever you already use.
- **Not a TUI framework.** Caret is for command-line tools that run, print, and exit — not fullscreen applications like `k9s`, `lazygit`, or `btop`. For those, reach for TermUI, Ink, Textual, or Ratatui directly.
- **Not a runtime dependency.** You copy code into your repo. There is no `@caret/ui` version to lock.
- **Not "just another component library."** Caret exists to define a language, not to ship widgets.

---

## Who Caret is for

- **CLI authors** who want their tool to look like a design-led company shipped it — without hiring a designer.
- **Developers building CLIs with AI.** You want Claude or Cursor to produce beautiful, consistent output, not five `chalk.red()` calls glued together.
- **Teams** building internal tools that they'd like to look and feel like the public products they ship.

---

## Principles

Every decision in Caret comes back to these.

### 1. You own the code

`npx caret add prompt` copies the component into your repo. Modify, fork, or delete it. Caret is a starting point, not a dependency.

### 2. Beautiful by default

Caret has one strong opinion about how things should look. You shouldn't need to configure anything to ship a CLI that looks like Vercel or Linear built it.

### 3. Transactional first

Caret is optimized for CLIs that run a command and exit. Output is inline — scrollback-friendly, log-friendly, copy-paste-friendly. Fullscreen modes exist, but they are opt-in.

### 4. Never touch the background

Your terminal has a background. Caret does not set it. Ever. A Caret CLI works on light themes, dark themes, Solarized, Dracula, and anything else — because it doesn't fight the user's environment.

### 5. Respect the user's theme

Foreground text uses the terminal's own foreground color. Semantic colors — success, warning, danger, info — are emitted as ANSI names so they harmonize with the user's theme. Brand colors are truecolor and fixed — that's Caret's visual signature, the part that makes a Caret CLI recognizable at a glance.

### 6. Color is a bonus, not a requirement

Every semantic state has a symbol: ✓ ✗ ⚠ ℹ. Hierarchy uses bold, dim, and italic before color. `NO_COLOR`, piped output, dumb terminals, and screen readers all get a first-class Caret experience.

### 7. Correctness is not opt-in

Caret respects `NO_COLOR`, detects `isatty`, adapts to narrow terminals, and gracefully falls back through truecolor → 256 → ANSI 16 → plain. You don't enable any of this. You would have to go out of your way to break it.

### 8. AI-native from day one

Caret assumes AI tools write most of tomorrow's CLIs. Documentation, types, and patterns are designed to be unambiguously parseable by coding assistants. A `caret.md` instruction file ships with the project so Cursor, Claude Code, and Copilot produce correct Caret code on the first try.

### 9. Motion has meaning

Every state transition is a designed moment. Spinners resolve into checkmarks, selections slide, progress pulses, errors reveal. Transitions are bounded (≤300ms), inline-safe, part of the token system, and disabled automatically outside a live terminal or when the user prefers reduced motion.

### 10. Notifications, not beeps

For long-running tasks, Caret can dispatch system notifications via the OS's native API. Never terminal bell. Never custom sounds. Notifications are opt-in, threshold-gated (default 10 seconds), respect OS focus and Do Not Disturb, and fall back silently when unavailable.

---

## How it works

```bash
# scaffold a new CLI with Caret preinstalled
npx caret init my-cli

# add a component
npx caret add prompt
```

```tsx
import { prompt, error, spinner } from './caret'

const name = await prompt.text({ label: 'Project name' })

await spinner('Deploying', async () => {
  await deploy(name)
})

error('Deploy failed', {
  hint: 'Check your API key in ~/.config/my-cli',
  see: 'https://my-cli.dev/docs/auth',
})
```

That's it. No provider. No config. No theme object you forgot to pass down.

---

## Roadmap — v0

The first release is small and sharp.

**Interactive components**
- `prompt` — text, password, confirm, select, multi-select, number
- `spinner` — async loading with success/failure resolution and optional system notification

**Display components**
- `error` — Rust-compiler-style errors with `error:`, `hint:`, and `see:`
- `list` — bullet, numbered, arrow, or dash variants
- `keyValue` — aligned key-value pairs for config dumps and summaries
- `banner` — simple or boxed heading
- `progress` — horizontal progress bar with percent or count
- `step` — multi-phase status indicator (pending, active, done, failed, skipped)
- `table` — typed columns and rows with optional borders
- `tree` — hierarchical view with box-drawing branches
- `diff` — unified-diff style line rendering
- `info`, `success`, `warning` — one-line semantic messages
- `link` — OSC 8 clickable hyperlinks (returns a string for composition)

**Theme system**
- Modular tokens — `colors`, `motion`, `symbols`, `spacing`, `typography`
- Authored in [Helmlab](https://helmlab.space), compiled to sRGB at build time
- `setTheme()` for global re-skin, `<ThemeProvider>` and `useTheme()` for React-tree overrides
- Per-component `theme` option for one-off overrides

**Utilities**
- `caret.notify` — opt-in system notifications (macOS, Linux, Windows). Never the terminal bell.
- `caret.theme` — convenience accessors over global theme APIs
- `lib/capability` — TTY, NO_COLOR, REDUCED_MOTION, narrow-terminal detection
- `lib/paint` — capability-aware color/typography helpers

**Tooling**
- `npx caret init` — scaffolds a new CLI with Caret preinstalled
- `npx caret add <component>` — copies a component into your project

**Design**
- Landing page that demonstrates each component in live terminal output

**Later (v1+)**
`form` (multi-field), `modal` (interactive overlay), `code-block` (syntax-highlighted),
`tree.live` and `progress.live` (animated re-rendering).

---

## Credits

Caret's color system is powered by [Helmlab](https://helmlab.space).

---

## Status

Caret is in active design. Nothing is released yet. Follow along as the manifesto becomes a product.
