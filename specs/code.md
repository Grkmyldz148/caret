# Code (inline)

> Inline code formatting. Returns a string for composition.

`code` returns a string with inline code styling — typically a subtle background or distinct foreground that distinguishes it from surrounding text.

## Usage

```ts
code('npm install caret')

info(`Run ${code('caret init')} to scaffold a new project`)
```

## Options

```ts
type CodeOptions = {
  theme?: PartialTheme
}
```

## Do & don't

**Do** — use any time your output references a command, file path, or identifier
**Don't** — use for multi-line code (use `codeBlock`)

## Out of scope

- Multi-line code (use `codeBlock`)
- Syntax highlighting
- Copy-to-clipboard helpers
