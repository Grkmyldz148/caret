# Toggle

> An interactive boolean on/off switch.

`toggle` shows a labeled switch with ● on / ○ off states. Space toggles the value, Enter confirms, Esc cancels. Returns `boolean | null`.

## Anatomy

```
^ Enable dark mode  ● on

space toggle · ↵ confirm · esc cancel
```

When off:

```
^ Enable dark mode  ○ off
```

After submit:

```
^ Enable dark mode: on
```

## Usage

```ts
const darkMode = await toggle({
  label: 'Enable dark mode',
  defaultValue: false,
})

if (darkMode === true) { /* ... */ }
```

## Options

| Key            | Type        | Default   | Description                  |
|----------------|-------------|-----------|------------------------------|
| `label`        | `string`    | —         | Toggle label                 |
| `defaultValue` | `boolean?`  | `false`   | Initial state                |
| `onLabel`      | `string?`   | `'on'`    | Label for on state           |
| `offLabel`     | `string?`   | `'off'`   | Label for off state          |

## Keyboard

| Key     | Action              |
|---------|---------------------|
| `space` | Toggle value        |
| `←` `→` | Toggle value       |
| `↵`     | Confirm             |
| `esc`   | Cancel → `null`     |

## Do & don't

**Do** — use for boolean settings inside interactive flows
**Don't** — use for yes/no questions (use `prompt.confirm`); don't use in static output

## Out of scope

- Tri-state (on/off/indeterminate)
- Groups of toggles (compose yourself or use `form`)
