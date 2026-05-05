# Typewriter

> Animates text appearing character by character.

`typewriter` is for dramatic one-liners — version banners, slogans, "starting up" messages. Returns a Promise that resolves when the text is fully shown.

## Usage

```ts
await typewriter('Welcome to my CLI')
await typewriter({ text: 'Loading…', speed: 60 })
```

## Options

```ts
type TypewriterOptions = {
  text: string
  speed?: number   // ms per character, default 40
  theme?: PartialTheme
}
```

## Behavior

- Renders characters one at a time, ~`speed` ms apart
- Reduced motion or non-TTY → instant, all characters at once
- Promise resolves shortly after the last character

## Do & don't

**Do** — use for one or two dramatic moments per command, max
**Don't** — use for normal output (slow); don't typewriter long paragraphs (use `paragraph`); don't use multiple in a row without spacing

## Out of scope

- Per-character color cycling
- Variable per-character speed
- Reveal characters in random order (it's a typewriter, not a magic trick)
