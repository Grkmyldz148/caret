# search

> Interactive fuzzy search/filter over a dataset.

## When to use

Use `search` as a standalone data-filtering component — when you want
the user to find and select from a dataset without the full prompt
anatomy (anchor, label, PromptShell). Think of it as fzf for Caret.

Use `prompt.autocomplete` when the search is part of a form/prompt flow.
Use `search` when filtering is the primary interaction.

## Anatomy

```
▸ query█  3/42

· api-gateway        running · us-east-1
· billing-svc        failed · eu-west-1
▸ auth-service       running · us-east-1

type to filter  ↑↓ navigate  ↵ select  esc cancel
```

## API

```ts
const service = await search({
  items: services.map(s => ({
    value: s.id,
    label: s.name,
    description: `${s.status} · ${s.region}`,
  })),
  placeholder: 'Search services…',
  limit: 10,
})

if (service) {
  // user selected something
}
```

### Options

| Key           | Type       | Default                      | Description                          |
|---------------|------------|------------------------------|--------------------------------------|
| `items`       | `array`    | —                            | `{ value, label, description? }`     |
| `placeholder` | `string?`  | —                            | Shown when query is empty            |
| `limit`       | `number?`  | `10`                         | Max visible results                  |
| `filter`      | `fn?`      | fuzzy match on label+desc    | Custom `(query, item) => boolean`    |

### Return value

Returns `T | null` — the `value` of the selected item, or `null` if
the user pressed Esc.

## Filter algorithm

Default: case-insensitive subsequence matching across `label` and
`description` (concatenated). Same algorithm as `prompt.autocomplete`.

## Visual differences from prompt.autocomplete

| Feature            | `prompt.autocomplete`    | `search`               |
|--------------------|--------------------------|------------------------|
| Anchor (`^`)       | Yes                      | No                     |
| Tracked CAPS label | Yes                      | No                     |
| PromptShell        | Yes                      | No                     |
| Description column | No                       | Yes (per item)         |
| Counter            | match count              | `filtered/total`       |
| Prefix             | `●`/`○` markers          | `▸`/`·` prefixes       |

## Keyboard

| Key       | Action                                   |
|-----------|------------------------------------------|
| chars     | Append to query, reset cursor to top     |
| Backspace | Delete character                         |
| ←/→       | Move input cursor                        |
| ↑/↓       | Move selection cursor                    |
| Ctrl+U    | Clear query                              |
| Enter     | Select highlighted item                  |
| Esc       | Cancel → returns `null`                  |

## Tokens

colors.accent, symbols.prefix.focused, symbols.prefix.idle
