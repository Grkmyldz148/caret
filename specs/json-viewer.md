# JSON Viewer

> Syntax-highlighted formatted JSON display.

`jsonViewer` pretty-prints any JSON-serializable value with color-coded types: keys in accent, strings plain, numbers bold, booleans semantic (green/red), null dim.

## Anatomy

```
{
  "name": "caret",
  "version": 1,
  "private": true,
  "tags": [
    "cli",
    "ui"
  ]
}
```

## Usage

```ts
jsonViewer({
  data: {
    name: 'caret',
    version: 1,
    private: true,
    tags: ['cli', 'ui'],
  },
})

// Also works with arrays, primitives, nested objects
jsonViewer({ data: [1, 2, 3] })
jsonViewer({ data: 'hello' })
```

## Options

| Key              | Type       | Default | Description                         |
|------------------|------------|---------|-------------------------------------|
| `data`           | `unknown`  | —       | Any JSON-serializable value         |
| `indent`         | `number?`  | `2`     | Indentation width per level         |
| `maxDepth`       | `number?`  | `10`    | Collapse to inline beyond this      |
| `maxStringLength`| `number?`  | `80`    | Truncate long strings               |

## Color mapping

| Type      | Style                    |
|-----------|--------------------------|
| Key       | Accent                   |
| String    | Default                  |
| Number    | Bold                     |
| Boolean   | Success (true) / Danger (false) |
| Null      | Dim                      |
| Empty     | Dim (`{}`, `[]`)         |
| Overflow  | Dim (`{…3 keys}`)        |

## Do & don't

**Do** — use for debugging, API response display, config inspection
**Don't** — use for structured data display (use `keyValue` or `table`)

## Out of scope

- Interactive collapse/expand (static output only)
- JSON editing
- JSON diffing (use `diff`)
- Syntax highlighting for non-JSON
