# Badge

> A small inline label, like a GitHub status badge. Returns a string.

`badge` is for status, version, tag-like inline annotations. Returns a string so you can compose it inside other components.

## Usage

```ts
badge('beta', { color: 'warning' })       // [beta]
badge('new', { color: 'accent' })          // [new]
badge('failed', { color: 'danger' })       // [failed]
badge('passing', { color: 'success' })     // [passing]

keyValue({ rows: [
  { key: 'Project', value: `my-app  ${badge('production', { color: 'danger' })}` },
]})
```

## Options

```ts
type BadgeOptions = {
  color?: 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'muted'
  theme?: PartialTheme
}
```

## Do & don't

**Do** — use for short labels (≤10 chars) that classify something
**Don't** — use for longer text (use `info`/`success`/etc); don't use for primary content

## Out of scope

- Custom shapes (always brackets)
- Outlined vs filled (always bold + bracket)
- Counters / numbers — render the number directly inside the badge
