# The Caret Look

> The authoritative design manifesto. Every component, token, and decision references this document. If code disagrees with this file, the code is wrong.

---

## Vision — in one sentence

**Caret is editorial modernism for the command line: calm typography, a single confident accent, generous whitespace, and zero decoration that doesn't earn its place.**

A Caret CLI should feel the way a well-designed long-form reading surface feels — like Notion, Stripe docs, or a quiet magazine page — only rendered in monospace.

## The look in one breath

Dark-terminal-first. Neutral grayscale body (from your terminal's own foreground, via ANSI attributes), one truecolor accent for the brand, ANSI-named semantic colors for states. Titles are **letter-spaced CAPS** (`C A R E T`, `D E P L O Y I N G`). Data is aligned by **dotted leaders** (`region ·········· us-east-1`). Sections breathe — two blank lines before, one after the title. Borders are rare and thin; most structure comes from space, not chrome. Motion is sub-perceptual and bounded.

The reader should think *"quiet premium"*, not *"flashy"* and not *"brutal"*.

---

## Golden rules (inviolable)

These four rules override every other decision. If a component needs to break one, the component is wrong.

### 1. Never set the background.

Caret writes on the user's terminal background — whatever color they chose. No `bgBlack`, no `bgHex`, no "dark card". The user is in charge of their environment. We are guests.

### 2. Foreground hierarchy uses ANSI attributes, never RGB.

Body text is rendered with `dim`, `bold`, `italic`, and combinations — never hex grays. This guarantees the hierarchy survives *any* terminal theme: light, dark, solarized, gruvbox, dracula, anything. If the user's body is cream on parchment, our "muted" is still dim cream, not a dark gray that would look like garbage on their beige background.

**The only colors that are ever RGB:**
- The brand accent (Caret's signature — fixed truecolor)
- Semantic states (truecolor fallback for non-ANSI terminals; default emission is still ANSI-named)

Everything else — titles, body, muted, subtle, disabled — is an attribute stack on top of the terminal's own foreground.

### 3. Symbols carry meaning without color.

A CLI that pipes to a non-color sink must still be legible. Every semantic state has a distinguishing glyph: `✓ ✗ ⚠ ℹ —`. Color is a reinforcement, never the sole signal. If you strip all color from a Caret CLI and it becomes ambiguous, the component is wrong.

### 4. Motion is bounded and respectful.

- Hard cap: 300ms for any micro-interaction.
- Spinner frame: 80ms (fixed — the standard cli-spinners braille rhythm).
- Auto-disable in these cases: not a TTY, `NO_COLOR`, `CARET_REDUCED_MOTION=1`, terminal width < 40 columns, stdout is piped.
- No particle effects. No confetti. No bouncing. If the motion isn't helping the user read faster, delete it.

---

## Palette — Helmlab-authored

All brand colors are authored in [Helmlab GenSpace](https://helmlab.space), a perceptually-uniform OKLCH color tool. Hex values in `registry/tokens/colors.ts` are the sRGB round-trip of Helmlab outputs and **must be regenerated from Helmlab inputs, never hand-tweaked**. If you want a different color, change the Helmlab input (hue, chroma, lightness), re-export, paste.

### Brand accent — the one RGB color you're allowed to love

The accent is Caret's signature. It is **one color, one truecolor hex, one meaning: "this is brand".** It appears in: the caret anchor `^`, focused prompt prefixes, list bullets, selected radio markers, active spinners, progress bar fill, the `?` prompt marker, callout borders, quote borders, inline code highlights.

**Helmlab input:** `{ hue: 250, chroma: 0.20 }`

**Three stops (lightness ladder):**

| Role | Lightness | sRGB hex | Use |
|---|---|---|---|
| `accent.default` | L 0.66 | `#5882F7` | Anchor, focused prefix, selected markers, active states |
| `accent.muted` | L 0.48 | `#3A5FB8` | De-emphasized brand moments — inactive tabs, past events |
| `accent.emphasized` | L 0.76 | `#7B9DFF` | Focus pulse, hover bloom, success flash |

Three stops, no more. You do not need a 50–900 scale. This is a CLI, not Tailwind.

### Alternative accent hues — decision-frozen but documented

Görkem considered and rejected these — keep the list for future re-evaluation:

| Hue | Chroma | Character | Why rejected (for now) |
|---|---|---|---|
| 295 (purple) | 0.22 | design-forward, Linear-ish | Too "premium SaaS", competes with Linear's voice |
| 200 (cyan) | 0.15 | fresh, tool-like | Too common in dev tools, not distinctive |
| 270 (indigo) | 0.20 | calmer than blue | Close to default but less confident |
| 150 (green) | 0.18 | terminal-native | Cliché — the Matrix look, too predictable |
| 25 (amber) | 0.21 | retro, warm | Reserved for hybrid-A voice; rejected with A |

### Semantic colors — ANSI-named first, truecolor as fallback

Semantic states emit ANSI 16 named colors by default. This means: `chalk.green`, not `chalk.hex('#3FBF6F')`. The effect: on the user's terminal theme, "success" is *their* green, harmonizing with their scrollback, their prompt, their IDE. This is a feature, not a limitation.

Truecolor values are documented only for non-ANSI fallback contexts (sixel snapshots, website renders of the CLI).

| State | ANSI | Helmlab input | Truecolor fallback |
|---|---|---|---|
| `success` | `green` | `{ hue: 155, chroma: 0.16 }` | `#3FBF6F` |
| `warning` | `yellow` | `{ hue: 85, chroma: 0.17 }` | `#E5A823` |
| `danger` | `red` | `{ hue: 25, chroma: 0.21 }` | `#E5482D` |
| `info` | `blue` | `{ hue: 235, chroma: 0.12 }` | `#5A9CD8` |

Each state also pairs with a symbol (`✓ ⚠ ✗ ℹ`) so color-blind users and piped output remain legible.

### Foreground hierarchy — attribute-based, not palette-based

Never write a hex code for body text. Use these attribute stacks:

| Role | Attributes | Visual effect |
|---|---|---|
| `fg.default` | (none) | Terminal's own foreground — titles, values |
| `fg.muted` | `dim` | Secondary text, labels, captions |
| `fg.subtle` | `dim + italic` | Tertiary, hint footers, cancelled placeholders |
| `fg.bold` | `bold` | Strong emphasis, display titles |

Anything you want to call "grey" is one of these four. If you reach for `#6b7280`, stop and pick an attribute.

---

## Typography

Terminal typography is constrained to **one font** (the user's monospace) and three attributes (`bold`, `dim`, `italic`). Everything else — hierarchy, drama, restraint — comes from **letter-spacing, casing, and whitespace**.

### Tracking CAPS — the Caret signature

The single most identifiable Caret convention: **section titles and display headings are rendered as letter-spaced uppercase.**

```
C A R E T                          ← display (brand)
D E P L O Y I N G                  ← section heading
M E S S A G E S                    ← subsection
```

**Formation rule:** `title.toUpperCase().split('').join(' ')` — one space between every letter, word boundaries collapse (so `Caret CLI` becomes `C A R E T   C L I` with two spaces between words).

**When to use tracking CAPS:**
- Display brand title (once per output, at the top)
- Section headings (start of each major block)
- Subsection labels (start of grouped content)
- Key names in key-value rows (when editorial density is desired)
- Prompt labels (`N A M E`, `R E G I O N`, `C O N F I R M`)
- Button / confirm markers (`Y  /  N`)

**When NOT to use tracking CAPS:**
- Body text (never)
- Values (paths, versions, timestamps — these stay monospace-literal)
- Code (stays literal)
- Error messages (read naturally, urgently — not "spaced out")
- Anything the user will copy-paste

Implementation: `tracking()` utility in `registry/lib/typography.ts` (to be added).

### Type roles — attribute stacks

Use these semantic roles via `tokens/typography.ts`:

| Role | Attributes | Use |
|---|---|---|
| `display` | `bold` + `tracking(CAPS)` | Brand title at top of output |
| `heading` | `bold` + `tracking(CAPS)` | Section starts |
| `label` | `bold` | Inline labels, form field names |
| `body` | (none) | Default paragraph |
| `strong` | `bold` | Emphasis within body |
| `muted` | `dim` | Secondary, meta, timestamps |
| `subtle` | `dim + italic` | Hint footers, placeholders |
| `code` | (none) | Inline code — already monospace, no styling needed |

No sizes, no fonts, no line-heights — the terminal decides those. Our hierarchy is *bold / dim / italic / tracking / whitespace*.

---

## Symbols — the vocabulary

The canonical symbol vocabulary lives in `registry/tokens/symbols.ts`. **These are not configurable. Every Caret CLI uses exactly these characters in exactly these roles.** This doc describes their meaning — the token file is the source of truth.

### Identity symbols (never negotiable)

- **`^` — the anchor.** Literal caret. Marks the start of every interactive prompt. This is the product name rendered as a symbol. It is the logo.
- **`▸` — focused prefix.** The active row in a multi-row prompt.
- **`·` — idle prefix.** Inactive rows, pending states, separators.

### State symbols

Reinforce semantic colors; each carries meaning without color:

- `✓` success
- `✗` failure
- `⚠` warning
- `ℹ` info
- `—` cancelled / skipped

### Selection markers

- `●` selected
- `○` unselected

### Structure

- `│` vertical gutter — the only border character used routinely. Appears on callouts, quotes, grouped errors. **It is the Caret quote mark.**
- `─` horizontal rule — dividers, section rulers.
- `╭╮╯╰` rounded corners — for the rare cases a full box is drawn. Default border style.
- `┏┓┛┗` heavy corners — *reserved*, never used by default.
- `╔╗╝╚` double lines — *forbidden*. That's retro.

### Progress

- `━` filled cell (heavy)
- `─` empty cell (light)
- `╸` head (optional, between filled and empty)

**No block progress bars** (`██░░`). Blocks are retro-voice — they belong to Hybrid A, which we rejected. Thin lines fit the editorial voice.

### Spinner

Braille dots, fixed 10-frame rotation at 80ms per frame:

```
⠋ ⠙ ⠹ ⠸ ⠼ ⠴ ⠦ ⠧ ⠇ ⠏
```

No other spinner shapes. No rotating bars, no dots, no earth spinner.

### List bullets

- `•` bullet (default)
- `1.` `2.` `3.` ordered (trailing dot, monospace-aligned)
- `—` em-dash (alternate bullet — *discouraged*; use `•` unless you have a taste reason)

### Dotted leaders — the editorial signature

The second most identifiable Caret convention, after tracking CAPS:

```
Environment  ·················  production
Region       ·················  us-east-1
```

The leader is a run of `·` (middle dot, U+00B7) between a label and its value, filling the available width. It's the typographic equivalent of a contents page in a book.

**Formation rule:** `label + ' ' + '·'.repeat(n) + ' ' + value` where `n = width - label.length - value.length - 2`. Minimum 3 dots.

Implementation: `dottedLeader()` utility in `registry/lib/typography.ts` (to be added).

**When to use leaders:**
- Key-value rows
- Step status (`build   ···········  done`)
- Table rows with 2 columns where visual alignment matters
- Prompt meta (`Confirm deploy  ···········  y / n`)

**When NOT:**
- Tables with 3+ columns (use padded columns instead)
- Lists (use bullet)
- Code (literal)

---

## Spacing & rhythm

All spacing in characters, never approximate.

### Base grid

From `tokens/spacing.ts`:

```
none 0   xs 1   sm 2   md 4   lg 6   xl 8
```

### Indent

- **Page indent: 4** (new — updated from current `indent: 2`)
- **Component indent: 2** (unchanged — after the `^` anchor inside a prompt)

The page indent is why the editorial look breathes. Every top-level line starts at column 5, not column 1. This creates a left margin like a magazine page and makes the content feel deliberate.

### Section rhythm

```
(blank)
(blank)                          ← two blank lines before a section heading
S E C T I O N   T I T L E        ← tracking CAPS, bold
(blank)                          ← one blank line after
content begins here
```

**Two blanks before, one blank after.** This is the Caret breathing pattern.

### Horizontal ruler under titles

Optional thin ruler under section headings when the content below is dense (tables, code blocks):

```
S E C T I O N
─────────────────
```

Ruler width = 2 × title length. Dim attribute.

### Inline gaps

- Between a label and its value without a leader: 2 spaces
- Between columns in a table: 2 spaces (minimum)
- Between a bullet and its text: 2 spaces (not 1 — feels cramped in monospace)
- Between an icon and its label: 2 spaces (not 1)

The Caret number is **two**. One space is cramped. Three is loose. Two is right.

---

## Motion

From `tokens/motion.ts`, with the 80ms spinner frame rhythm fixed. Additional guidance:

- **Stagger is allowed** when revealing a list of items (e.g., `boot` steps): 40ms offset per item.
- **No easing for now.** Motion is linear until we find a specific case where easing helps reading speed. (Linear is a decision, not a default.)
- **Typewriter effect** only for brand moments (`splash`, `logo`, opening banner). Never for regular output.
- **No reveal animation on errors.** Errors appear instantly. Motion would feel disrespectful to a user trying to debug a failure.

---

## Borders & surfaces

**The default border count is zero.** Most Caret components have no border. Structure comes from whitespace and alignment.

### When a border is allowed

Only these cases justify border characters:

1. **Callout / quote / tip** — a single-character left gutter `│` (the "quote mark"), accent color. One character wide, no right border, no top or bottom.
2. **Code block** — optional thin top and bottom rule `─`, muted. No side borders.
3. **Table header** — a horizontal rule `─` between header row and data rows. That's the only line.
4. **Table row separator** — *discouraged*. Only use when rows are multi-line.
5. **Modal / dialog** — full rounded box `╭╮╯╰`. Rare; reserved for blocking interactive moments.

**Never:**
- Double-line borders (`╔═╗`) — that's Hybrid A retro
- Heavy borders (`┏━┓`) — reserved, not used
- Full boxes around non-modal content — that's dashboard TUI energy, not Caret
- Shadow effects (extra `▔` or `▁` rows) — too precious

### Surfaces

Caret has **no surface elevation**. There are no cards, no panels, no "floating" components. The user's terminal background *is* the surface. Everything sits directly on it, at the same visual layer. Depth is implied by spacing and typography, not by stacked layers.

This is a principled rejection of the "dashboard chrome" look. A Caret CLI is a single sheet of monospace typography, top to bottom.

---

## Layout patterns

### The standard Caret page

```
(blank)
    C A R E T                                   ← display, tracking bold
    the design system for modern command-line tools   ← muted body
(blank)
    v0.1.0  ·  hybrid B — minimal + editorial   ← subtle meta


    S E C T I O N                               ← heading, tracking bold
    ─────────────                               ← optional dim ruler

    content with 2-space indent inside the 4-space page indent,
    body text reads like prose with dotted leaders for data:

    Environment  ·············  production
    Region       ·············  us-east-1


    N E X T   S E C T I O N
    ...
```

### The prompt line

```
    ^  ?  N A M E   ·····   John Doe▎
```

Four-space page indent, then the `^` anchor, then the `?` prompt marker in accent, then tracking CAPS label, then a short leader, then the user's input, then the cursor `▎`.

### The status line (single-line output)

```
    ✓  deployed to production   ·····   us-east-1 · 14:22
```

---

## Anti-patterns — what Caret is NOT

If you're tempted to do any of these, stop.

- **Gradients across characters.** That's Hybrid A Premium Linear territory. Caret is flat.
- **Emoji in system output.** Emoji is reserved for user-generated content only (e.g., a form field the user typed). No `🚀 Deploying` banners.
- **ALL CAPS without tracking.** `DEPLOYING` reads like shouting. `D E P L O Y I N G` reads like a section break. The tracking is load-bearing.
- **Rainbow palettes.** Caret has *one* accent. If you need a second color for decoration, you don't need the decoration.
- **Nerd Font icons.** We don't require patched fonts. Every glyph is standard Unicode or ASCII.
- **Emoji as status indicators.** 🟢 is not green success. `✓` is.
- **Background colors on badges.** `[ stable ]` with a green bg is a web pattern. We write `s t a b l e` in accent, or `✓ stable` in muted body.
- **Boxes around everything.** Most content is on the bare background with space as the separator.
- **Full-width horizontal rules.** Rulers are short (2× title width) and dim. Full-width rules belong to 80s SSH banners.
- **"Elevation" via background shading.** See Golden Rule #1.
- **Motion on every reveal.** Motion is scarce. Every instance has to earn its place.

---

## Reference images (to be added)

TODO in a later phase: `specs/look/` folder with asciinema recordings of the gallery running.

---

## Revision protocol

This document is the north star. Changing it has real cost — every component must be re-examined against the new rule. Therefore:

1. Propose the change in a PR that updates this file **first**.
2. Then update tokens (`registry/tokens/`).
3. Then update theme (`registry/theme/`).
4. Then migrate components (`registry/components/`).
5. Then update examples (`examples/`).
6. Then update this document's revision footer.

Never change a component's visuals without first updating this manifesto. If you do, the system drifts.

---

**Revision:** 0.1 — initial manifesto, based on Hybrid B gallery exploration
**Authors:** Görkem Yıldız
**Date:** 2026-04-09
