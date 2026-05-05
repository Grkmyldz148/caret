# Prompt

> The most common point of interaction in a transactional CLI. Sets the tone for everything else.

Prompt collects input from the user during a command's execution. A prompt appears, the user answers, the prompt resolves into a single line in the scrollback, and the command continues. It is not a form, not a modal, not a TUI — it is a brief, disciplined moment of conversation.

---

## Variants

| Variant | Purpose |
|---|---|
| `text` | Single-line text input |
| `password` | Masked text input |
| `confirm` | Boolean yes/no |
| `select` | Single choice from a list |
| `multiSelect` | Multiple choices from a list |
| `number` | Numeric input with optional bounds |

All variants share the same anatomy, the same micro-interactions, and the same accessibility guarantees.

---

## Anatomy

Every prompt, regardless of variant, is anchored by `^` — the Caret brand mark. The anchor tells the user "this is a Caret moment" and marks where the prompt begins in the scrollback.

### `text` variant

```
^ Project name
  What should we call your project?
  ▸ my-project█
  ⚠ Must be lowercase letters and dashes
```

1. **Anchor** (`^`) — Caret brand mark, `accent` color, single character, always present
2. **Label** — bold, `fg.default`, required
3. **Description** — `fg.muted`, optional, wraps on narrow terminals
4. **Input row** — `▸` prefix (`accent` when focused, `fg.muted` when idle) + user's text + cursor
5. **Hint row** — `fg.muted` for hints, `danger` with `⚠` for errors, single line

### `select` variant

```
^ Framework
  Choose your frontend framework

  ● Next.js
  ○ Remix
  ○ SvelteKit
  ○ Astro

  ↑↓ navigate   ↵ select   esc cancel
```

- `●` marks the highlighted option (`accent`)
- `○` marks the other options (`fg.muted`)
- Footer row shows keyboard hints in `fg.subtle`, auto-hidden on narrow terminals

### `confirm` variant

```
^ Deploy to production?
  This will push to my-app.vercel.app

  ● Yes    ○ No

  ←→ toggle   ↵ confirm   esc cancel
```

### `password` variant

```
^ API token
  Paste your personal access token
  ▸ •••••••••••••••█
```

Mask character is `•` by default (configurable, but discouraged).

### Resolved state

After submit, every variant collapses to a single line:

```
^ Project name: my-project
```

The label is `fg.muted`, the value is `fg.default`. Cancelled prompts resolve to:

```
^ Project name: —
```

(dim, italic `—` in `fg.subtle`)

---

## States

| State | Description |
|---|---|
| `idle` | Initial render, cursor visible, prefix in `accent` |
| `typing` | User is entering input, cursor tracks position |
| `validating` | Async validation running, inline dim spinner after input |
| `error` | Validation failed, `⚠` line visible, prefix in `danger` |
| `submitting` | Enter pressed, validation passed, brief accent pulse |
| `submitted` | Resolved to single-line summary in scrollback |
| `cancelled` | ESC pressed, resolved to `—` placeholder |
| `disabled` | Non-interactive mode (pipe, CI), auto-fails with guidance |

---

## Micro-interactions

Every transition is bounded, inline-safe, and auto-disabled outside a live TTY or when `CARET_REDUCED_MOTION=1`.

| Trigger | Motion | Duration token |
|---|---|---|
| Mount (focus) | `▸` prefix fades from `fg.muted` → `accent` | `motion.duration.quick` |
| Typing | Cursor moves, no other animation | — |
| Select nav (↑/↓) | Highlighted `●` marker fades dim → accent on the new row | `motion.duration.instant` |
| Confirm toggle (←/→) | `●` swaps sides, color crossfade on both options | `motion.duration.quick` |
| Submit | Input row flashes `accent`, resolves to scrollback line | `motion.duration.default` |
| Error reveal | `⚠` line fades in below input | `motion.duration.quick` |
| Cancel | Prompt collapses to `—` in dim italic | `motion.duration.quick` |
| Validating (async) | Inline spinner appears after input, resolves with morph | `motion.duration.default` |

Reduced-motion fallback: all transitions become instant. The end state is always the same.

---

## Tokens used

**Color**
- `fg.default` — label, input value, resolved value
- `fg.muted` — description, hint text, idle prefix, label in resolved state
- `fg.subtle` — keyboard hint footer, cancelled `—`
- `accent` — `^` anchor, focused `▸` prefix, `●` selected marker, submit flash
- `danger` — `⚠` symbol, error text, error-state prefix
- `success` — brief submit pulse on success (optional, subtle)

**Motion**
- `motion.duration.instant` · `motion.duration.quick` · `motion.duration.default`
- `motion.easing.standard`

**Symbols**
- `^` — anchor, required at the top of every prompt
- `▸` — focused input prefix
- `·` — unfocused prefix (used only in multi-prompt forms; not in v0)
- `●` / `○` — selected / unselected marker for `select` and `confirm`
- `⚠` — error marker
- `—` — cancelled placeholder

**Spacing**
- 0 lines between anchor and label
- 1 line between label and description
- 1 line between description and input
- 1 line between input and hint/error
- 0 lines after resolved state (it is a single line)

---

