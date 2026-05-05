# Breadcrumb

> Navigation path returned as a string.

`breadcrumb` returns a styled breadcrumb trail with theme-colored separators. Last segment is accent bold, earlier segments are dim.

## Usage

```ts
breadcrumb(['home', 'projects', 'my-app', 'settings'])
// → "home › projects › my-app › settings"

info(breadcrumb(['home', 'my-app']))
```

## Options

```ts
type BreadcrumbOptions = {
  separator?: string  // default: '›'
  theme?: PartialTheme
}
```

## Do & don't

**Do** — use at the top of a command's output to show context
**Don't** — use for URLs (use `link`); don't stack many breadcrumbs

## Out of scope

- Clickable segments (breadcrumbs are plain text)
- Nested color per segment
