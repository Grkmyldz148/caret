# Time — timestamp() and timeAgo()

> Styled time strings for composition.

Two helpers for displaying time:

## `timestamp()`

```ts
timestamp()                         // "12:34:56"
timestamp({ format: 'iso' })        // "2026-04-08T12:34:56"
timestamp({ format: 'full' })       // "Apr 8, 2026, 12:34:56"
timestamp({ date: someDate })       // formats a specific date
```

## `timeAgo(date)`

```ts
timeAgo(new Date())                                    // "just now"
timeAgo(new Date(Date.now() - 1000 * 60 * 5))          // "5 minutes ago"
timeAgo(new Date('2026-01-01'))                        // "3 months ago"
timeAgo(new Date(Date.now() + 1000 * 60 * 30))         // "30 minutes from now"
```

Both return dim-colored strings by default. Pass `colored: false` for plain.

## Options

```ts
type TimestampOptions = {
  format?: 'time' | 'iso' | 'full'   // default: 'time'
  date?: Date
  colored?: boolean                   // default: true
  theme?: PartialTheme
}

type TimeAgoOptions = {
  from?: Date        // "now" reference; default: new Date()
  colored?: boolean  // default: true
  theme?: PartialTheme
}
```

## Do & don't

**Do** — compose into keyValue, list, paragraph, or messages for context
**Don't** — use for precise durations (use an actual duration library)

## Out of scope

- Locale customization
- Timezone conversion
- Formatting tokens (Y, M, D, etc.)
