# Heatmap

> Grid-based heatmap with block character intensity levels.

`heatmap` maps a 2D numeric array to block characters (░ ▒ ▓ █) with five intensity levels. Row and column labels are optional. Values are auto-normalized to the data range.

## Anatomy

```
Mon  ░░ ▒▒ ▓▓ ██ ▒▒
Tue  ▒▒ ▓▓ ██ ▓▓ ░░
Wed  ▒▒ ▓▓ ▓▓ ██ ░░
     9am 10am 11am 12pm 1pm
```

## Usage

```ts
heatmap({
  data: [
    [0, 1, 3, 5, 2],
    [1, 4, 5, 3, 0],
    [2, 3, 4, 5, 1],
  ],
  rowLabels: ['Mon', 'Tue', 'Wed'],
  colLabels: ['9am', '10am', '11am', '12pm', '1pm'],
})
```

## Options

| Key         | Type          | Default | Description                |
|-------------|---------------|---------|----------------------------|
| `data`      | `number[][]`  | —       | 2D numeric grid            |
| `rowLabels` | `string[]?`   | —       | Labels for rows            |
| `colLabels` | `string[]?`   | —       | Labels for columns         |
| `min`       | `number?`     | auto    | Custom minimum value       |
| `max`       | `number?`     | auto    | Custom maximum value       |
| `cellWidth` | `number?`     | `2`     | Character width per cell   |

## Intensity levels

| Level | Unicode | ASCII | Style   |
|-------|---------|-------|---------|
| 0     | ` `     | ` `   | Dim     |
| 1     | `░`     | `.`   | Dim     |
| 2     | `▒`     | `:`   | Default |
| 3     | `▓`     | `#`   | Bold    |
| 4     | `█`     | `@`   | Accent  |

## Do & don't

**Do** — use for activity grids, GitHub-style contribution charts, time×metric views
**Don't** — use for precise data (use `table`); don't use for single-row data (use `sparkline`)

## Out of scope

- Color gradients (uses block intensity only)
- Interactive hover/select
- Legend/scale bar
