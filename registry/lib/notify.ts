/**
 * Caret system notifications
 *
 * Sends OS native notifications via platform commands. Never uses
 * terminal bell. Silently fails if the platform has no notification
 * API or if CARET_NO_NOTIFY is set.
 *
 * Implements Caret principle 11: "Notifications, not beeps."
 *
 *   await notifyDone('Deployment complete', 'my-app.vercel.app is live')
 */

import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { capability } from './capability.js'

const execAsync = promisify(exec)

export type NotifyKind = 'done' | 'error' | 'waiting'

export type NotifyOptions = {
  /** Notification body — secondary text shown below the title. */
  body?: string
  /** App name shown in the notification. Default: 'Caret' */
  appName?: string
  /**
   * macOS sound name. Set to `false` to suppress sound.
   * Default: 'Glass' for waiting, 'Hero' for done, 'Basso' for error.
   */
  sound?: string | false
}

export async function notifyDone(message: string, options: NotifyOptions = {}): Promise<void> {
  return notify('done', message, options)
}

export async function notifyError(message: string, options: NotifyOptions = {}): Promise<void> {
  return notify('error', message, options)
}

/**
 * Notify the user that Caret is waiting for input. Use when an
 * interactive prompt opens — if the terminal is in the background
 * the OS notification draws attention back.
 */
export async function notifyWaiting(message: string, options: NotifyOptions = {}): Promise<void> {
  return notify('waiting', message, options)
}

/** Default macOS sound per notification kind. */
const DEFAULT_SOUNDS: Record<NotifyKind, string> = {
  done: 'Hero',
  error: 'Basso',
  waiting: 'Glass',
}

async function notify(kind: NotifyKind, message: string, options: NotifyOptions): Promise<void> {
  const cap = capability()
  if (cap.noNotify) return

  const title = options.appName ?? 'Caret'

  try {
    if (process.platform === 'darwin') {
      // 1. Play sound via afplay — no permissions needed, always works.
      if (options.sound !== false) {
        const soundName = options.sound ?? DEFAULT_SOUNDS[kind]
        const soundPath = `/System/Library/Sounds/${soundName}.aiff`
        // Fire-and-forget — don't block on sound playback.
        execAsync(`afplay "${soundPath}"`).catch(() => {})
      }

      // 2. Try osascript banner notification — best-effort, may be
      //    blocked by macOS notification permissions.
      const fullText = options.body ? `${message}\n${options.body}` : message
      const safeText = escapeForOsascript(fullText)
      const safeTitle = escapeForOsascript(title)
      await execAsync(
        `osascript -e 'display notification "${safeText}" with title "${safeTitle}"'`,
      ).catch(() => {})
      return
    }

    if (process.platform === 'linux') {
      const safeMessage = escapeForShell(message)
      const safeTitle = escapeForShell(title)
      const args = options.body
        ? `"${safeTitle}" "${safeMessage}\n${escapeForShell(options.body)}"`
        : `"${safeTitle}" "${safeMessage}"`
      await execAsync(`notify-send ${args}`)
      return
    }

    if (process.platform === 'win32') {
      // PowerShell balloon tip — basic and dependency-free.
      const safeMessage = escapeForPowerShell(message)
      const safeTitle = escapeForPowerShell(title)
      const script = [
        `Add-Type -AssemblyName System.Windows.Forms`,
        `$notify = New-Object System.Windows.Forms.NotifyIcon`,
        `$notify.Icon = [System.Drawing.SystemIcons]::Information`,
        `$notify.Visible = $true`,
        `$notify.ShowBalloonTip(3000, '${safeTitle}', '${safeMessage}', 'Info')`,
      ].join('; ')
      await execAsync(`powershell -Command "${script}"`)
      return
    }
    // Other platforms: silent fallback. Never ring the bell.
  } catch {
    // Silent fallback. Notification is best-effort.
  }
}

function escapeForOsascript(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

function escapeForShell(text: string): string {
  return text.replace(/"/g, '\\"').replace(/`/g, '\\`').replace(/\$/g, '\\$')
}

function escapeForPowerShell(text: string): string {
  return text.replace(/'/g, "''")
}
