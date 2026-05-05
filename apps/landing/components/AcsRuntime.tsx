'use client'

import { useEffect } from 'react'

export function AcsRuntime() {
  useEffect(() => {
    import('acs-audio').catch((err) => {
      console.warn('[acs] runtime failed to load', err)
    })
  }, [])

  return null
}
