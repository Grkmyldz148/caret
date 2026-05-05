# Kbd

> Renders a keyboard shortcut as a bracketed inline label.

`kbd` returns a string for inline composition. Use it any time your output references a key, shortcut, or chord.

## Usage

```ts
kbd('Ctrl+C')          // [Ctrl+C]
kbd('↵')               // [↵]
kbd(['Cmd', 'K'])      // [Cmd]+[K]

info(`Press ${kbd('Ctrl+C')} to cancel`)
```

## Options

```ts
type KbdOptions = {
  theme?: PartialTheme
}
```

## Do & don't

**Do** — use whenever your output references a keyboard shortcut
**Don't** — use for non-keys (button names, menu items)

## Out of scope

- Modifier-aware rendering (no detection of platform — caller decides Cmd vs Ctrl)
- Per-key icons
