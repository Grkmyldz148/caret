/**
 * Spec data loader — reads specs/ markdown files at build time.
 *
 * Server-only: uses fs.readFileSync. Safe in Next.js server components
 * and getStaticProps since it runs at build time only.
 */

import fs from 'node:fs'
import path from 'node:path'

export type SpecKind = 'interactive' | 'display' | 'utility' | 'other'

export type SpecSection = {
  heading: string
  content: string
}

export type SpecEntry = {
  slug: string
  title: string
  description: string
  kind: SpecKind
  sections: SpecSection[]
  raw: string
}

const SPECS_DIR = path.resolve(process.cwd(), '../../specs')
const REGISTRY_PATH = path.resolve(process.cwd(), '../../registry/registry.json')

type RegistryManifest = {
  components: Record<string, { kind?: string }>
}

/** Build a slug → kind map from registry.json. */
function loadKindMap(): Map<string, SpecKind> {
  const map = new Map<string, SpecKind>()
  if (!fs.existsSync(REGISTRY_PATH)) return map
  try {
    const manifest = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8')) as RegistryManifest
    for (const [name, comp] of Object.entries(manifest.components)) {
      const kind = comp.kind
      const slugCandidates = [name, name.replace(/([A-Z])/g, '-$1').toLowerCase()]
      for (const s of slugCandidates) {
        if (kind === 'interactive' || kind === 'display' || kind === 'utility') {
          map.set(s, kind)
        }
      }
    }
  } catch {
    // ignore malformed registry — falls back to 'other'
  }
  return map
}

function parseSpec(raw: string): { title: string; description: string; sections: SpecSection[] } {
  const lines = raw.split('\n')
  let title = ''
  let description = ''
  const sections: SpecSection[] = []
  let currentHeading = ''
  let currentContent: string[] = []
  let foundTitle = false
  let foundDesc = false

  for (const line of lines) {
    // Title: first # heading
    if (!foundTitle && /^# /.test(line)) {
      title = line.replace(/^# /, '').trim()
      foundTitle = true
      continue
    }

    // Description: first > blockquote after title
    if (foundTitle && !foundDesc && /^> /.test(line)) {
      description = line.replace(/^> /, '').trim()
      foundDesc = true
      continue
    }

    // Section headings (## ...)
    if (/^## /.test(line)) {
      // Save previous section
      if (currentHeading) {
        sections.push({ heading: currentHeading, content: currentContent.join('\n').trim() })
      }
      currentHeading = line.replace(/^## /, '').trim()
      currentContent = []
      continue
    }

    if (currentHeading) {
      currentContent.push(line)
    }
  }

  // Save last section
  if (currentHeading) {
    sections.push({ heading: currentHeading, content: currentContent.join('\n').trim() })
  }

  return { title, description, sections }
}

export function loadSpecs(): SpecEntry[] {
  if (!fs.existsSync(SPECS_DIR)) return []

  const kindMap = loadKindMap()
  const files = fs.readdirSync(SPECS_DIR)
    .filter((f) => f.endsWith('.md') && f !== 'look.md')
    .sort()

  return files.map((file) => {
    const slug = file.replace(/\.md$/, '')
    const raw = fs.readFileSync(path.join(SPECS_DIR, file), 'utf-8')
    const { title, description, sections } = parseSpec(raw)
    const kind: SpecKind = kindMap.get(slug) ?? 'other'
    return { slug, title, description, kind, sections, raw }
  })
}

export function loadSpec(slug: string): SpecEntry | null {
  const file = path.join(SPECS_DIR, `${slug}.md`)
  if (!fs.existsSync(file)) return null
  const raw = fs.readFileSync(file, 'utf-8')
  const { title, description, sections } = parseSpec(raw)
  const kind: SpecKind = loadKindMap().get(slug) ?? 'other'
  return { slug, title, description, kind, sections, raw }
}

/** Group specs into ordered (label, items[]) buckets. */
export function groupSpecsByKind(
  specs: SpecEntry[],
): Array<{ kind: SpecKind; label: string; items: SpecEntry[] }> {
  const ORDER: SpecKind[] = ['interactive', 'display', 'utility', 'other']
  const LABEL: Record<SpecKind, string> = {
    interactive: 'Interactive',
    display: 'Display',
    utility: 'Utility',
    other: 'Reference',
  }
  const buckets = new Map<SpecKind, SpecEntry[]>()
  for (const k of ORDER) buckets.set(k, [])
  for (const s of specs) {
    buckets.get(s.kind)!.push(s)
  }
  return ORDER
    .map((kind) => ({ kind, label: LABEL[kind], items: buckets.get(kind)! }))
    .filter((b) => b.items.length > 0)
}
