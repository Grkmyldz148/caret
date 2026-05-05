# Table

> Typed columns and rows. The structured data display.

`table` renders rows of objects through typed column definitions. Each column has a header and an accessor function that extracts a value from each row. Caret computes column widths automatically and aligns the output.

---

## Anatomy

Borderless (default):

```
NAME          STATUS    REGION     UPTIME  CPU %
web-frontend  running   us-east-1  3d 4h      12
api-server    running   us-east-1  3d 4h      38
worker-queue  starting  eu-west-1  32s         4
billing-svc   failed    us-east-1  0s          0
```

With borders:

```
╭──────────────┬──────────┬───────────┬────────┬───────╮
│ NAME         │ STATUS   │ REGION    │ UPTIME │ CPU % │
├──────────────┼──────────┼───────────┼────────┼───────┤
│ web-frontend │ running  │ us-east-1 │ 3d 4h  │    12 │
│ api-server   │ running  │ us-east-1 │ 3d 4h  │    38 │
│ worker-queue │ starting │ eu-west-1 │ 32s    │     4 │
│ billing-svc  │ failed   │ us-east-1 │ 0s     │     0 │
╰──────────────┴──────────┴───────────┴────────┴───────╯
```

Headers are accent + bold. Body rows use the terminal default foreground.

---

## Options

```ts
type TableOptions<T> = {
  columns: ReadonlyArray<{
    header: string
    accessor: (row: T) => string | number | boolean
    align?: 'left' | 'right' | 'center'
    width?: number       // auto-fit if omitted
    truncate?: boolean   // ellipsize content > width
  }>
  rows: ReadonlyArray<T>
  showHeader?: boolean   // default: true
  borders?: boolean      // default: false
  gap?: number           // default: 2 (borderless gap)
  theme?: PartialTheme
}
```

---

## Do & don't

**Do**
- Use for tabular data with consistent columns (deploys, processes, files, users)
- Right-align numeric columns (`align: 'right'`)
- Use `truncate: true` for columns that may have long content
- Provide a typed `T` for the row shape — accessors get type safety

**Don't**
- Don't use a table for two columns of label/value — use `keyValue`
- Don't use `borders: true` in piped output — borders look bad in logs
- Don't render thousands of rows at once — paginate yourself
- Don't put rich/multiline content in cells — cells are single-line

---

## Out of scope

- Sortable / filterable — caller pre-sorts
- Pagination — caller slices
- Cell wrapping (multi-line cells) — single line only
- Footer / totals row — caller composes a second mini-table
- Sticky headers in scrolling output — terminal can't do that
