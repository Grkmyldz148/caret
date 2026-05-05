import type { NextConfig } from 'next'

/**
 * Static export — Caret landing has no API routes, no Server Actions,
 * no ISR, no middleware. Every page is a build-time HTML render, so
 * the whole site ships as a folder of `.html` + `.js` to Cloudflare
 * Pages without an adapter layer.
 *
 * `trailingSlash: true` produces `/docs/index.html` instead of
 * `/docs.html`, the URL shape Cloudflare Pages serves cleanly under
 * both `/docs` and `/docs/`.
 *
 * `images.unoptimized` because static export can't run the optimizer
 * at request time.
 */
const config: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // typedRoutes is disabled for static export — Next 15.1 hits a
  // PageNotFoundError on some App Router pages when both flags are
  // on at once. Re-enable when next/output:'export' + typedRoutes
  // ship together cleanly.
}

export default config
