# Slider

> Interactive numeric range input with ←/→ adjustment.

`slider` shows a horizontal track with a draggable head. Left/Right adjusts by step, Ctrl+B/F for big jumps. Enter confirms, Esc cancels.

## Anatomy

```
^ Volume  ━━━━━━━━━━╸──────────  50

←→ adjust · ctrl+b/f big jump · ↵ confirm · esc cancel
```

After submit:

```
^ Volume: 50
```

## Usage

```ts
const volume = await slider({
  label: 'Volume',
  min: 0,
  max: 100,
  step: 5,
  defaultValue: 50,
})
```

## Options

| Key            | Type       | Default | Description            |
|----------------|------------|---------|------------------------|
| `label`        | `string`   | —       | Slider label           |
| `min`          | `number?`  | `0`     | Minimum value          |
| `max`          | `number?`  | `100`   | Maximum value          |
| `step`         | `number?`  | `1`     | Increment per press    |
| `defaultValue` | `number?`  | `min`   | Initial value          |
| `width`        | `number?`  | `20`    | Track width in chars   |
| `showValue`    | `boolean?` | `true`  | Show numeric readout   |

## Keyboard

| Key       | Action                    |
|-----------|---------------------------|
| `←`       | Decrease by step          |
| `→`       | Increase by step          |
| `Ctrl+B`  | Decrease by step × 10    |
| `Ctrl+F`  | Increase by step × 10    |
| `↵`       | Confirm                   |
| `esc`     | Cancel → `null`           |

## Tokens

colors.accent, symbols.progress (filled, empty, head)

## Out of scope

- Dual-range (min/max) slider
- Vertical slider
- Logarithmic scale
