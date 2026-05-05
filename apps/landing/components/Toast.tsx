'use client'

import { useEffect, useRef, useState } from 'react'

type ToastEvent = CustomEvent<string>

/**
 * Singleton toast host — bottom-center, animated.
 *
 * Mounted once at the body level (see app/layout.tsx). Listens for a
 * global `caret:toast` CustomEvent whose `detail` is the message
 * string. The most recent event wins; in-flight messages are replaced.
 *
 * Animation is CSS-only: 220ms slide-up + fade-in on enter, 180ms
 * slide-down + fade-out on leave. Honours prefers-reduced-motion via
 * the .toast keyframes scoped in globals.css.
 */
export function ToastHost() {
  const [message, setMessage] = useState<string | null>(null)
  const [leaving, setLeaving] = useState(false)
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const removeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onToast = (e: Event) => {
      const detail = (e as ToastEvent).detail
      if (typeof detail !== 'string' || detail.length === 0) return

      // Cancel any in-flight dismiss / remove timers — newest wins.
      if (dismissTimer.current) clearTimeout(dismissTimer.current)
      if (removeTimer.current) clearTimeout(removeTimer.current)

      setLeaving(false)
      setMessage(detail)

      // Linger ≈ 1.4s, then play the leave animation, then unmount.
      dismissTimer.current = setTimeout(() => {
        setLeaving(true)
        removeTimer.current = setTimeout(() => {
          setMessage(null)
          setLeaving(false)
        }, 180)
      }, 1400)
    }

    window.addEventListener('caret:toast', onToast as EventListener)
    return () => {
      window.removeEventListener('caret:toast', onToast as EventListener)
      if (dismissTimer.current) clearTimeout(dismissTimer.current)
      if (removeTimer.current) clearTimeout(removeTimer.current)
    }
  }, [])

  if (message === null) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
    >
      <div
        className={[
          'pointer-events-auto flex items-center gap-2.5 px-4 py-2.5',
          'bg-surface border border-hairline-strong rounded-full shadow-lg',
          'text-sm text-fg font-medium',
          leaving ? 'caret-toast-leave' : 'caret-toast-enter',
        ].join(' ')}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-success"
          aria-hidden
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  )
}
