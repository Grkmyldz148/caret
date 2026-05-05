import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import { AcsRuntime } from '@/components/AcsRuntime'
import { ToastHost } from '@/components/Toast'
import './globals.css'

/**
 * Inline script that runs synchronously in <head> to set
 * data-theme on <html> BEFORE the body paints. Without this the page
 * paints in dark first, then snaps to light on hydration — visible
 * flash. Reads localStorage('caret-theme') first, then falls back to
 * the OS prefers-color-scheme media query.
 */
const THEME_INIT = `
(function () {
  try {
    var s = localStorage.getItem('caret-theme');
    var t = (s === 'light' || s === 'dark')
      ? s
      : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {}
})();
`

// We expose next/font under distinct variable names so they can
// never collide with Tailwind's `--font-sans` / `--font-mono` tokens
// defined in globals.css. globals.css references these via var(),
// which guarantees the *actually loaded* family is used and avoids
// silent fallback to system mono (which misaligns box-drawing chars).
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter-loaded',
  weight: ['300', '400', '500'],
  display: 'swap',
})

// JetBrains Mono is loaded from a LOCAL woff2 that includes the full
// glyph set — not from next/font/google. Google Fonts subsets the file
// into `latin`, `latin-ext`, `cyrillic`, etc. and NONE of those subsets
// include box-drawing (U+2500-257F), block-element (U+2580-259F), or
// braille (U+2800-28FF) characters. When a Caret preview mixes those
// glyphs with letters (e.g. `├─ landing`), the browser renders the
// letters in JetBrains Mono but falls back to SF Mono / Menlo for the
// box-drawing glyphs — whose character cells are a different width at
// 13px, which makes the `│ ├ └ ─` columns drift out of the grid by a
// pixel or two per row. Self-hosting the full font solves this — one
// family, one cell width, rows stay on the grid.
const mono = localFont({
  src: [
    {
      path: '../public/fonts/JetBrainsMono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/JetBrainsMono-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-mono-loaded',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Caret — The design system for modern command-line tools',
  description:
    'Caret is to terminals what shadcn/ui is to the web. Copy-paste components, a token system, and a spec — so your CLI ships looking like Vercel or Linear built it.',
  metadataBase: new URL('https://caretcli.com'),
  icons: {
    icon: [{ url: '/logo-mark.svg', type: 'image/svg+xml' }],
    shortcut: '/logo-mark.svg',
  },
  openGraph: {
    title: 'Caret — The design system for modern command-line tools',
    description:
      'Copy-paste components and a token system for beautiful CLIs.',
    url: 'https://caretcli.com',
    siteName: 'Caret',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="audiostyle" href="/caret.acs" />
        <script
          dangerouslySetInnerHTML={{ __html: THEME_INIT }}
          suppressHydrationWarning
        />
      </head>
      <body className="bg-canvas text-fg font-sans antialiased">
        {children}
        <ToastHost />
        <AcsRuntime />
      </body>
    </html>
  )
}
