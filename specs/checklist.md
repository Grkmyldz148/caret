# Checklist

> A static TODO list with checkbox markers.

`checklist` is a list of items each with a done/pending state. For interactive checklists, use `prompt.multiSelect`.

## Anatomy

```
✓ Install dependencies
✓ Configure environment
○ Run migrations
○ Start server
```

## Usage

```ts
checklist({
  items: [
    { label: 'Install dependencies', done: true },
    { label: 'Configure environment', done: true },
    { label: 'Run migrations' },
    { label: 'Start server', description: 'npm run dev' },
  ],
})
```

## Options

```ts
type ChecklistOptions = {
  items: ReadonlyArray<{
    label: string
    done?: boolean
    description?: string
  }>
  theme?: PartialTheme
}
```

## Do & don't

**Do** — use for progress summaries ("done so far"), setup instructions
**Don't** — use for dynamic progress (use `step` instead); don't use for tabular data

## Out of scope

- Interactive toggling (use `prompt.multiSelect`)
- Nested checklists (flatten or use `tree`)
- Per-item custom icons
