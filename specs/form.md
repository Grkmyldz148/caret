# Form

> Multi-field input layout — multiple prompts in one frame.

`form` renders several input fields at once and lets the user navigate between them with Tab / Shift+Tab. Submit with Ctrl+Enter (or Enter on the last field) returns an object keyed by field name.

## Anatomy

```
^ Create project

  ▸ Project name
    my-app█

  · Environment
    ● Production
    ○ Staging

  · Enable authentication
    ● Yes    ○ No

  tab/shift+tab navigate · ctrl+↵ submit · esc cancel
```

## Usage

```ts
const result = await form({
  title: 'Create project',
  fields: [
    { name: 'name', label: 'Project name', type: 'text',
      validate: (v) => v ? null : 'Required' },
    { name: 'env',  label: 'Environment',  type: 'select',
      options: [
        { value: 'prod',    label: 'Production' },
        { value: 'staging', label: 'Staging' },
      ],
    },
    { name: 'auth', label: 'Enable auth', type: 'confirm', default: true },
  ],
})
// → { name: 'my-app', env: 'prod', auth: true }
```

## Options

```ts
type FormOptions = {
  title?: string
  description?: string
  fields: ReadonlyArray<FormField>
  theme?: PartialTheme
}

type FormField = {
  name: string
  label: string
  type: 'text' | 'password' | 'confirm' | 'select'
  description?: string
  default?: string | boolean
  options?: ReadonlyArray<{ value: string; label: string }>
  validate?: (value: string | boolean) => string | null
}
```

## Keyboard

| Key | Effect |
|---|---|
| `tab` / `shift+tab` | Next / previous field |
| `↵` | Move to next field, or submit if on last field |
| `ctrl+↵` | Submit from any field |
| `esc` | Cancel — throws `CaretCancelled` |
| `←` `→` | Toggle confirm fields |
| `↑` `↓` | Navigate select options |
| `space` | Toggle confirm fields |
| Type / backspace | Edit text/password fields |

## Validation

Each field can have a `validate` function. On submit, all validators run; if any fail, errors render under their fields and submit is blocked.

## Do & don't

**Do** — use for ≤ ~6 related fields (project setup, login, configuration)
**Don't** — use for single-field input (just use `prompt.text`); don't put more than ~6 fields (the screen gets crowded — split into multiple steps)

## Out of scope

- Async per-field validation (sync only in v0)
- Conditional fields (`if X then show Y`)
- File picker / autocomplete fields
- Tabular input (multi-row forms)
