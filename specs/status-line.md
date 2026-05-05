# StatusLine

> Single-line compact view of multiple named statuses.

`statusLine` renders status items in one row, separated by spaces. Use for pipeline-at-a-glance, state dashboards, summary bars. For a detailed multi-line view, use `step`.

## Anatomy

```
✓ built  ✓ tested  ● deploying  ○ verified
```

## Usage

```ts
statusLine({
  items: [
    { label: 'built',     status: 'done' },
    { label: 'tested',    status: 'done' },
    { label: 'deploying', status: 'active' },
    { label: 'verified',  status: 'pending' },
  ],
})
```

## Statuses

Same as `step`: `pending`, `active`, `done`, `failed`, `skipped`.

## Options

```ts
type StatusLineOptions = {
  items: ReadonlyArray<{
    label: string
    status: 'done' | 'active' | 'pending' | 'failed' | 'skipped'
  }>
  separator?: string  // default: '  '
  theme?: PartialTheme
}
```

## Do & don't

**Do** — use for top-of-output dashboards, compact CI summaries
**Don't** — use for detailed multi-phase progress (use `step`)

## Out of scope

- Labels with icons per status
- Auto-refresh (static only)
- Spinner animation on `active` items
