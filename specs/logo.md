# Logo

> Render a multi-line ASCII art logo, in accent color or terminal default.

`logo` accepts three input modes: a pre-rendered string, an `{ art }` object, or a `{ text }` object that's converted via figlet. Static — writes once and returns.

## Usage

```ts
logo('  ___\n / __|\n| |__\n \\___|')   // string
logo({ art: '...' })                      // explicit
logo({ text: 'caret' })                   // figlet, default font: ANSI Shadow
logo({ text: 'caret', font: 'Big' })
logo({ text: 'caret', color: 'default' }) // terminal fg, no accent
```

## Options

```ts
type LogoOptions =
  | { art: string;  color?: 'accent' | 'default'; theme?: PartialTheme }
  | { text: string; font?: string; color?: 'accent' | 'default'; theme?: PartialTheme }
```

## Behavior

- Logos that already contain ANSI (from `imageToArt`) preserve their colors
- Logos without ANSI get accent color applied unless `color: 'default'`

## Do & don't

**Do** — use as the visual centerpiece of `splash`, or alone in `--help`.
**Don't** — use multiple logos per command; don't customize accent at runtime if you want brand consistency (use `setTheme` instead).

## Out of scope

- Image-to-art conversion — use `imageToArt()` separately and pass the result
- Color gradients across the logo — single accent color only
- Animated logo reveal — use `splash` for that
