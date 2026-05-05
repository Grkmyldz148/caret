# editor

> Multi-line text editor prompt with line numbers and a gutter.

## When to use

Use `prompt.editor` when you need multi-line text input — commit messages,
configuration blocks, descriptions, notes, code snippets.

## Anatomy

```
^ E D I T O R   L A B E L
  Optional description text

  1 │ first line of text█
  2 │ second line
  3 │ third line

  ↵ new line  ctrl+d submit  esc cancel
```

## Resolved state

```
^ E D I T O R   L A B E L  3 lines
```

Single-line content shows the text directly:

```
^ E D I T O R   L A B E L  single line value
```

## API

```ts
const message = await prompt.editor({
  label: 'Commit message',
  description: 'Describe your changes',
  placeholder: 'Type here…',
  validate: (v) => v.trim().length === 0 ? 'Message required' : null,
})
```

### Options

| Key           | Type       | Default | Description                              |
|---------------|------------|---------|------------------------------------------|
| `label`       | `string`   | —       | Tracked CAPS heading                     |
| `description` | `string?`  | —       | Dim text below label                     |
| `placeholder` | `string?`  | —       | Shown when editor is empty               |
| `default`     | `string?`  | `''`    | Pre-filled content (may contain `\n`)    |
| `validate`    | `fn?`      | —       | `(value) => errorMsg \| null`            |

## Keyboard

| Key       | Action                                   |
|-----------|------------------------------------------|
| chars     | Insert at cursor                         |
| Enter     | New line                                 |
| ←/→       | Move cursor within line                  |
| ↑/↓       | Move cursor between lines                |
| Backspace | Delete character / merge lines           |
| Ctrl+A    | Jump to start of line                    |
| Ctrl+E    | Jump to end of line                      |
| Ctrl+U    | Clear current line                       |
| Ctrl+D    | Submit content                           |
| Esc       | Cancel → throws `CaretCancelled`         |

## Gutter

Line numbers are right-aligned to the widest number, followed by the
structural gutter character `│`. The current line shows a block cursor.

## Tokens

colors.accent, colors.semantic.danger, symbols.anchor, symbols.prefix,
symbols.structure.gutter, spacing.indent, spacing.sectionBefore
