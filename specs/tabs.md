# Tabs

> Interactive tab bar navigation with ←/→ selection.

`tabs` renders a horizontal list of options. The active tab is accented + bold, inactive tabs are dim. Returns the selected tab value on Enter, or `null` on Esc.

## Anatomy

```
▸ Overview   · Config   · Logs

←→ navigate · ↵ select · esc cancel
```

## Usage

```ts
const tab = await tabs({
  items: [
    { label: 'Overview', value: 'overview' },
    { label: 'Config',   value: 'config' },
    { label: 'Logs',     value: 'logs' },
  ],
})

if (tab === 'config') { /* ... */ }
```

## Options

| Key            | Type                            | Default | Description                            |
|----------------|---------------------------------|---------|----------------------------------------|
| `items`        | `{ label, value }[]`            | —       | Tab items                              |
| `defaultIndex` | `number?`                       | `0`     | Initially selected tab                 |
| `immediate`    | `boolean?`                      | `false` | Return immediately on ←/→ (no Enter)   |

## Keyboard

| Key   | Action              |
|-------|---------------------|
| `←`   | Previous tab        |
| `→`   | Next tab            |
| `tab` | Next tab            |
| `↵`   | Confirm selection   |
| `esc` | Cancel → `null`     |

## Do & don't

**Do** — use for switching between views or sections
**Don't** — use for selecting from a long list (use `prompt.select`); don't use as a form field (use `prompt.select`)

## Out of scope

- Vertical tab layout
- Tab content rendering (compose yourself)
- Closeable/draggable tabs
- Overflow scrolling (keep tab count low)
