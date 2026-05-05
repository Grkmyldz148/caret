/**
 * Mirror of registry/components/badge.ts and kbd.ts
 *
 *   [beta]         <- bold, colored
 *   [Ctrl]+[K]     <- dim brackets, accent bold key
 */
export type BadgeColor =
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'muted'

const colorMap: Record<BadgeColor, string> = {
  accent: 'text-accent',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  info: 'text-info',
  muted: 'text-muted',
}

export function Badge({
  children,
  color = 'accent',
}: {
  children: string
  color?: BadgeColor
}) {
  if (color === 'muted') {
    return <span className="dim">[{children}]</span>
  }
  return (
    <span className={`${colorMap[color]} font-medium`}>[{children}]</span>
  )
}

export function Kbd({ keys }: { keys: string | ReadonlyArray<string> }) {
  if (typeof keys === 'string') {
    return (
      <span>
        <span className="dim">[</span>
        <span className="text-accent font-medium">{keys}</span>
        <span className="dim">]</span>
      </span>
    )
  }
  return (
    <span>
      {keys.map((k, i) => (
        <span key={i}>
          {i > 0 && <span className="dim">+</span>}
          <span className="dim">[</span>
          <span className="text-accent font-medium">{k}</span>
          <span className="dim">]</span>
        </span>
      ))}
    </span>
  )
}
