# Reveal

> Animates a list of lines appearing top-to-bottom, one per tick.

`reveal` is for sequential output that should feel like a "boot log" — multiple lines, each appearing after a brief delay. Returns a Promise.

## Usage

```ts
await reveal([
  'Loading configuration…',
  'Connecting to API…',
  'Initializing workspace…',
  'Ready.',
])

await reveal({ lines: [...], delay: 300 })
```

## Options

```ts
type RevealOptions = {
  lines: ReadonlyArray<string>
  delay?: number  // ms between lines, default 200
  theme?: PartialTheme
}
```

## Behavior

- Lines appear one at a time, `delay` ms apart
- Reduced motion / non-TTY → all lines at once

## Do & don't

**Do** — use for boot-log style output, status sequences with no per-step async work
**Don't** — use when you have actual async tasks per line (use `boot` instead, which runs the task and shows real progress)

## Out of scope

- Per-line styling — all lines render in default text
- Branching reveal (conditional lines) — caller composes
- Reverse / random order
