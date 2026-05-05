# Spinner

> Not every wait is interesting. But every wait is visible, and every wait resolves into success or failure. A good spinner makes waiting feel like progress.

Spinner shows that something is happening in the background during a long-running operation. It is the single most common visual element in a modern CLI — and the most inconsistently implemented. Caret's spinner is boring on purpose: one pattern, one tempo, one success state, one failure state.

---

## When to use

- Any operation that takes longer than ~200ms and blocks the user
- Wrap sync or async work; Caret's spinner shows while the work runs
- Pair with `prompt` when the resolved value triggers a wait

Don't use a spinner for sub-200ms operations — it will flash and confuse the user.

---

## Anatomy

Spinning:

```
⠋ Deploying to production
```

Resolved (success):

```
✓ Deployed to production · 3.4s
```

Resolved (failure):

```
✗ Deploy failed · 3.4s
```

Cancelled (SIGINT):

```
— cancelled · 1.2s
```

1. **Spinner frame** — Braille rotation (`⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏`) in `accent`, 10 frames, 80ms per frame
2. **Label** — `fg.default`, required, can be updated mid-run
3. **Suffix** — optional, `fg.muted`, default is the elapsed time (`· 3.4s`)
4. **Resolve symbol** — `✓` (`success`), `✗` (`danger`), `—` (`fg.subtle`) on finalize

---

## Variants

One. Just like `error`, the spinner is a single disciplined pattern. No fast/slow/fancy modes.

---

## States

| State | Description |
|---|---|
| `idle` | Not yet started |
| `spinning` | Active; frame advancing every 80ms |
| `success` | Resolved as `✓` with final label |
| `failure` | Resolved as `✗` with final label |
| `cancelled` | Resolved as `—` (user sent SIGINT during spin) |

---

## Micro-interactions

| Trigger | Motion | Duration |
|---|---|---|
| Frame cycle | Braille rotation through 10 frames | `80ms/frame`, continuous |
| Label update | Crossfade from old label to new label | `motion.duration.quick` |
| Success resolve | Last frame morphs → `✓`, brief `accent` pulse | `motion.duration.default` |
| Failure resolve | Last frame morphs → `✗`, brief `danger` pulse | `motion.duration.default` |
| Suffix reveal | `· 3.4s` fades in after resolve | `motion.duration.quick` |

The 80ms frame tempo is fixed. It does not scale with motion tokens — this is the rotation rhythm, not a micro-interaction.

Auto-disabled when non-TTY, `CARET_REDUCED_MOTION=1`, or narrow terminal:
- No rotation. Label prints once on start.
- Resolve prints the final `✓` / `✗` / `—` line in place.
- Elapsed time still logged in the suffix.

---

## Tokens used

**Color**
- `accent` — spinner frames, success resolve, success pulse
- `success` — success pulse accent (optional, subtle)
- `danger` — failure `✗`, failure pulse
- `fg.default` — label
- `fg.muted` — suffix (elapsed time)
- `fg.subtle` — cancelled `—`

**Motion**
- Frame rhythm: 80ms (fixed)
- Resolve pulse: `motion.duration.default`
- Label crossfade: `motion.duration.quick`

**Symbols**
- `⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏` — Braille rotation set
- `✓` — success
- `✗` — failure
- `—` — cancelled

---

## Behavior

### Function wrapping (preferred form)

```ts
await spinner('Deploying', async () => {
  await deploy()
})
```

The spinner starts before the wrapped function runs and stops after it resolves or throws. On success, the label becomes `✓ Deploying · <elapsed>`. On throw, it becomes `✗ Deploying · <elapsed>` and the error propagates.

### Label updates mid-flight

```ts
await spinner('Preparing', async (s) => {
  await prepare()
  s.update('Uploading')
  await upload()
  s.update('Finalizing')
  await finalize()
})
```

Each `s.update()` crossfades the label. Elapsed time keeps ticking from the original start.

### Explicit success / failure labels

```ts
await spinner('Deploying', deployFn, {
  onSuccess: 'Deployed to production',
  onFailure: 'Deploy failed',
})
```

Without these options, the resolve line keeps the current label and only the symbol changes.

### `notifyOnComplete` — system notification

```ts
await spinner('Deploying', deployFn, {
  notifyOnComplete: true,
})
```

