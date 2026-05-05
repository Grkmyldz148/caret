# Sparkline

> Inline mini chart built from Unicode block characters.

`sparkline` maps an array of numbers to `▁▂▃▄▅▆▇█` based on the normalized range. Returns a string for inline composition. Compact way to show trends, activity, or small histograms.

## Usage

```ts
sparkline([1, 2, 4, 7, 8, 6, 3, 2])
// → "▁▂▃▆█▆▃▂"

info(`CPU:  ${sparkline(cpuHistory)}  ${cpuHistory.at(-1)}%`)

keyValue({
  rows: [
    { key: 'Requests', value: sparkline(requestHistory) },
    { key: 'Errors',   value: sparkline(errorHistory) },
  ],
})
```

## Options

```ts
type SparklineOptions = {
  min?: number     // override range min; default: auto
  max?: number     // override range max; default: auto
  color?: boolean  // color with accent; default: true
  theme?: PartialTheme
}
```

## Do & don't

**Do** — use for 5-40 data points as a quick visual summary
**Don't** — use for precise data (use `table`); don't use for single values

## Out of scope

- Multi-color sparklines (above/below threshold)
- Line charts (only block characters)
- Labels or axes
