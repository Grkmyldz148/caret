# File Picker

> Interactive file and directory browser.

`filePicker` presents the file system as a navigable list. Directories are sorted first, files second. Enter opens a directory or selects a file, Backspace goes to the parent directory. Returns the absolute path or `null` on cancel.

## Anatomy

```
~/projects/acme-cli

▸ src/
· package.json
· tsconfig.json
· README.md

↑↓ navigate · ↵ select/enter · backspace up · esc cancel
```

## Usage

```ts
const file = await filePicker({
  cwd: process.cwd(),
  filter: (name, isDir) => isDir || name.endsWith('.ts'),
})

if (file) {
  console.log('Selected:', file)
}
```

## Options

| Key                 | Type                                   | Default     | Description                    |
|---------------------|----------------------------------------|-------------|--------------------------------|
| `cwd`               | `string?`                              | `cwd()`     | Starting directory             |
| `filter`            | `(name, isDir) => boolean`             | —           | Filter entries                 |
| `showHidden`        | `boolean?`                             | `false`     | Show dotfiles                  |
| `limit`             | `number?`                              | `15`        | Max visible items              |
| `selectDirectories` | `boolean?`                             | `false`     | Allow selecting directories    |

## Keyboard

| Key         | Action                       |
|-------------|------------------------------|
| `↑`         | Previous entry               |
| `↓`         | Next entry                   |
| `↵`         | Enter directory / select file |
| `backspace` | Go to parent directory       |
| `esc`       | Cancel → `null`              |

## Do & don't

**Do** — use for selecting files interactively (config paths, output dirs)
**Don't** — use for displaying directory trees (use `tree`); don't use in non-TTY

## Out of scope

- Multi-select files
- File preview
- Inline rename/delete
- Remote file systems
