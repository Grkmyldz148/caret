# Changelog

All notable changes to **caret-cli** are documented here. The format
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). The
project adheres to [Semantic Versioning](https://semver.org/) once it
exits the `0.x` band.

## [0.1.0-alpha.1] — 2026-05-05

### Fixed
- `caret init` template no longer imports from `./caret/index.js` —
  the path was wrong (target lives at `<project>/caret/`, not
  `<project>/src/caret/`) and there is no top-level barrel file in
  the copy-paste model. The starter `src/index.ts` now ships as a
  minimal hello-world with comments showing how to import components
  after running `caret add <component>`.
- `caret init` no longer pre-declares `chalk`, `figlet`, `ink`,
  `jimp`, `react` in `dependencies`. Components declare their own
  required deps and `caret add` prints the install command — pre-
  declaring shipped a bloated `package.json` for a template that
  doesn't yet use any of them.

### Internal
- README + LICENSE bundled by `prepack` from the workspace root.
- 22 skill rule files added in the sister repo
  [`Grkmyldz148/caret-skills`](https://github.com/Grkmyldz148/caret-skills).

## [0.1.0-alpha.0] — 2026-05-05

### Added
- First public release on npm.
- `caret init <name>` — scaffolds a TypeScript CLI project (now fixed
  in alpha.1; alpha.0's template was unrunnable).
- `caret add <component>` — copies one component from the registry
  into `./caret/components/<name>/`.
- `caret list` — prints the registry catalog grouped by kind
  (`interactive`, `display`, `utility`, `other`). Currently 51
  components.
- Registry shipped with the tarball: `tokens/`, `theme/`, `lib/`,
  and component sources. Bundled at pack time via `scripts/prepack.cjs`.
- `bin: { caret: ./dist/index.js }` — installable globally or
  invokable via `npx caret-cli@alpha <command>`.

[0.1.0-alpha.1]: https://github.com/Grkmyldz148/caret-cli/releases/tag/v0.1.0-alpha.1
[0.1.0-alpha.0]: https://github.com/Grkmyldz148/caret-cli/releases/tag/v0.1.0-alpha.0
