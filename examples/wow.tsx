/**
 * Caret wow — showcase of all creative/visual components
 *
 *   pnpm --filter @caret/examples wow
 */

import {
  divider,
  gauge,
  radar,
  waveform,
  flamegraph,
  qrcode,
  dashboard,
  countdown,
  confetti,
  fireworks,
  celebrate,
  matrix,
  particles,
  gameOfLife,
} from '@caret/registry/components/index.js'

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

async function main(): Promise<void> {
  // ── Data Visualization ────────────────────────────────────
  divider({ label: 'GAUGE' })
  gauge({ value: 0.75, label: 'CPU Usage' })
  await sleep(400)

  divider({ label: 'RADAR' })
  radar({
    axes: ['Speed', 'Power', 'Range', 'Defense', 'Magic'],
    values: [0.8, 0.6, 0.9, 0.4, 0.7],
  })
  await sleep(400)

  divider({ label: 'WAVEFORM' })
  const wave: number[] = []
  for (let i = 0; i < 40; i++) {
    wave.push(Math.sin(i * 0.4) * Math.exp(-i * 0.02))
  }
  waveform({ values: wave, height: 8 })
  await sleep(400)

  divider({ label: 'FLAMEGRAPH' })
  flamegraph({
    stacks: [
      { label: 'main', value: 1.0 },
      { label: 'handleRequest', value: 0.85 },
      { label: 'parseJSON', value: 0.5 },
      { label: 'validate', value: 0.3 },
      { label: 'transform', value: 0.15 },
    ],
  })
  await sleep(400)

  // ── Utility ───────────────────────────────────────────────
  divider({ label: 'QR CODE' })
  qrcode({ data: 'https://caret.dev', label: 'caret.dev' })
  await sleep(400)

  divider({ label: 'COUNTDOWN' })
  await countdown({ seconds: 3, label: 'Launching in' })
  await sleep(300)

  // ── Visual Effects ────────────────────────────────────────
  divider({ label: 'PARTICLES' })
  await particles({ text: 'READY', duration: 1800 })
  await sleep(300)

  divider({ label: 'MATRIX RAIN' })
  await matrix({ duration: 2500, width: 60, height: 10, density: 15 })
  await sleep(300)

  divider({ label: 'GAME OF LIFE' })
  await gameOfLife({ duration: 3000, width: 40, height: 8 })
  await sleep(300)

  // ── Celebration ───────────────────────────────────────────
  divider({ label: 'CONFETTI' })
  await confetti({ duration: 1500 })
  await sleep(300)

  divider({ label: 'FIREWORKS' })
  await fireworks({ bursts: 2, duration: 2500 })
  await sleep(300)

  divider({ label: 'CELEBRATE' })
  await celebrate('ALL TESTS PASSED', { duration: 1500, sound: false })
}

main().catch(console.error)
