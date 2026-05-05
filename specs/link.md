# Link

> An OSC 8 clickable hyperlink. Returns a string for inline composition.

`link` produces a terminal hyperlink — modern terminals (iTerm2, Wezterm, Kitty, Windows Terminal, GNOME Terminal) render it as clickable underlined text. Older or pipe-redirected terminals get the plain label.

## Usage

```ts
link('https://caret.dev')                       // url + label both = url
link('https://caret.dev', 'caret.dev')          // url + custom label
link({ url: 'https://caret.dev', text: 'docs' })

// Compose inline:
console.log(`Read the ${link('https://caret.dev/docs', 'docs')}`)

// Inside other components:
keyValue({ rows: [
  { key: 'Docs', value: link('https://caret.dev', 'caret.dev') },
]})
```

## Options

```ts
type LinkInput =
  | string
  | { url: string; text?: string; theme?: PartialTheme }
```

## Behavior

- Pipe-redirected (non-TTY) → returns plain text (no escape codes)
- Dumb terminal → returns plain text
- Modern TTY → returns OSC 8 escape sequence with accent color underline

## Do & don't

**Do** — use for any URL Caret renders; compose inline.
**Don't** — use as the only signal (some terminals don't render OSC 8); always use the URL itself or a meaningful label so plain-text fallback is readable.

## Out of scope

- Click tracking
- Tel:, mailto:, and other schemes — passed through as-is
- Affiliate / redirect URLs — caller's job
