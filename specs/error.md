# Error

> When something goes wrong, the error message is the product. Make it the best part of the experience.

Error is Caret's way of telling the user something failed. It is modeled after the Rust compiler's error output — a structured block with `error:`, `hint:`, and `see:` sections. It is the opposite of `throw new Error("oops")`.

---

## When to use

Use `error` for any failure the user needs to understand. Use it even for programmer errors — especially for programmer errors, because your CLI will be read by someone tomorrow who is not you.

Do not use `error` for exceptional control flow. Do not use `error` for warnings.

---

## Anatomy

```
✗ error: Failed to deploy to production
│
│ The Vercel API returned 401 Unauthorized.
│
│ hint: Your API token may have expired. Run `my-cli login` to refresh it.
│ see:  https://my-cli.dev/docs/auth
```

1. **Header** — `✗` symbol + `error:` keyword + title, all in `danger` (symbol and keyword bold)
2. **Gutter** — `│` in `danger`, forms a visual block on the left, runs the height of the error
3. **Body** — optional explanation, `fg.default`, indented after the gutter
4. **Hint row** — optional, `hint:` keyword in `accent`, body in `fg.default`
5. **See row** — optional, `see:` keyword in `fg.muted`, URL in `accent` (underlined if supported)

Every error is a small, structured document. Minimum form:

```
✗ error: Failed to deploy to production
```

The gutter and body rows appear only if there's something to put in them.

---

## Variants

One. `error` is a single disciplined pattern — no types, no severity levels, no variants. A warning is a different component. A debug log is a different component. If it's an error, it looks like this.

---

## States

Errors are not interactive. They render once, to **stderr**, and return. The caller decides whether to exit.

| State | Description |
|---|---|
| `rendered` | The block has been printed to stderr |

That's the only state. Errors are immutable moments in the scrollback.

---

## Micro-interactions

| Trigger | Motion | Duration |
|---|---|---|
| Reveal | Block rows fade in top-down, one at a time | `motion.duration.default` |

Reveal animation is disabled when:
- Not a TTY (piped, logged, redirected)
- `CARET_REDUCED_MOTION=1`
- `--quiet` mode (render-once, no animation)

---

## Tokens used

**Color**
- `danger` — `✗` symbol, `error:` keyword, gutter `│`
- `accent` — `hint:` keyword, URL in `see:`
- `fg.default` — title, body, hint text
- `fg.muted` — `see:` keyword

**Symbols**
- `✗` — error marker (required)
- `│` — gutter (appears when block has any sub-rows)

**Spacing**
- 1 blank gutter row between header and body
- 1 blank gutter row between body and hint
- 0 blank rows between consecutive `hint:` and `see:` rows
- 1 trailing blank line after the block

---

## Behavior

### Output destination

`error()` writes to **stderr**, not stdout. Always. This is a hard rule — stdout is for your CLI's data output, stderr is for messages to the user.

### Exit code

By default, `error()` does not exit. It renders and returns. The caller decides.

Pass `exit: true` (defaults to code 1) or `exit: <number>` to exit immediately after render.

```ts
error('Configuration file not found', {
  hint: 'Run `my-cli init` to create one.',
  exit: 1,
})
```

### Narrow terminals

The gutter `│` always renders. The body and hint text wrap, preserving the gutter on each wrapped line:

```
✗ error: Failed to deploy
│
│ The Vercel API returned 401
│ Unauthorized.
```

### Multiple errors

Caret does not collapse or group errors. If you call `error()` three times, three blocks render. If you have a list of failures, either:
- One `error()` call with a multi-line body (preferred for related failures), or
- Three `error()` calls (preferred for independent failures)

Caret will never auto-dedupe or batch errors.

---

## Accessibility

- **`NO_COLOR`**: all colors stripped; `✗`, `error:`, `hint:`, `see:` keywords carry all meaning
- **Reduced motion**: reveal is instant; block renders in one pass
- **Dumb terminal**: `│` degrades to `|`; `✗` degrades to `x` if Unicode is unavailable
- **Screen reader**: the full block is readable as plain text once rendered; keywords (`error:`, `hint:`, `see:`) provide semantic structure
- **Colorblind**: `✗` and the `error:` keyword make the error state unambiguous without color

---

## API

```ts
import { error } from './caret'

// minimum
error('Failed to deploy to production')

// with body
error('Failed to deploy to production', {
  body: 'The Vercel API returned 401 Unauthorized.',
})

// full form
error('Failed to deploy to production', {
  body: 'The Vercel API returned 401 Unauthorized.',
  hint: 'Your API token may have expired. Run `my-cli login` to refresh it.',
  see: 'https://my-cli.dev/docs/auth',
})

// exit after render
error('Configuration file not found', {
  hint: 'Run `my-cli init` to create one.',
  exit: 1,
})
```

```ts
type ErrorOptions = {
  body?: string
  hint?: string
  see?: string
  exit?: boolean | number  // default: false
}
```

---

## Do & don't

**Do**

- Write errors you'd want to read at 3 AM on-call
- Always write a `hint:` unless there is truly nothing the user can do
- Put URLs in `see:`, not inline in the body
- Use lowercase for the `error:` keyword — it's Rust convention and feels calm, not shouty
- Keep the title under ~80 characters; put detail in `body:`

**Don't**

- Don't include stack traces in `body:` — they belong in `--verbose` or a log file
- Don't write "Unknown error" — there is always something more specific
- Don't write "An error occurred" — describe what was being attempted and what failed
- Don't use `error` for warnings or informational messages
- Don't call `error()` and then continue as if nothing happened — if it's not actually an error, don't render one
- Don't customize the `✗` symbol or gutter character — they are the brand

---

## Out of scope

- **Stack traces** — not in `error`. A separate `debug()` or `--verbose` mode can render them.
- **Structured error codes** — free-form title is expected. If your CLI uses codes (like `E001`), include them in the title string; Caret does not enforce a scheme.
- **i18n** — v0 does not translate. Users of Caret write their own strings.
- **Error aggregation / deduping** — not in v0.
- **File / line references** (like Rust's `--> src/main.rs:2:13`) — app-level concern; can be composed into `body:` by the caller.
- **Warning variant** — `warning()` is a separate component for later.
