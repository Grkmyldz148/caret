import type { MetadataRoute } from 'next'
import { CATALOG } from '@/lib/component-catalog'
import { loadSpecs } from '@/lib/spec-data'

export const dynamic = 'force-static'

/**
 * Build-time sitemap.xml — Next emits it at /sitemap.xml. Pulls the
 * spec slugs from disk via `loadSpecs()` so new specs are picked up
 * automatically. Static doc pages are listed by hand because the
 * docs folder mixes server pages and shared components — a directory
 * scan would surface false positives.
 */

const SITE = 'https://caretcli.com'

const STATIC_PATHS = [
  '/',
  '/components',
  '/spec',
  '/docs',
  '/docs/install',
  '/docs/first-cli',
  '/docs/how-it-works',
  '/docs/concepts/principles',
  '/docs/concepts/theme',
  '/docs/concepts/tokens',
  '/docs/concepts/symbols',
  '/docs/concepts/motion',
  '/docs/concepts/capability',
  '/docs/cli',
  '/docs/cli/init',
  '/docs/cli/add',
  '/docs/cli/list',
  '/docs/authoring/custom-theme',
  '/docs/authoring/porting',
  '/docs/authoring/ai-native',
  '/docs/reference/faq',
  '/docs/reference/troubleshooting',
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: `${SITE}${p}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: p === '/' ? 1.0 : 0.7,
  }))

  const specEntries: MetadataRoute.Sitemap = loadSpecs().map((s) => ({
    url: `${SITE}/spec/${s.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Component catalog uses anchor links on a single page, but each
  // anchor is worth a sitemap entry — search engines follow them.
  const componentAnchors: MetadataRoute.Sitemap = CATALOG.map((c) => ({
    url: `${SITE}/components#${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  return [...staticEntries, ...specEntries, ...componentAnchors]
}
