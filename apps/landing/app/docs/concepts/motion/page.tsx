import type { Metadata } from 'next'
import Link from 'next/link'
import { Callout, CodeBlock, Prose, PropTable } from '@/components/docs/Prose'

export const metadata: Metadata = {
  title: 'Motion — Caret docs',
  description:
    'Caret motion tokens: bounded durations, frame rates, easing, and the rules animation must follow.',
}

export default function MotionPage() {
  return (
    <Prose>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
        Concepts · Motion
      </div>
      <h1>Motion</h1>
      <p>
        Caret motion is bounded, intentional, and gated. Every animation has
        a designed start and a designed end — spinners resolve into
        checkmarks, selections slide, progress pulses, errors reveal. The
        rules below apply to every component that animates.
      </p>

      <h2 id="rules">Hard rules</h2>
      <ol className="list-decimal pl-6 my-4 text-[15px] text-muted leading-relaxed">
        <li>
          <strong>Duration is bounded</strong> — no animation runs longer
          than 300ms unless it's representing actual ongoing work (spinner
          while a deploy runs).
        </li>
        <li>
          <strong>Inline-safe</strong> — animations don't push surrounding
          characters around between frames. If a frame rotates, it's locked
          to a single character cell.
        </li>
        <li>
          <strong>Reduced motion respected</strong> — all animation is
          disabled when <code>prefers-reduced-motion</code> is on, when{' '}
          <code>CARET_REDUCED_MOTION=1</code>, or when stdout is not a TTY.
        </li>
        <li>
          <strong>Token-based</strong> — durations and frame rates come from
          the theme, not magic numbers in components.
        </li>
      </ol>

      <h2 id="duration">Duration tokens</h2>
      <PropTable
        headers={['Token', 'Default (ms)', 'Used by']}
        rows={[
          ['duration.instant', '60', 'Cursor-blink window, sub-frame timing'],
          ['duration.fast', '120', 'Color/border transitions'],
          ['duration.default', '200', 'Spinner morph, prompt resolve, selection slide'],
          ['duration.slow', '300', 'Reveal, modal open, boot step'],
        ]}
      />

      <h2 id="frame-rates">Frame rates</h2>
      <p>
        Stepped animations (spinner, typewriter) tick on a fixed interval.
        Frame rates are also tokens, so an entire CLI's animation feel can
        be tuned in one spot.
      </p>
      <PropTable
        headers={['Token', 'Default (ms)', 'Used by']}
        rows={[
          ['spinnerFrameMs', '80', 'Braille spinner step interval'],
          ['blinkMs', '1050', 'Block cursor blink cycle'],
          ['typewriterMs', '24', 'Character-by-character reveal'],
        ]}
      />

      <h2 id="easing">Easing</h2>
      <p>
        Caret exports an <code>easing</code> namespace with the standard
        curves used internally. Custom components are encouraged to consume
        them rather than inline cubic-bezier strings.
      </p>
      <CodeBlock language="ts">{`import { easing } from '@caret/registry'

easing.linear     // (t) => t
easing.easeOut    // (t) => 1 - Math.pow(1 - t, 3)
easing.easeInOut  // smoothstep`}</CodeBlock>

      <h2 id="frame-loop">frameLoop helper</h2>
      <p>
        For custom timed animation, use <code>frameLoop</code>. It wraps{' '}
        <code>setInterval</code> with reduced-motion gating and a clean
        cancel signature.
      </p>
      <CodeBlock language="ts">{`import { frameLoop } from '@caret/registry'

const cancel = frameLoop(80, (frame) => {
  // 80ms ticks. Returns false to stop, anything else to continue.
})

// Later — bail out
cancel()`}</CodeBlock>

      <Callout kind="info" title="When in doubt, don't animate">
        The manifesto rule: motion has meaning. If a transition isn't
        communicating something — state change, progress, attention — it
        shouldn't exist. Static is fine. Static is the default.
      </Callout>

      <h2 id="reduced-motion">Reduced motion behavior</h2>
      <p>
        When reduced motion is active, components skip the animation but
        keep the semantic transition. Examples:
      </p>
      <PropTable
        headers={['Component', 'Normal', 'Reduced motion']}
        rows={[
          ['spinner', 'Braille rotation, then morph to ✓', 'Static · then ✓'],
          ['typewriter', 'Character-by-character reveal', 'Whole text appears at once'],
          ['reveal', 'Each line fades in sequentially', 'All lines appear at once'],
          ['modal', 'Fade in over 300ms', 'Appears immediately'],
          ['progress', 'Percent animates from current to new', 'Percent jumps directly'],
        ]}
      />

      <p>
        Capability detection — including reduced-motion sources — is
        documented at{' '}
        <Link href="/docs/concepts/capability">Capability detection</Link>.
      </p>
    </Prose>
  )
}
