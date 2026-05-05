/**
 * Caret utility namespace
 *
 * A single object that bundles Caret's non-component utilities under one
 * import. Use it for theme management and notifications.
 *
 *   import { caret } from '@caret/registry'
 *
 *   caret.theme.set({
 *     colors: { accent: { default: '#FF6B35' } }
 *   })
 *
 *   await caret.notify.done('Build complete')
 */

import { setTheme, getTheme, resetTheme } from './theme/global.js'
import { notifyDone, notifyError } from './lib/notify.js'

export const caret = {
  theme: {
    set: setTheme,
    get: getTheme,
    reset: resetTheme,
  },
  notify: {
    done: notifyDone,
    error: notifyError,
  },
} as const
