/**
 * PostCSS pipeline.
 *
 *   1. postcss-helmlab compiles every helmlab() / helmlch() /
 *      helmgen() / helmgenlch() function into an sRGB rgb() value
 *      plus an @supports-wrapped color(display-p3 …) override for
 *      wide-gamut displays.
 *   2. Tailwind v4 then sees plain rgb() values inside @theme tokens
 *      and processes the rest of the utilities normally.
 *
 * postcss-helmlab v0.2.1+ ships a CJS bundle alongside the ESM
 * default, so Next 15's `require()`-based plugin loader finds the
 * callable factory at the standard export path.
 *
 * Order matters — Tailwind v4's @tailwindcss/postcss is greedy, so
 * the helmlab compiler runs first on the raw source.
 */

const config = {
  plugins: {
    'postcss-helmlab': { outputMode: 'both' },
    '@tailwindcss/postcss': {},
  },
}

export default config
