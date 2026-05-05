# Context Menu

> A bordered action menu with separator support.

`contextMenu` renders a small bordered menu of actions. Navigate with ↑/↓, select with Enter, dismiss with Esc. Supports separators and danger-colored items. Returns the selected value or `null`.

## Anatomy

```
╭──────────────╮
│ ▸ Edit       │
│ · Duplicate  │
│ ──────────── │
│ · Delete     │
╰──────────────╯

↑↓ navigate · ↵ select · esc dismiss
```

## Usage

```ts
const action = await contextMenu({
  items: [
    { label: 'Edit',      value: 'edit' },
    { label: 'Duplicate',  value: 'duplicate' },
    { separator: true },
    { label: 'Delete',    value: 'delete', danger: true },
  ],
  title: 'Actions',
})
```

## Options

| Key     | Type                 | Default | Description             |
|---------|----------------------|---------|-------------------------|
| `items` | `ContextMenuItem[]`  | —       | Menu items              |
| `title` | `string?`            | —       | Optional title          |

### Item types

```ts
// Action item
{ label: string; value: T; danger?: boolean }

// Separator
{ separator: true }
```

## Keyboard

| Key   | Action              |
|-------|---------------------|
| `↑`   | Previous item       |
| `↓`   | Next item           |
| `↵`   | Select item         |
| `esc` | Dismiss → `null`    |

## Do & don't

**Do** — use for contextual actions on a selected item
**Don't** — use for primary navigation (use `tabs`); don't use for long lists (use `search`)

## Out of scope

- Nested submenus
- Mouse/click support
- Dynamic items
- Positioning relative to cursor