- Default threshold: **10 seconds**. Below this, no notification fires.
- Uses OS native notification via `caret.notify`. Never the terminal bell.
- Suppressed when `CARET_NO_NOTIFY=1` or the OS is in Do Not Disturb.
- Silent fallback if the platform has no notification API.

Custom threshold:

```ts
await spinner('Migrating database', migrateFn, {
  notifyOnComplete: { threshold: 30_000 },
})
```

### SIGINT / cancellation

If the user hits `ctrl+c` while spinning:
- The spinner resolves to `— cancelled · <elapsed>`
- SIGINT propagates (never swallowed)
- The wrapped async function is not given cancellation by default

For true cancellation, request an `AbortSignal`:

```ts
await spinner('Deploying', async ({ signal }) => {
  await deploy({ signal })
})
```

The signal aborts on SIGINT. Your wrapped function is responsible for honoring it.

### Non-TTY behavior

- Prints label once on start (no frame rotation)
- Prints the resolved line on end
- Elapsed time still logged
- No cursor manipulation — output is tee-safe, grep-safe, log-safe

### Manual control (rarely needed)

```ts
const s = spinner.start('Deploying')
try {
  await deploy()
  s.success('Deployed')
} catch (e) {
  s.fail('Deploy failed')
  throw e
}
```

Prefer the function-wrapping form. Manual control exists for cases where the async boundary doesn't map cleanly.

---

## Accessibility

- **`NO_COLOR`**: frames still cycle (they're geometric); label and resolve symbols carry all state
- **Reduced motion**: no rotation, no morph, no pulse — label prints once, resolves with the final symbol
- **Narrow terminal**: label truncates with ellipsis; suffix hides on very narrow widths
- **Dumb terminal**: no Braille; falls back to `| / - \` rotation or a plain `...` indicator
- **Screen reader**: start and resolve are announced as ARIA-like `busy` → `ready` transitions via stderr metadata

---

## API

```ts
import { spinner } from './caret'

// wrap an async function (preferred)
const result = await spinner('Deploying', async () => {
  return await deploy()
})

// with label updates
await spinner('Preparing', async (s) => {
  await prepare()
  s.update('Uploading')
  await upload()
})

// with explicit success / failure labels
await spinner('Deploying', deployFn, {
  onSuccess: 'Deployed',
  onFailure: 'Deploy failed',
})

// with system notification on completion
await spinner('Migrating database', migrate, {
  notifyOnComplete: true,
})

// with AbortSignal for cancellation
await spinner('Fetching', async ({ signal }) => {
  return await fetch(url, { signal })
})

// manual control
const s = spinner.start('Deploying')
try {
  await deploy()
  s.success('Deployed')
} catch (e) {
  s.fail('Deploy failed')
  throw e
}
```

```ts
type SpinnerOptions = {
  onSuccess?: string
  onFailure?: string
  notifyOnComplete?: boolean | { threshold?: number }  // default threshold: 10_000ms
  suffixTime?: boolean                                  // default: true
}
```

---

## Do & don't

**Do**

- Prefer the function-wrapping form — it handles success, failure, elapsed time, and cancellation for you
- Use `s.update()` when the work has distinct phases the user cares about
- Use `notifyOnComplete` for anything that might run longer than a minute
- Prefer one spinner with label updates over three spinners in sequence

**Don't**

- Don't use a spinner for sub-200ms operations — they flash
- Don't use a spinner as a progress bar — if you have a percentage, use `progress` (later)
- Don't write your own `\r` + animation logic — Caret owns the render layer
- Don't update the label every frame; crossfade once per phase, not every tick
- Don't use spinner for background work the user didn't ask for — spinners imply "I'm waiting for this"
- Don't customize the Braille set, the tempo, or the resolve symbols — they are the brand

---

## Out of scope

- **Percentage progress** — use `progress` component (later)
- **Nested spinners** — v0 supports one active spinner at a time
- **Custom frame sets** — Caret owns the Braille rotation
- **Tempo customization** — 80ms per frame, fixed
- **Inline spinner inside another component** — that's handled by the host component (e.g. Prompt's inline validation spinner)
- **Spinner groups / task lists** — `step` component handles multi-phase flows, later
