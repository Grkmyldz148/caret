# Progress

> A single horizontal bar showing how far along a known-total operation is.

`progress` renders one progress bar to stdout. Unlike `spinner` (which spins indefinitely), `progress` is for operations where you know the total amount of work and how much is done.

---

## Anatomy

```
Building     ████████████░░░░░░░░░░░░░░░░░░  42%
```

```
Tests        ███████████████░░░░░░░░░░░░░░░  47/100
```

1. Optional label (`fg.default`)
2. Filled portion (`accent`)
3. Empty portion (`fg.muted` via `░`)
4. Optional percent or count suffix (`fg.muted`)

The bar auto-fits the terminal width; you can override with `width`.

---

## Options

```ts
type ProgressOptions = {
  value: number
  total: number
  label?: string
  width?: number
  showPercent?: boolean   // default: true
  showCount?: boolean     // default: false
  theme?: PartialTheme
}
```

---

## Behavior

`progress` is **static** — it prints one line and returns. To animate, call it repeatedly inside a loop. For continuous in-place updates, you would need `\r` and cursor handling that Caret doesn't (yet) provide via this component. For animated progress with that level of polish, use `spinner` with `s.update()`.

A future `progress.live()` API may add animated re-rendering. Not in v0.

---

## Do & don't

**Do**
- Use when you know the total upfront (file count, byte count, item count)
- Use for batch operations: "uploading 47 of 100 files"
- Combine with `spinner` for the wrapper: spinner says "Uploading", progress says "47/100"

**Don't**
- Don't use for unknown-duration work — use `spinner` instead
- Don't update faster than ~10 times per second — terminal redraw is the bottleneck
- Don't use percent for very small totals (1/3 looks weird as 33%)

---

## Out of scope

- In-place animated updates — use `spinner` for now
- Multi-bar progress (parallel tasks) — separate component, later
- ETA / rate display — caller computes; we just render the bar
- Nested progress (sub-tasks) — caller composes
