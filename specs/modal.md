# Modal

> An interactive bordered overlay with a title, body, and action buttons.

`modal` displays a bordered box with one or more action buttons. The user navigates with Left/Right and confirms with Enter. Returns the value of the selected action, or `null` on cancel.

## Anatomy

```
╭─────────────────────────────────────╮
│ Confirm deletion                    │
│                                     │
│ This will permanently delete 47     │
│ files. Are you sure?                │
│                                     │
│ [ Cancel ]   Delete                 │
╰─────────────────────────────────────╯

←→ navigate · ↵ select · esc cancel
```

## Usage

```ts
const action = await modal({
  title: 'Confirm deletion',
  body: 'This will permanently delete 47 files. Are you sure?',
  actions: [
    { label: 'Cancel', value: 'cancel' },
    { label: 'Delete', value: 'delete', danger: true },
  ],
})

if (action === 'delete') { /* ... */ }
```

## Options

```ts
type ModalOptions<T extends string> = {
  title: string
  body?: string
  actions: ReadonlyArray<{
    label: string
    value: T
    danger?: boolean   // render this action in danger color
  }>
  defaultAction?: number  // initial focus index
  theme?: PartialTheme
}
```

## Keyboard

| Key | Effect |
|---|---|
| `←` `→` | Navigate actions |
| `tab` | Next action |
| `↵` | Confirm selected action |
| `esc` | Cancel — returns `null` |

## Do & don't

**Do** — use for confirmations of destructive or hard-to-reverse actions
**Don't** — use for routine "OK?" prompts (use `prompt.confirm`); don't use for collecting input (use `form` or `prompt.*`)

## Out of scope

- Nested modals
- Scrollable body
- Form fields inside the modal (compose with `form` outside)
- Auto-dismiss
