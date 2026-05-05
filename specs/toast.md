# Toast

> A brief inline notification that auto-dismisses after a timeout.

`toast` renders a one-line semantic message that disappears after a duration. Useful for transient feedback (saved, copied, refreshed) that doesn't need to stay in scrollback.

## Usage

```ts
await toast.info('Loading…')
await toast.success('Saved')
await toast.warning('Disconnected')
await toast.error('Failed')

// Custom duration:
await toast.success('Deployed', { duration: 3000 })
```

Each call awaits internally — useful for sequencing multiple toasts. To dispatch fire-and-forget, don't `await`.

## Output

```
ℹ info: Loading…
✓ success: Saved
⚠ warning: Disconnected
✗ error: Failed
```

## Options

```ts
type ToastOptions = {
  duration?: number   // ms, default 2000
  theme?: PartialTheme
}

const toast = {
  info:    (message: string, options?: ToastOptions) => Promise<void>,
  success: (message: string, options?: ToastOptions) => Promise<void>,
  warning: (message: string, options?: ToastOptions) => Promise<void>,
  error:   (message: string, options?: ToastOptions) => Promise<void>,
}
```

## Behavior

- Renders on stdout, then unmounts after `duration` ms
- Reduced motion / non-TTY → renders briefly then unmounts (no fade)
- Does NOT leave a permanent line in scrollback (the unmount removes it)

## Do & don't

**Do** — use for transient feedback that the user only needs to see momentarily
**Don't** — use for messages the user should be able to scroll back to (use `info`/`success`/`warning`/`error` instead); don't stack toasts (one at a time)

## Out of scope

- Multi-line toasts
- Stacked / queued toasts
- Action buttons inside toast
- Hover-to-pause (terminals can't do hover)
