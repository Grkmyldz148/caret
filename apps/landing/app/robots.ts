import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

/**
 * Build-time robots.txt — emitted by Next at /robots.txt during
 * static export. Permissive: there is no private content on the
 * landing site and we want every search engine and LLM crawler to
 * have full access.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://caretcli.com/sitemap.xml',
    host: 'https://caretcli.com',
  }
}
