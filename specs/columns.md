# columns

> Side-by-side column layout for dashboards and comparisons.

## When to use

Use `columns` when you need to display related content side by side —
server comparison, before/after diffs, multi-panel dashboards, paired
key-value groups.

## Anatomy

```
S E R V E R   A          S E R V E R   B

CPU: 45%                  CPU: 82%
Mem: 2.1GB                Mem: 3.7GB
Disk: 120GB               Disk: 89GB
```

With separator:

```
S E R V E R   A      │   S E R V E R   B
                      │
CPU: 45%              │   CPU: 82%
Mem: 2.1GB            │   Mem: 3.7GB
```

## API

```ts
columns({
  items: [
    { title: 'Server A', content: 'CPU: 45%\nMem: 2.1GB\nDisk: 120GB' },
    { title: 'Server B', content: 'CPU: 82%\nMem: 3.7GB\nDisk: 89GB' },
  ],
})

columns({
  items: [
    { title: 'Before', content: oldConfig },
    { title: 'After',  content: newConfig },
  ],
  separator: true,
  gap: 6,
})
```

### Options

| Key         | Type       | Default | Description                              |
|-------------|------------|---------|------------------------------------------|
| `items`     | `array`    | —       | `{ title?, content, width? }` per column |
| `gap`       | `number?`  | `4`     | Characters between columns               |
| `separator` | `boolean?` | `false` | Show vertical gutter `│` between columns |

### ColumnItem

| Key       | Type       | Default | Description                                |
|-----------|------------|---------|--------------------------------------------|
| `title`   | `string?`  | —       | Tracked CAPS heading above content         |
| `content` | `string`   | —       | Column body — may contain newlines         |
| `width`   | `number?`  | auto    | Fixed width; auto-fits to content if omitted |

## Column widths

When `width` is omitted, each column auto-sizes to its widest line
(including the tracked title). Columns never wrap — content is
rendered as-is.

## Tokens

colors.accent, symbols.structure.gutter, typography (tracking)
