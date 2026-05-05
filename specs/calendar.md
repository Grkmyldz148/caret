# Calendar

> Month-view calendar with today and marked date highlights.

`calendar` renders a single month grid. Today is bold + accent, marked dates are accent. Uses standard Mo–Su column layout.

## Anatomy

```
A P R I L   2 0 2 6
Mo  Tu  We  Th  Fr  Sa  Su
         1   2   3   4   5
 6   7   8   9  10  11  12
13  14  15  16  17  18  19
20  21  22  23  24  25  26
27  28  29  30
```

## Usage

```ts
// Current month
calendar()

// Specific month with marked dates
calendar({
  month: 4,
  year: 2026,
  marked: [5, 12, 19, 26],
})
```

## Options

| Key              | Type        | Default        | Description                |
|------------------|-------------|----------------|----------------------------|
| `month`          | `number?`   | current month  | Month (1–12)               |
| `year`           | `number?`   | current year   | Year                       |
| `marked`         | `number[]?` | `[]`           | Days to highlight          |
| `highlightToday` | `boolean?`  | `true`         | Highlight current day      |

## Tokens

colors.accent, typography.heading (tracked title)

## Do & don't

**Do** — use for scheduling UIs, date display, deployment calendars
**Don't** — use for date input (compose with prompt)

## Out of scope

- Date picker (interactive selection)
- Multi-month view
- Week-starts-on-Sunday option
- Event/appointment display
