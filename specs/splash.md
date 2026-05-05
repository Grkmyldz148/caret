# Splash

> The opening moment of your CLI. A logo, a title, and a subtitle, with phased reveal.

`splash` renders a logo (optional), a title, and a subtitle (optional) with timed appearance. Use it once at the start of an interactive session, before the first prompt, or as part of `--version` output.

## Anatomy

```
   ___                _
  / __\__ _ _ __ ___| |_
 / /  / _` | '__/ _ \ __|
/ /__| (_| | | |  __/ |_
\____/\__,_|_|  \___|\__|

Caret
The design system for modern command-line tools
```

## Options

```ts
type SplashOptions = {
  logo?: string | { text: string; font?: string }
  title: string
  subtitle?: string
  duration?: 'instant' | 'fast' | 'normal' | 'slow'  // default: 'normal'
  hold?: number  // override post-reveal hold ms
  theme?: PartialTheme
}
```

The `logo` field accepts:
- A pre-rendered ASCII string
- An object `{ text, font }` — Caret converts via figlet at runtime

## Behavior

- Logo with embedded ANSI (e.g. from `imageToArt`) is preserved as-is
- Logo without ANSI gets accent color applied
- Reduced motion / non-TTY → instant render, no phased reveal
- After all elements appear, splash holds for `hold` ms then unmounts

## Duration profiles

| Profile | Logo | Title | Subtitle | Hold | Total |
|---|---|---|---|---|---|
| `instant` | 0 | 0 | 0 | 0 | 0 |
| `fast` | 150 | 100 | 100 | 400 | 750ms |
| `normal` | 300 | 200 | 200 | 800 | 1500ms |
| `slow` | 500 | 350 | 350 | 1500 | 2700ms |

## Do & don't

**Do** — use exactly once at the start of a session; use `instant` for `--version` and `normal` for interactive flows.
**Don't** — use multiple splashes in a single command; don't use for routine output (banner is for that).

## Out of scope

- Audio / sound — never (Caret principle 11)
- Per-character animation of the title — use `typewriter` standalone
- Non-rectangular logos — `logo` renders whatever string you give it
