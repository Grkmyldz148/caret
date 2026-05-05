/**
 * Caret brand mark — a chevron caret over a baseline, evoking an
 * insertion cursor in a text editor. Pairs with the wordmark
 * "caret" in the Nav, but is also usable on its own (favicon,
 * OG square, Footer mark, social avatars).
 *
 * Stroke uses `currentColor` so it inherits the parent's text color
 * — wrap in `text-accent` for the brand blue, `text-fg` for plain.
 */

type Props = {
  size?: number
  className?: string
  'aria-label'?: string
}

export function CaretMark({ size = 24, className, ...rest }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role="img"
      aria-label={rest['aria-label'] ?? 'Caret'}
      className={className}
    >
      <path
        d="M14 32 L32 14 L50 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinejoin="miter"
        strokeMiterlimit="3"
        strokeLinecap="square"
      />
      <path
        d="M14 50 L50 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="square"
      />
    </svg>
  )
}
