# KeyValue

> Aligned `key: value` pairs for config dumps, status summaries, and after-output.

`keyValue` renders rows of key-value pairs with the keys aligned in a single column. Useful for showing the user the result of an operation, the contents of a config, or the metadata of an entity.

---

## Anatomy

```
Project:     my-app
Environment: production
Region:      us-east-1
Version:     2.4.1
```

Right-aligned, accent keys:

```
   Build time:  12.4s
  Bundle size:  342 KB
       Routes:  24
Cache hit rate: 87%
       Errors:  0
```

The key column is auto-sized to the longest key. The colon is part of the key visual.

---

## Options

```ts
type KeyValueOptions = {
  rows: ReadonlyArray<{
    key: string
    value: string | number | boolean
  }>
  /** Right-align the key column. Default: false (left). */
  alignKeysRight?: boolean
  /** Color the key with accent instead of dim. Default: false. */
  highlightKeys?: boolean
  theme?: PartialTheme
}
```

---

## Do & don't

**Do**
- Use for showing the user values they configured or the result of an operation
- Right-align keys when they vary widely in length and you want a tighter visual
- Highlight keys when they ARE the point (e.g. metric names)

**Don't**
- Don't use for two-column data with arbitrary values — use `table`
- Don't put long-form prose in values — use `list` or paragraphs
- Don't nest keyValue blocks — use `tree`

---

## Out of scope

- Nested or hierarchical keys (e.g. `database.host`) — flatten yourself
- Multi-line values — values are single-line strings
- Editable / interactive — use `prompt.text` per field instead
