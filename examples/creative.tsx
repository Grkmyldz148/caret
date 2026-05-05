/**
 * Caret creative components — demo
 *
 *   pnpm --filter @caret/examples creative
 */

import {
  brailleChart,
  skeleton,
  gradient,
  brailleTransition,
  morph,
  smartTypewriter,
  divider,
} from '@caret/registry/components/index.js'

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

async function main(): Promise<void> {
  // ── 1. Smart Typewriter ──────────────────────────────────
  divider({ label: 'SMART TYPEWRITER' })
  await sleep(300)
  await smartTypewriter('Analyzing your codebase... Found 47 issues. Fixing now.', {
    speed: 'thoughtful',
    cursor: true,
  })
  await sleep(500)

  // ── 2. Braille Transition ────────────────────────────────
  divider({ label: 'BRAILLE TRANSITION' })
  await sleep(300)
  await brailleTransition({
    text: 'DEPLOY COMPLETE',
    direction: 'in',
    duration: 800,
    stagger: 20,
  })
  await sleep(400)
  await brailleTransition({
    text: 'DEPLOY COMPLETE',
    direction: 'out',
    duration: 600,
    stagger: 15,
  })
  await sleep(500)

  // ── 3. Morph ─────────────────────────────────────────────
  divider({ label: 'MORPH' })
  await sleep(300)
  await morph('Processing...', '✓ Complete', { duration: 500 })
  await sleep(300)
  await morph('⠋ Loading', '★ Ready', { duration: 400 })
  await sleep(500)

  // ── 4. Gradient ──────────────────────────────────────────
  divider({ label: 'GRADIENT' })
  await sleep(300)
  console.log(gradient('Fade: Hello World — bold to dim', { mode: 'fade' }))
  console.log(gradient('Reverse Fade: dim to bold', { mode: 'fade', reverse: true }))
  console.log(gradient('Shine: spotlight in the middle', { mode: 'shine', position: 0.5 }))
  console.log(gradient('Edges: bold at both edges', { mode: 'edges' }))
  console.log(gradient('Accent Fade', { mode: 'fade', accent: true }))
  await sleep(500)

  // ── 5. Braille Chart ─────────────────────────────────────
  divider({ label: 'BRAILLE CHART — BAR' })
  await sleep(300)
  brailleChart({
    mode: 'bar',
    values: [3, 7, 2, 8, 5, 9, 1, 6, 4, 7, 3, 8, 5, 2, 9, 6],
    height: 8,
  })
  await sleep(500)

  divider({ label: 'BRAILLE CHART — HEATMAP' })
  await sleep(300)
  // Generate a simple gradient heatmap
  const heatData: number[][] = []
  for (let r = 0; r < 8; r++) {
    const row: number[] = []
    for (let c = 0; c < 20; c++) {
      row.push(Math.sin(r * 0.5) * Math.cos(c * 0.3) * 0.5 + 0.5)
    }
    heatData.push(row)
  }
  brailleChart({ mode: 'heatmap', data: heatData, width: 40 })
  await sleep(500)

  // ── 6. Skeleton ──────────────────────────────────────────
  divider({ label: 'SKELETON LOADER' })
  await sleep(300)
  const result = await skeleton('Loading profile...', async () => {
    await sleep(2500)
    return { name: 'Caret', version: '1.0.0' }
  }, { variant: 'wave', lines: 3, width: 40 })
  console.log(`Loaded: ${result.name} v${result.version}`)
  await sleep(300)

  console.log()
  console.log(gradient('All creative components demo complete.', { mode: 'fade', accent: true }))
}

main().catch(console.error)
