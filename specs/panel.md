# Panel

> A bordered container with an optional title — the fundamental layout primitive.

`panel` wraps content inside a thin rounded box frame. Use it to group related information visually: config dumps, summaries, card-style blocks.

## Anatomy

```
╭─ Configuration ──────────────╮
│ region: us-east-1            │
│ replicas: 3                  │
│ cache: enabled               │
╰──────────────────────────────╯
```

Without title:

```
╭──────────────────────────────╮
│ Hello, world.                │
╰──────────────────────────────╯
```

## Usage

```ts
panel({
  title: 'Configuration',
  body: 'region: us-east-1\nreplicas: 3\ncache: enabled',
})

panel({
  body: ['Hello, world.', 'Second line.'],
  width: 40,
})
```

## Options

| Key       | Type               | Default              | Description                              |
|-----------|--------------------|----------------------|------------------------------------------|
| `title`   | `string?`          | —                    | Rendered on the top border               |
| `body`    | `string \| string[]` | —                  | Content lines                            |
| `width`   | `number?`          | `min(60, columns-4)` | Override content width                   |
| `padding` | `number?`          | `1`                  | Left/right inner padding                 |

## Do & don't

**Do** — use for grouping related static content (config, summary, card)
**Don't** — use for interactive content (use `modal`); don't nest panels

## Tokens

colors.accent, symbols.borders

## Out of scope

- Interactive content inside the panel
- Scrollable panel body (compose with `scrollable`)
- Background fills (Caret never touches background)
