# Virtualized List

> Windowed scrollable list for large datasets.

`virtualizedList` renders only the visible items in a viewport window, enabling smooth navigation through thousands of items without lag. Optional inline search filtering.

## Anatomy

```
▸ api-gateway      running · us-east-1
· auth-service     running · us-east-1    ▎
· billing-svc      failed · eu-west-1     ▎
· cache-layer      running · ap-south-1
· data-worker      stopped

↑↓ navigate  ctrl+u/d page  ↵ select  esc cancel  1248 items
```

With search enabled:

```
▸ bill  3/1248

▸ billing-svc      failed
· billing-api      running
· bill-worker      stopped

↑↓ navigate  ↵ select  esc cancel  3 items
```

## Usage

```ts
const item = await virtualizedList({
  items: services.map(s => ({
    value: s.id,
    label: s.name,
    description: `${s.status} · ${s.region}`,
  })),
  height: 20,
  searchable: true,
})
```

## Options

| Key          | Type                           | Default      | Description                    |
|--------------|--------------------------------|--------------|--------------------------------|
| `items`      | `VirtualizedItem[]`            | —            | `{ value, label, description? }` |
| `height`     | `number?`                      | `rows − 4`   | Visible item count             |
| `searchable` | `boolean?`                     | `false`      | Enable inline filter           |
| `filter`     | `(query, item) => boolean`     | fuzzy match  | Custom filter function         |

## Keyboard

| Key       | Action                |
|-----------|-----------------------|
| `↑`       | Previous item         |
| `↓`       | Next item             |
| `Ctrl+U`  | Half page up          |
| `Ctrl+D`  | Half page down        |
| `↵`       | Select item           |
| `esc`     | Cancel → `null`       |
| chars     | Filter (when searchable) |

## Differences from search

| Feature         | `search`         | `virtualizedList`      |
|-----------------|------------------|------------------------|
| Rendering       | All filtered     | Windowed viewport      |
| Scrollbar       | No               | Yes                    |
| Ideal for       | < 100 items      | 100+ items             |
| Search          | Always           | Optional               |

## Out of scope

- Multi-select
- Grouping/sections
- Variable height items
- Infinite scroll / lazy loading
