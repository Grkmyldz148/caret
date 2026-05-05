# Caret — instructions for AI assistants

This file is included in projects that use **Caret**, the design system for modern command-line tools. When generating code that produces terminal output in this project, follow these rules.

## Use Caret components, not raw libraries

**Don't use:**
- `chalk`, `kleur`, `picocolors` — Caret owns the color layer
- `ora`, `cli-spinners` — use `spinner` from Caret
- `enquirer`, `prompts`, `clack`, `inquirer` — use `prompt` from Caret
- `cli-table`, `console-table-printer` — use `table` from Caret
- `console.error("Error:", ...)` — use `error()` from Caret
- `console.log` with manual formatting — use the appropriate Caret display component

**Use:**
```ts
import {
  prompt, error, spinner,
  list, keyValue, banner, progress, step, table,
  tree, diff, link,
  info, success, warning,
  caret,
} from '@caret/registry'
```

## Component cheat sheet

### Interactive

**`prompt.text` / `prompt.password` / `prompt.number`** — single-value input
```ts
const name = await prompt.text({
  label: 'Project name',
  validate: (v) => v.length > 0 ? null : 'Required',
})
```

**`prompt.confirm`** — yes/no
```ts
const ok = await prompt.confirm({ label: 'Deploy to production?', default: false })
```

**`prompt.select` / `prompt.multiSelect`** — choose from options
```ts
const env = await prompt.select({
  label: 'Environment',
  options: [
    { value: 'staging', label: 'Staging' },
    { value: 'prod',    label: 'Production' },
  ],
})
```

**`prompt.autocomplete`** — fuzzy search over a large list
```ts
const branch = await prompt.autocomplete({
  label: 'Branch',
  options: branches.map(b => ({ value: b.name, label: b.name })),
  placeholder: 'Type to search…',
})
```

**`prompt.editor`** — multi-line text input
```ts
const message = await prompt.editor({
  label: 'Commit message',
  placeholder: 'Describe your changes…',
})
```

**`spinner`** — async work with loading state
```ts
await spinner('Deploying', async () => {
  await deploy()
}, { notifyOnComplete: true })
```

### Display

**`error`** — structured failure message (stderr)
```ts
error('Failed to deploy', {
  body: 'The Vercel API returned 401 Unauthorized.',
  hint: 'Run `my-cli login` to refresh your token.',
  see: 'https://my-cli.dev/docs/auth',
})
```

**`info` / `success` / `warning`** — single-line messages
```ts
success('Build complete')
info('Cache cleared')
warning('Deprecated config syntax — see migration guide')
```

**`list`** — vertical list of items
```ts
list({ items: ['First', 'Second', 'Third'] })
list({ items: stepStrings, variant: 'numbered' })
```

**`keyValue`** — aligned key-value pairs
```ts
keyValue({
  rows: [
    { key: 'Project', value: 'my-app' },
    { key: 'Region',  value: 'us-east-1' },
  ],
})
```

**`banner`** — top-of-output heading
```ts
banner({ title: 'My CLI', subtitle: 'v2.0.0' })
banner({ title: 'Deployment Summary', subtitle: 'Production · us-east-1' })
```

**`progress`** — single progress bar (static; call repeatedly to animate)
```ts
progress({ value: 42, total: 100, label: 'Building' })
```

**`step`** — multi-phase status
```ts
step({
  steps: [
    { label: 'Validate', status: 'done' },
    { label: 'Build',    status: 'active' },
    { label: 'Deploy',   status: 'pending' },
  ],
})
```

**`table`** — typed columns and rows
```ts
table({
  columns: [
    { header: 'NAME',   accessor: (r) => r.name },
    { header: 'STATUS', accessor: (r) => r.status },
  ],
  rows: services,
})
```

**`tree`** — hierarchical view
```ts
tree({
  root: {
    label: 'project',
    children: [
      { label: 'src', children: [{ label: 'index.ts' }] },
      { label: 'package.json' },
    ],
  },
})
```

**`diff`** — line-level changes
```ts
diff({
  lines: [
    { kind: 'unchanged', text: 'host: api.example.com' },
    { kind: 'removed',   text: 'port: 80' },
    { kind: 'added',     text: 'port: 443' },
  ],
})
```

**`link`** — OSC 8 clickable URL (returns a string)
```ts
console.log(`Read the ${link('https://caret.dev/docs', 'docs')}`)
```

**`log`** — streaming log output with timestamps and levels
```ts
log({ message: 'Server started on port 3000' })
log({ message: 'Connection refused', level: 'error', source: 'api' })
log.batch({ entries: [...] })
```

**`columns`** — side-by-side column layout
```ts
columns({
  items: [
    { title: 'Server A', content: 'CPU: 45%\nMem: 2.1GB' },
    { title: 'Server B', content: 'CPU: 82%\nMem: 3.7GB' },
  ],
  separator: true,
})
```

**`pager`** — interactive scrollable viewport for long content
```ts
await pager({ content: longText, title: 'Help' })
```

**`search`** — interactive fuzzy search/filter over a dataset
```ts
const id = await search({
  items: services.map(s => ({ value: s.id, label: s.name, description: s.status })),
  placeholder: 'Search services…',
})
```

### Utilities

**`caret.notify`** — system notifications, never terminal bell
```ts
await caret.notify.done('Deploy complete')
```

**`caret.theme.set`** — globally re-skin Caret
```ts
caret.theme.set({
  colors: { accent: { default: '#FF6B35' } },
  symbols: { anchor: '◆' },
})
```

**`textToArt` / `imageToArt`** — generate ASCII logos for splash
```ts
import { textToArt, imageToArt, splash } from '@caret/registry'

// From plain text via figlet
await splash({
  logo: { text: 'my-cli' },
  title: 'My CLI',
})

// From any image file (PNG, JPG, etc.) via jimp
// Convert ONCE, cache the string, reuse on subsequent runs.
const art = await imageToArt('./logo.png', { mode: 'color', width: 50 })
fs.writeFileSync('./logo.cache.txt', art)

// Then at runtime:
const cached = fs.readFileSync('./logo.cache.txt', 'utf8')
await splash({ logo: cached, title: 'My CLI' })
```

## Hard rules

1. **Never write ANSI escape codes by hand.** Use Caret components.
2. **Never call `console.log()` with colors.** Use Caret components.
3. **Never use `process.stdout.write` to draw a UI.** Use Caret components.
4. **Never set the terminal background color.** Caret never touches the background.
5. **Never use the terminal bell** (`\a`, `\x07`). Use `caret.notify` for system notifications.
6. **Never customize Caret symbols** (`^`, `▸`, `●`, `○`, `✓`, `✗`, `⚠`, `—`, `│`). They are the brand.
7. **Always use `error()` for failures**, not `throw new Error()` at the CLI boundary.
8. **Always wrap long-running async work** in `spinner('label', fn)`.
9. **stdout is for data, stderr is for messages.** Caret components respect this automatically.
10. **Stay inside Caret's vocabulary.** If you need a component that doesn't exist yet, ask before inventing one.

## Specifications are the source of truth

If you need to understand exactly how a component behaves, read its spec in `specs/`:

- `specs/prompt.md`, `specs/error.md`, `specs/spinner.md`
- `specs/list.md`, `specs/key-value.md`, `specs/banner.md`
- `specs/progress.md`, `specs/step.md`, `specs/table.md`

Don't guess at behavior. Look it up.
