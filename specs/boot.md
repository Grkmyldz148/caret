# Boot

> A systemd-style sequential loader. Real async tasks per step.

`boot` renders all steps at once, marks the active one, runs its task, transitions to done/failed, then advances. The whole sequence stays visible in scrollback at the end.

## Anatomy

```
[  OK  ] Loading configuration
[  OK  ] Connecting to API
[  ..  ] Authenticating user
[      ] Fetching workspace state
[      ] Warming local caches
```

After completion:

```
[  OK  ] Loading configuration
[  OK  ] Connecting to API
[  OK  ] Authenticating user
[  OK  ] Fetching workspace state
[  OK  ] Warming local caches
```

On failure:

```
[  OK  ] Loading configuration
[ FAIL ] Connecting to API
[ SKIP ] Authenticating user
[ SKIP ] Fetching workspace state
```

## Usage

```ts
await boot({
  steps: [
    { label: 'Loading configuration', task: () => loadConfig() },
    { label: 'Connecting to API',     task: () => connect() },
    { label: 'Warming caches',        task: () => warmCaches() },
  ],
})
```

## Options

```ts
type BootOptions = {
  steps: ReadonlyArray<{
    label: string
    task: () => void | Promise<void>
  }>
  stopOnError?: boolean   // default: true
  theme?: PartialTheme
}
```

## Statuses

| Status | Badge | Meaning |
|---|---|---|
| `pending` | `[      ]` | Not started |
| `active` | `[  ..  ]` | Currently running (animated dots) |
| `done` | `[  OK  ]` | Completed successfully |
| `failed` | `[ FAIL ]` | Threw an error |
| `skipped` | `[ SKIP ]` | Not run (because a previous step failed and stopOnError) |

## Behavior

- `stopOnError: true` (default) — first failure marks remaining as skipped, then throws
- `stopOnError: false` — runs all steps even after failures, throws the first error at the end
- Active step has an animated dot indicator
- Reduced motion → no dot animation, badges still update

## Do & don't

**Do** — use for multi-phase startup with named tasks; reach for `spinner` instead when you have ONE long-running task with sub-phases.
**Don't** — use for tasks that interact with the user (boot is non-interactive); don't use for unbounded numbers of steps (~3-8 is the sweet spot).

## Out of scope

- Per-step elapsed time
- Parallel step execution
- Per-step output / logs (caller writes those before/after)
- Resume from a specific step