## Behavior

### Keyboard

| Key | Effect |
|---|---|
| `↵` | Submit (runs validation first) |
| `esc` | Cancel (returns `null` or throws `CaretCancelled` per config) |
| `ctrl+c` | Hard exit; SIGINT passed through, never swallowed |
| `↑` / `↓` | Navigate in `select`/`multiSelect`; noop in `text` |
| `←` / `→` | Toggle in `confirm`; cursor move in `text`/`password`/`number` |
| `space` | Toggle in `multiSelect`; insert space in `text` |
| `tab` | Next option in `select`/`multiSelect`; ignored in `text` by default |
| `backspace` | Delete character in text inputs |
| `ctrl+u` | Clear line in text inputs |
| `ctrl+a` / `ctrl+e` | Start / end of line in text inputs |

Caret owns the keyboard layer. Key bindings are not user-configurable — consistency across every Caret CLI is the point.

### Validation

- **Sync**: `validate: (value) => string | null` — return an error message string, or `null` for valid
- **Async**: `validate: async (value) => string | null` — shows inline spinner during the async call
- Validation runs on submit by default; use `validateOn: 'change'` for live validation
- Validation errors are rendered in the `error` state (hint row becomes red with `⚠`)

### Submit

- Validation passes → `submitting` state → pulse → resolved single-line
- Validation fails → `error` state; cursor stays in the input; user can edit and retry

### Cancel

- `esc` triggers cancel
- Default: `cancel: 'throw'` — throws `CaretCancelled` so callers can handle the flow explicitly
- Alternative: `cancel: 'null'` — returns `null`; useful when the prompt is part of an optional path

### Non-interactive environments

When stdin is not a TTY (piped, CI, scripted):

- If a `default` is provided → Caret uses it silently and emits the resolved line as usual
- If no `default` → Caret fails with a clear error pointing at the missing flag or env var
- Caret never hangs waiting for input that will never come

---

## Accessibility

- **`NO_COLOR`**: every color is stripped; symbols (`^`, `▸`, `●`, `○`, `⚠`, `—`) carry all meaning
- **Reduced motion**: all micro-interactions become instant; final states render immediately
- **Narrow terminal (< 40 cols)**: description wraps, footer hint hides, input truncates with horizontal scroll
- **Dumb terminal**: renders as plain `Label: [user input]` with no cursor positioning
- **Screen reader**: each prompt announces label + current state via stderr metadata where supported; at minimum the final resolved line is readable as plain text
- **Colorblind**: the `●` / `○` / `⚠` / `—` symbols distinguish all states without color

---

## API

```ts
import { prompt } from './caret'

// text
const name = await prompt.text({
  label: 'Project name',
  description: 'What should we call your project?',
  placeholder: 'my-project',
  default: 'my-project',
  validate: (v) =>
    /^[a-z][a-z0-9-]*$/.test(v) ? null : 'Lowercase letters, numbers, and dashes only',
})

// password
const token = await prompt.password({
  label: 'API token',
  description: 'Paste your personal access token',
})

// confirm
const ok = await prompt.confirm({
  label: 'Deploy to production?',
  description: 'This will push to my-app.vercel.app',
  default: false,
})

// select
const framework = await prompt.select({
  label: 'Framework',
  description: 'Choose your frontend framework',
  options: [
    { value: 'next',   label: 'Next.js' },
    { value: 'remix',  label: 'Remix' },
    { value: 'svelte', label: 'SvelteKit' },
    { value: 'astro',  label: 'Astro' },
  ],
  default: 'next',
})

// multiSelect
const features = await prompt.multiSelect({
  label: 'Features',
  options: [
    { value: 'auth',  label: 'Authentication' },
    { value: 'db',    label: 'Database' },
    { value: 'email', label: 'Email' },
  ],
  min: 1,
})

// number
const port = await prompt.number({
  label: 'Port',
  min: 1024,
  max: 65535,
  default: 3000,
})
```

All variants share these common options:

```ts
type PromptCommon = {
  label: string
  description?: string
  cancel?: 'throw' | 'null'   // default: 'throw'
}
```

---

## Do & don't

**Do**

- Use `description` only when the label is ambiguous on its own
- Provide `default` for prompts that have a sensible common answer
- Use `validate` for format rules (regex, length, range)
- Pair a prompt with `spinner` when the resolved value triggers a long operation

**Don't**

- Don't stack 10 prompts back-to-back — if you need a form, wait for the `form` component
- Don't use `prompt.text` for dangerous confirmations — use `prompt.confirm` with `default: false`
- Don't use `validate` for network calls or availability checks — they're slow and block the input
- Don't write ANSI codes in `label` or `description` — Caret owns this layer
- Don't customize the anchor, prefix, or marker symbols — they are the brand

---

## Out of scope (for v0)

- **Multi-field forms on one screen** — separate `form` component, later
- **Autocomplete from a remote list** — will become `commandPalette`, later
- **Rich markdown in description** — label and description are plain text only
- **Custom key bindings** — Caret owns the keyboard
- **Persistent prompt history** (readline-style ↑ recall) — not in v0
- **Masked input with custom mask character that breaks on Unicode** — `•` or nothing
