# Messages — info, success, warning

> Lightweight one-line semantic messages. Lighter cousins of `error()`.

Three functions for one-line messages without the structured `body/hint/see` of `error`:

- `info(text)` → `ℹ info: text` (stdout)
- `success(text)` → `✓ success: text` (stdout)
- `warning(text)` → `⚠ warning: text` (stderr)

## Usage

```ts
info('Cache cleared')
success('Build complete')
warning('Deprecated config syntax — see migration guide')
```

## Options

```ts
type MessageOptions = {
  theme?: PartialTheme
}
```

## Output destination

| Function | Stream |
|---|---|
| `info()` | stdout |
| `success()` | stdout |
| `warning()` | stderr |
| `error()` (separate) | stderr |

`info` and `success` are positive/neutral; they go on stdout. `warning` is a problem signal so it goes on stderr like `error`.

## Do & don't

**Do** — use for transient one-line announcements; use `error` for failures with structured detail.
**Don't** — use `info` for things that should be quiet (use a proper logger); don't customize the symbols or labels.

## Out of scope

- Multi-line messages — use `error` with body, or `paragraph`
- Custom severity levels — Caret has these four, that's it
- Logging integration — write your own bridge
