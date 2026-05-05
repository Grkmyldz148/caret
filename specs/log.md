# log

> Streaming log output with timestamps and severity levels.

## When to use

Use `log` for real-time diagnostic output — build logs, server events,
deploy progress, task runners. Use `message` (info/success/warning) for
single announcements; use `log` for streams.

## Anatomy

```
14:32:01.234 INF Server started on port 3000
14:32:01.891 INF [db] Connection established
14:32:02.100 WRN [auth] Token expires in 5 minutes
14:32:02.450 ERR [api] Connection refused: billing-svc:443
14:32:02.451 DBG Retry scheduled in 2s
```

## API

```ts
log({ message: 'Server started on port 3000' })
log({ message: 'Token expires in 5m', level: 'warn', source: 'auth' })
log({ message: 'Connection refused', level: 'error', source: 'api' })
log({ message: 'Retry in 2s', level: 'debug' })

log.batch({
  entries: [
    { message: 'Compiling…', level: 'info' },
    { message: 'Bundle: 142kb', level: 'info' },
    { message: 'Unused export', level: 'warn', source: 'lint' },
  ],
})
```

### Options

| Key             | Type        | Default  | Description                         |
|-----------------|-------------|----------|-------------------------------------|
| `message`       | `string`    | —        | Log message text                    |
| `level`         | `LogLevel?` | `'info'` | `debug \| info \| warn \| error`   |
| `timestamp`     | `string?`   | now      | ISO timestamp — auto-generated      |
| `source`        | `string?`   | —        | Optional `[source]` tag             |
| `showTimestamp`  | `boolean?` | `true`   | Show/hide timestamp column          |

## Output streams

| Level   | Stream | Color                       |
|---------|--------|-----------------------------|
| `debug` | stdout | dim                         |
| `info`  | stdout | accent                      |
| `warn`  | stderr | semantic.warning (yellow)   |
| `error` | stderr | semantic.danger (red)       |

## Level tags

Level is shown as a 3-character uppercase tag: `DBG`, `INF`, `WRN`, `ERR`.

## Tokens

colors.accent, colors.semantic.warning, colors.semantic.danger
