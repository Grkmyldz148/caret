# Snippet

> Code block with an optional copy-to-clipboard affordance.

`snippet` renders code with a language label on the top rule, a gutter, and optional line numbers. Unlike `codeBlock`, snippet is designed for short, copy-ready code samples.

## Anatomy

Single line:

```
─ bash ──────────────────
│ npm install @caret/cli
──────────────
```

Multi-line with line numbers:

```
─ typescript ────────────
1 │ import { spinner } from 'caret'
2 │
3 │ await spinner('Building…',
4 │   () => build())
──────────────
```

## Usage

```ts
snippet({
  code: 'npm install @caret/cli',
  language: 'bash',
})

snippet({
  code: 'const x = 1\nconst y = 2',
  language: 'typescript',
  lineNumbers: true,
  copyToClipboard: true,
})
```

## Options

| Key              | Type        | Default           | Description                  |
|------------------|-------------|-------------------|------------------------------|
| `code`           | `string`    | —                 | Code content                 |
| `language`       | `string?`   | —                 | Language label on top rule   |
| `lineNumbers`    | `boolean?`  | auto              | Show line numbers            |
| `copyToClipboard`| `boolean?`  | `false`           | Copy code to clipboard       |
| `width`          | `number?`   | `min(80, cols)`   | Display width                |

## Differences from codeBlock

| Feature        | `codeBlock`          | `snippet`               |
|----------------|----------------------|-------------------------|
| Language label | No                   | Yes (top rule)          |
| Copy action    | No                   | Optional                |
| Line numbers   | Always               | Auto (multi-line only)  |
| Use case       | Code display         | Copy-ready samples      |

## Out of scope

- Syntax highlighting (terminal color only)
- Editable code (use `prompt.editor`)
- Diff view (use `diff`)
