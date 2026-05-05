# Space

> Vertical whitespace helper.

`space` writes N blank lines to stdout. A cleaner alternative to `process.stdout.write('\n')` for callers that want explicit spacing.

## Usage

```ts
space()    // 1 blank line
space(3)   // 3 blank lines
```

## Do & don't

**Do** — use for deliberate spacing between sections
**Don't** — use for layout (let flexbox-aware components handle their own spacing)

## Out of scope

- Horizontal spacing (use `pad`)
- Fixed height boxes
