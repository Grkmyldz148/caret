# autocomplete

> Fuzzy-search prompt — type to filter, arrow-keys to navigate, enter to select.

## When to use

Use `prompt.autocomplete` instead of `prompt.select` when the option list is large
(>15 items) or the user is likely to know the name of what they want. Examples:
branch selection, package lookup, service discovery.

## Anatomy

```
^ A U T O C O M P L E T E   L A B E L
  Optional description text

  ▸ query█                    3 matches

  ● matching-option-1
  ○ matching-option-2
  ○ matching-option-3

  type to filter  ↑↓ navigate  ↵ select  esc cancel
```

## Resolved state

```
^ A U T O C O M P L E T E   L A B E L  matching-option-1
```

## API

```ts
const branch = await prompt.autocomplete({
  label: 'Branch',
  description: 'Select a branch to deploy',
  options: branches.map(b => ({ value: b.name, label: b.name })),
  placeholder: 'Type to search…',
  limit: 8,
})
```

### Options

| Key           | Type       | Default                        | Description                            |
|---------------|------------|--------------------------------|----------------------------------------|
| `label`       | `string`   | —                              | Tracked CAPS heading                   |
| `description` | `string?`  | —                              | Dim text below label                   |
| `options`     | `array`    | —                              | `{ value, label }` pairs               |
| `placeholder` | `string?`  | —                              | Shown when query is empty              |
| `limit`       | `number?`  | `8`                            | Max visible results                    |
| `filter`      | `fn?`      | case-insensitive fuzzy match   | Custom `(query, option) => boolean`    |

## Filter algorithm

Default: case-insensitive subsequence matching. Each character of the query
must appear in order within the option label — not necessarily contiguous.

`"gw"` matches `"api-gateway"` (`g`...`a`...`t`...`e`...`w`...`a`...`y`).

## Keyboard

| Key       | Action                                   |
|-----------|------------------------------------------|
| chars     | Append to query, reset cursor to top     |
| Backspace | Delete character before input cursor     |
| ←/→       | Move input cursor                        |
| ↑/↓       | Move selection cursor                    |
| Ctrl+U    | Clear query                              |
| Enter     | Submit selected option                   |
| Esc       | Cancel → throws `CaretCancelled`         |

## Tokens

colors.accent, symbols.anchor, symbols.prefix, symbols.marker,
spacing.indent, spacing.sectionBefore, typography.label
