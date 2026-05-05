# Alert

> A bordered semantic callout box for info, success, warning, or danger.

`alert` renders a rectangular box with a colored header label and wrapped body text. Static — writes once to stdout. Unlike `modal`, it's not interactive. Unlike `banner`, it carries semantic state.

## Anatomy

```
╭── ⚠ warning: Deprecated ────────────────╮
│                                         │
│ This API will be removed in v3. Migrate │
│ to the new auth flow.                   │
│                                         │
╰─────────────────────────────────────────╯
```

## Usage

```ts
alert({
  kind: 'warning',
  title: 'Deprecated',
  body: 'This API will be removed in v3.',
})

alert({ kind: 'danger',  body: 'Data loss imminent.' })
alert({ kind: 'success', body: 'Deploy complete.' })
alert({ kind: 'info',    body: 'New feature available.' })
```

## Options

```ts
type AlertOptions = {
  kind: 'info' | 'success' | 'warning' | 'danger'
  title?: string
  body: string
  width?: number
  theme?: PartialTheme
}
```

## Do & don't

**Do** — use for critical callouts the user MUST see (warning, danger)
**Don't** — use for routine messages (use `info`/`success`/`warning`/`error` one-liners); don't use multiple alerts in a row

## Out of scope

- Interactive actions (use `modal`)
- Multi-column layouts
- Icons other than the kind symbol
