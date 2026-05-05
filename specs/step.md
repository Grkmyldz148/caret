# Step

> A multi-phase status indicator: which steps are done, which is current, which are pending.

`step` renders a vertical list of named steps with their statuses. Use it for showing progress through a known sequence: deploy pipeline, setup wizard, multi-stage build.

---

## Anatomy

```
✓ Validate inputs
✓ Run tests
✓ Compile assets
● Deploy to production
○ Run smoke tests
○ Send notification
```

Failed:

```
✓ Validate inputs
✓ Run tests
✗ Compile assets
— Deploy to production
— Run smoke tests
```

---

## Statuses

| Status | Symbol | Color | Meaning |
|---|---|---|---|
| `pending` | `○` | dim | Not started yet |
| `active` | `●` | accent | In progress now |
| `done` | `✓` | success | Completed successfully |
| `failed` | `✗` | danger | Completed with failure |
| `skipped` | `—` | dim italic | Intentionally not run |

---

## Options

```ts
type StepOptions = {
  steps: ReadonlyArray<{
    label: string
    status?: 'pending' | 'active' | 'done' | 'failed' | 'skipped'
  }>
  theme?: PartialTheme
}
```

---

## Behavior

`step` is **static** — it prints all steps once and returns. To show steps updating live, re-render or use `step` together with `spinner` (spinner for the active step's work, step printed at start and end as a summary).

---

## Do & don't

**Do**
- Use for multi-phase operations the user wants to follow
- Pair with `spinner` (spinner does the work, step shows the overall plan)
- Mark `failed` step with the reason in a following `error()` call

**Don't**
- Don't use for unrelated commands — use `list`
- Don't use status `active` for more than one step at a time — at most one is current
- Don't have more than ~10 steps — long lists are noise; combine related work

---

## Out of scope

- Sub-steps / nesting — use `tree` or composition
- Per-step elapsed time — caller renders separately if needed
- Animated status transitions — re-render at phase boundaries
