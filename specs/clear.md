# Clear

> Clears the terminal screen.

`clear` writes the ANSI escape sequence to clear the screen and move the cursor to the top-left. Use sparingly — clearing erases context the user may need.

## Usage

```ts
clear()
```

## Behavior

- TTY → clears the screen and homes the cursor
- Non-TTY (pipe, redirect, dumb terminal) → no-op (never prints raw escape codes to a pipe)

## Do & don't

**Do** — use before a `splash` if you want a fully clean intro
**Don't** — use repeatedly during a flow (annoying); don't use to "hide errors" (still in scrollback if user scrolls)

## Out of scope

- Partial screen clear (lines / region)
- Cursor positioning helpers
