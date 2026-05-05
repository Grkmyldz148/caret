# Command Palette

> Fuzzy command search with grouped results and keyboard shortcuts.

`commandPalette` combines a search input with a command list — like VS Code's Ctrl+Shift+P. Type to filter, select to dispatch. Returns the selected command value or `null` on cancel.

## Anatomy

```
▸ buil█  3/12

  Tasks
  ▸ Build project           [Ctrl+B]
  · Build for production
  · Build Docker image

type to filter  ↑↓ navigate  ↵ run  esc cancel
```

## Usage

```ts
const cmd = await commandPalette({
  commands: [
    { value: 'build',    label: 'Build project',  group: 'Tasks', shortcut: 'Ctrl+B' },
    { value: 'test',     label: 'Run tests',      group: 'Tasks', shortcut: 'Ctrl+T' },
    { value: 'deploy',   label: 'Deploy to prod',  group: 'Deploy' },
    { value: 'settings', label: 'Open settings',   group: 'Config' },
  ],
  placeholder: 'Type a command…',
})

if (cmd === 'build') { /* ... */ }
```

## Options

| Key           | Type                     | Default                    | Description                   |
|---------------|--------------------------|----------------------------|-------------------------------|
| `commands`    | `Command[]`              | —                          | Command list                  |
| `placeholder` | `string?`                | —                          | Shown when query empty        |
| `limit`       | `number?`                | `10`                       | Max visible commands          |
| `filter`      | `(query, cmd) => bool`   | fuzzy on label+group+desc  | Custom filter                 |

### Command type

```ts
type Command<T extends string> = {
  value: T
  label: string
  group?: string        // visual grouping header
  description?: string  // shown after label when focused
  shortcut?: string     // keyboard shortcut hint
}
```

## Keyboard

| Key       | Action                  |
|-----------|-------------------------|
| chars     | Append to query         |
| Backspace | Delete character        |
| Ctrl+U    | Clear query             |
| `↑` `↓`  | Move selection          |
| `↵`       | Run selected command    |
| `esc`     | Cancel → `null`         |

## Differences from search

| Feature    | `search`            | `commandPalette`         |
|------------|---------------------|--------------------------|
| Grouping   | No                  | Yes (by `group`)         |
| Shortcuts  | No                  | Yes (`shortcut` hint)    |
| Use case   | Data filtering      | Action dispatch          |

## Out of scope

- Inline command execution
- Recent/frequent command ranking
- Nested subcommands
