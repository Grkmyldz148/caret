import type { ReactNode } from 'react'
import {
  Accent,
  Badge,
  Banner,
  Bold,
  CelebrateEffect,
  ConfettiEffect,
  Danger,
  Dim,
  Divider,
  ErrorBlock,
  FireworksEffect,
  GameOfLifeEffect,
  Info,
  InfoMessage,
  KeyValue,
  Kbd,
  List,
  MatrixEffect,
  ParticlesEffect,
  Progress,
  Prompt,
  Row,
  Spinner,
  Step,
  Success,
  SuccessMessage,
  Table,
  Warning,
  WarningMessage,
} from '@/components/terminal'

export type CatalogCategory =
  | 'interactive'
  | 'display'
  | 'message'
  | 'layout'
  | 'text'
  | 'data'
  | 'animation'
  | 'effect'
  | 'utility'

export type CatalogEntry = {
  name: string
  slug: string
  category: CatalogCategory
  description: string
  preview: ReactNode
}

export const CATEGORIES: Record<
  CatalogCategory,
  { label: string; description: string }
> = {
  interactive: {
    label: 'Interactive',
    description: 'Ask, confirm, choose, collect.',
  },
  display: {
    label: 'Display',
    description: 'Structured state, status, results.',
  },
  message: {
    label: 'Messages',
    description: 'Single-line semantic statements.',
  },
  layout: {
    label: 'Layout',
    description: 'Framing, sectioning, space.',
  },
  text: {
    label: 'Text',
    description: 'Prose, code, inline typography.',
  },
  data: {
    label: 'Data viz',
    description: 'Numbers rendered as glyphs.',
  },
  animation: {
    label: 'Animation',
    description: 'Reveals, boots, typewriters.',
  },
  effect: {
    label: 'Effects',
    description: 'Ambient, celebratory, atmospheric.',
  },
  utility: {
    label: 'Utility',
    description: 'Smaller glue and building blocks.',
  },
}

// ---- Static preview helpers -------------------------------------------------

function Block({ char = '█', count = 4, className = 'text-accent' }: {
  char?: string
  count?: number
  className?: string
}) {
  return <span className={className}>{char.repeat(count)}</span>
}

// ============================================================================

export const CATALOG: CatalogEntry[] = [
  // ==========================================================================
  // INTERACTIVE
  // ==========================================================================
  {
    name: 'prompt',
    slug: 'prompt',
    category: 'interactive',
    description: 'The one prompt that scales from text to multi-select.',
    preview: (
      <Prompt
        label="Project name"
        description="Used as the package name"
        value="acme-cli"
      />
    ),
  },
  {
    name: 'spinner',
    slug: 'spinner',
    category: 'interactive',
    description: 'Long-running tasks with success and failure states.',
    preview: (
      <>
        <Spinner label="Building packages…" state="spinning" />
        <Spinner label="Compile assets" state="success" suffixTime="1.2s" />
        <Spinner label="Publish" state="failure" suffixTime="4.8s" />
      </>
    ),
  },
  {
    name: 'form',
    slug: 'form',
    category: 'interactive',
    description: 'Chain prompts into a single structured result.',
    preview: (
      <>
        <Prompt label="Name" value="acme-cli" />
        <Prompt label="License" value="MIT" />
        <Prompt label="Private" value="no" />
      </>
    ),
  },
  {
    name: 'modal',
    slug: 'modal',
    category: 'interactive',
    description: 'Bordered confirmation dialog with actions.',
    preview: (
      <>
        {/* Frame total width: 30 chars → inner body = 28 */}
        <Row><Dim>┌─ confirm ──────────────────┐</Dim></Row>
        <Row><Dim>│</Dim>{' Delete 3 files?            '}<Dim>│</Dim></Row>
        <Row><Dim>│</Dim>{'                            '}<Dim>│</Dim></Row>
        <Row><Dim>│</Dim>{'   '}<Accent>[ Cancel ]</Accent>{'  '}<Danger>[ Delete ]</Danger>{'   '}<Dim>│</Dim></Row>
        <Row><Dim>└────────────────────────────┘</Dim></Row>
      </>
    ),
  },
  {
    name: 'tabs',
    slug: 'tabs',
    category: 'interactive',
    description: 'Tab bar navigation with ←/→ selection.',
    preview: (
      <>
        <Row>
          <Accent bold>▸ Overview</Accent>{'   '}
          <Dim>· Config</Dim>{'   '}
          <Dim>· Logs</Dim>
        </Row>
        <Row />
        <Row><Dim>←→ navigate · ↵ select · esc cancel</Dim></Row>
      </>
    ),
  },
  {
    name: 'toggle',
    slug: 'toggle',
    category: 'interactive',
    description: 'Boolean on/off switch with space to toggle.',
    preview: (
      <>
        <Row><Accent>^</Accent> Dark mode  <Accent bold>● on</Accent></Row>
        <Row><Accent>^</Accent> Telemetry  <Dim>○ off</Dim></Row>
      </>
    ),
  },
  {
    name: 'accordion',
    slug: 'accordion',
    category: 'interactive',
    description: 'Collapsible sections for grouped content.',
    preview: (
      <>
        <Row><Accent bold>▸ General</Accent></Row>
        <Row>  <Dim>│</Dim> Name: my-app</Row>
        <Row>  <Dim>│</Dim> Version: 1.0.0</Row>
        <Row />
        <Row><Dim>· Advanced</Dim></Row>
        <Row><Dim>· About</Dim></Row>
      </>
    ),
  },
  {
    name: 'slider',
    slug: 'slider',
    category: 'interactive',
    description: 'Numeric range input with ←/→ adjustment.',
    preview: (
      <>
        <Row><Accent>^</Accent> Volume  <Accent>━━━━━━━━━━╸──────────</Accent>  <Bold>50</Bold></Row>
        <Row />
        <Row><Dim>←→ adjust · ↵ confirm · esc cancel</Dim></Row>
      </>
    ),
  },
  {
    name: 'filePicker',
    slug: 'file-picker',
    category: 'interactive',
    description: 'Interactive file and directory browser.',
    preview: (
      <>
        <Row><Accent bold>~/projects/acme-cli</Accent></Row>
        <Row />
        <Row><Accent bold>▸ src/</Accent></Row>
        <Row><Dim>· package.json</Dim></Row>
        <Row><Dim>· tsconfig.json</Dim></Row>
        <Row><Dim>· README.md</Dim></Row>
      </>
    ),
  },
  {
    name: 'commandPalette',
    slug: 'command-palette',
    category: 'interactive',
    description: 'Fuzzy command search with grouped results.',
    preview: (
      <>
        <Row><Accent>▸</Accent> buil<Dim>  3/12</Dim></Row>
        <Row />
        <Row>  <Bold>Tasks</Bold></Row>
        <Row>  <Accent>  ▸ Build project</Accent></Row>
        <Row><Dim>    · Build for production</Dim></Row>
        <Row><Dim>    · Build Docker image</Dim></Row>
      </>
    ),
  },
  {
    name: 'contextMenu',
    slug: 'context-menu',
    category: 'interactive',
    description: 'Bordered action menu with separator support.',
    preview: (
      <>
        <Row><Dim>╭──────────────╮</Dim></Row>
        <Row><Dim>│</Dim>{' '}<Accent bold>▸ Edit</Accent>{'       '}<Dim>│</Dim></Row>
        <Row><Dim>│</Dim>{' '}<Dim>· Duplicate</Dim>{'  '}<Dim>│</Dim></Row>
        <Row><Dim>│ ──────────── │</Dim></Row>
        <Row><Dim>│</Dim>{' '}<Dim>· </Dim><Danger>Delete</Danger>{'     '}<Dim>│</Dim></Row>
        <Row><Dim>╰──────────────╯</Dim></Row>
      </>
    ),
  },
  {
    name: 'virtualizedList',
    slug: 'virtualized-list',
    category: 'interactive',
    description: 'Windowed scrollable list for large datasets.',
    preview: (
      <>
        <Row><Accent>▸ api-gateway</Accent>  <Dim>running</Dim></Row>
        <Row><Dim>· auth-service</Dim>  <Dim>running</Dim></Row>
        <Row><Dim>· billing-svc</Dim>   <Dim>failed</Dim></Row>
        <Row><Dim>· cache-layer</Dim>   <Dim>running</Dim></Row>
        <Row><Dim>· data-worker</Dim>   <Dim>stopped</Dim>  <Dim>▎</Dim></Row>
      </>
    ),
  },
  {
    name: 'toast',
    slug: 'toast',
    category: 'interactive',
    description: 'Transient notification with an icon and label.',
    preview: (
      <>
        <Row><Success>✓</Success> Saved <Dim>· 2s ago</Dim></Row>
        <Row><Info>ℹ</Info> New version available</Row>
        <Row><Danger>✗</Danger> Lost connection</Row>
      </>
    ),
  },

  // ==========================================================================
  // DISPLAY
  // ==========================================================================
  {
    name: 'banner',
    slug: 'banner',
    category: 'display',
    description: 'Framed title above the first interaction.',
    preview: <Banner title="my-cli" subtitle="v2.0.0 — production" width={24} />,
  },
  {
    name: 'error',
    slug: 'error',
    category: 'display',
    description: 'A full error block with hint and docs link.',
    preview: (
      <ErrorBlock
        title="missing required flag '--output'"
        hint="pass --output=./dist or set caret.outDir"
        see="https://caret.dev/docs/errors/E102"
      />
    ),
  },
  {
    name: 'step',
    slug: 'step',
    category: 'display',
    description: 'Ordered task list with live state.',
    preview: (
      <Step
        steps={[
          { label: 'Install dependencies', status: 'done' },
          { label: 'Compile assets', status: 'done' },
          { label: 'Run unit tests', status: 'active' },
          { label: 'Deploy to edge', status: 'pending' },
        ]}
      />
    ),
  },
  {
    name: 'progress',
    slug: 'progress',
    category: 'display',
    description: 'Character-grid progress bar.',
    preview: (
      <>
        <Progress value={72} total={100} label="Build " width={16} />
        <Progress value={34} total={100} label="Upload" width={16} />
        <Progress value={100} total={100} label="Deploy" width={16} />
      </>
    ),
  },
  {
    name: 'table',
    slug: 'table',
    category: 'display',
    description: 'Column-aligned data with optional rule.',
    preview: (
      <Table
        rule
        columns={[
          { header: 'NAME', accessor: (r) => r.name },
          { header: 'STATUS', accessor: (r) => r.status },
          { header: 'AGE', accessor: (r) => r.age, align: 'right' },
        ]}
        rows={[
          { name: 'web', status: 'running', age: '3d' },
          { name: 'api', status: 'running', age: '3d' },
          { name: 'worker', status: 'failed', age: '1m' },
        ]}
      />
    ),
  },
  {
    name: 'keyValue',
    slug: 'key-value',
    category: 'display',
    description: 'Leader-dotted key → value pairs.',
    preview: (
      <KeyValue
        width={28}
        rows={[
          { key: 'Environment', value: 'production' },
          { key: 'Region', value: 'us-east-1' },
          { key: 'Build', value: '2.3s' },
        ]}
      />
    ),
  },
  {
    name: 'list',
    slug: 'list',
    category: 'display',
    description: 'Bulleted or numbered items with descriptions.',
    preview: (
      <List
        variant="bullet"
        items={[
          { label: 'Authentication', description: 'Sign in with email' },
          { label: 'Database', description: 'PostgreSQL on Neon' },
          { label: 'Deploy', description: 'Vercel edge' },
        ]}
      />
    ),
  },
  {
    name: 'tree',
    slug: 'tree',
    category: 'display',
    description: 'File-system style hierarchical tree.',
    preview: (
      <>
        <Row><Dim>apps</Dim></Row>
        <Row><Dim>├─</Dim> landing</Row>
        <Row><Dim>│  ├─</Dim> app</Row>
        <Row><Dim>│  └─</Dim> components</Row>
        <Row><Dim>└─</Dim> cli</Row>
        <Row>   <Dim>└─</Dim> src</Row>
      </>
    ),
  },
  {
    name: 'diff',
    slug: 'diff',
    category: 'display',
    description: 'Unified diff with add/remove coloring.',
    preview: (
      <>
        <Row><Dim>@@ -3,4 +3,4 @@</Dim></Row>
        <Row>  <Dim>import &#123; cli &#125; from &apos;caret&apos;</Dim></Row>
        <Row><Danger>- const app = cli(&apos;my-cli&apos;)</Danger></Row>
        <Row><Success>+ const app = cli(&apos;acme-cli&apos;)</Success></Row>
        <Row>  <Dim>app.run()</Dim></Row>
      </>
    ),
  },
  {
    name: 'link',
    slug: 'link',
    category: 'display',
    description: 'Accent-underlined URL with OSC 8 support.',
    preview: (
      <>
        <Row>
          Read more at{' '}
          <Accent>
            <span className="underline">caret.dev/docs</span>
          </Accent>
        </Row>
        <Row>
          Open issue{' '}
          <Accent>
            <span className="underline">github.com/caret/cli#42</span>
          </Accent>
        </Row>
      </>
    ),
  },
  {
    name: 'alert',
    slug: 'alert',
    category: 'display',
    description: 'Full-width info/warning/danger panels.',
    preview: (
      <>
        <Row><Warning>⚠</Warning> <Warning bold>Deprecated</Warning></Row>
        <Row>   <Dim>`config.v1` will be removed in v3.0.</Dim></Row>
        <Row>   <Dim>Migrate to `caret.config.ts`.</Dim></Row>
      </>
    ),
  },
  {
    name: 'checklist',
    slug: 'checklist',
    category: 'display',
    description: 'Static list of done/pending items.',
    preview: (
      <>
        <Row><Success>[x]</Success> Install CLI</Row>
        <Row><Success>[x]</Success> Run `caret init`</Row>
        <Row><Dim>[ ]</Dim> Copy your first component</Row>
        <Row><Dim>[ ]</Dim> Ship it</Row>
      </>
    ),
  },
  {
    name: 'statusLine',
    slug: 'status-line',
    category: 'display',
    description: 'Inline segmented status bar.',
    preview: (
      <>
        <Row>
          <Success>●</Success> api <Dim>·</Dim>{' '}
          <Success>●</Success> web <Dim>·</Dim>{' '}
          <Danger>●</Danger> worker <Dim>·</Dim>{' '}
          <Dim>us-east-1</Dim>
        </Row>
      </>
    ),
  },
  {
    name: 'breadcrumb',
    slug: 'breadcrumb',
    category: 'display',
    description: 'Path-style navigation across screens.',
    preview: (
      <Row>
        <Dim>home</Dim> <Dim>›</Dim> <Dim>projects</Dim> <Dim>›</Dim>{' '}
        <Accent>acme-cli</Accent>
      </Row>
    ),
  },
  {
    name: 'chat',
    slug: 'chat',
    category: 'display',
    description: 'Role-tagged conversation transcript.',
    preview: (
      <>
        <Row><Accent bold>user</Accent> <Dim>›</Dim> build me a landing page</Row>
        <Row><Success bold>assistant</Success> <Dim>›</Dim> Done. Preview on :3000.</Row>
        <Row><Accent bold>user</Accent> <Dim>›</Dim> ship it</Row>
      </>
    ),
  },
  {
    name: 'help',
    slug: 'help',
    category: 'display',
    description: 'Auto-formatted CLI help screen.',
    preview: (
      <>
        <Row><Dim>Usage:</Dim> <Bold>caret</Bold> <Accent>&lt;command&gt;</Accent> [options]</Row>
        <Row />
        <Row><Dim>Commands</Dim></Row>
        <Row>  <Accent>init</Accent>   <Dim>scaffold a new project</Dim></Row>
        <Row>  <Accent>add</Accent>    <Dim>copy a component</Dim></Row>
        <Row>  <Accent>diff</Accent>   <Dim>compare registry versions</Dim></Row>
      </>
    ),
  },
  {
    name: 'stats',
    slug: 'stats',
    category: 'display',
    description: 'Row of KPI numbers with trend glyphs.',
    preview: (
      <>
        <Row>
          <Dim>builds</Dim> <Bold>1.2k</Bold> <Success>↑12%</Success>
          {'   '}
          <Dim>errors</Dim> <Bold>4</Bold> <Danger>↑2</Danger>
        </Row>
        <Row>
          <Dim>uptime</Dim> <Bold>99.98%</Bold> <Success>→</Success>
          {'   '}
          <Dim>p95</Dim> <Bold>142ms</Bold> <Success>↓8ms</Success>
        </Row>
      </>
    ),
  },
  {
    name: 'timeline',
    slug: 'timeline',
    category: 'display',
    description: 'Chronological events with kinds.',
    preview: (
      <>
        <Row><Dim>10:02</Dim> <Success>●</Success> deploy succeeded</Row>
        <Row><Dim>09:48</Dim> <Accent>●</Accent> build started</Row>
        <Row><Dim>09:41</Dim> <Warning>●</Warning> cache miss</Row>
        <Row><Dim>09:40</Dim> <Dim>●</Dim> pr merged</Row>
      </>
    ),
  },
  {
    name: 'calendar',
    slug: 'calendar',
    category: 'display',
    description: 'Month-view calendar with today and marked date highlights.',
    preview: (
      <>
        <Row><Accent bold>A P R I L   2 0 2 6</Accent></Row>
        <Row><Dim>Mo  Tu  We  Th  Fr  Sa  Su</Dim></Row>
        <Row>         1   2   3   4   5</Row>
        <Row> 6   7   8   9  10  11  12</Row>
        <Row>13  14  <Accent bold> 15</Accent>  16  17  18  19</Row>
        <Row>20  21  22  23  24  25  26</Row>
      </>
    ),
  },
  {
    name: 'heatmap',
    slug: 'heatmap',
    category: 'display',
    description: 'Grid-based heatmap with block intensity levels.',
    preview: (
      <>
        <Row><Dim>Mon  </Dim><Dim>░░</Dim> ▒▒ <Bold>▓▓</Bold> <Accent>██</Accent> ▒▒</Row>
        <Row><Dim>Tue  </Dim>▒▒ <Bold>▓▓</Bold> <Accent>██</Accent> <Bold>▓▓</Bold> <Dim>░░</Dim></Row>
        <Row><Dim>Wed  </Dim>▒▒ <Bold>▓▓</Bold> <Bold>▓▓</Bold> <Accent>██</Accent> <Dim>░░</Dim></Row>
      </>
    ),
  },
  {
    name: 'jsonViewer',
    slug: 'json-viewer',
    category: 'display',
    description: 'Syntax-highlighted formatted JSON display.',
    preview: (
      <>
        <Row>{'{'}</Row>
        <Row>  <Accent>&quot;name&quot;</Accent>: &quot;caret&quot;,</Row>
        <Row>  <Accent>&quot;version&quot;</Accent>: <Bold>1</Bold>,</Row>
        <Row>  <Accent>&quot;tags&quot;</Accent>: [&quot;cli&quot;, &quot;ui&quot;]</Row>
        <Row>{'}'}</Row>
      </>
    ),
  },
  {
    name: 'dashboard',
    slug: 'dashboard',
    category: 'display',
    description: 'Multi-cell grid dashboard frame.',
    preview: (
      <>
        <Row><Dim>┌──────────┬──────────┐</Dim></Row>
        <Row><Dim>│</Dim> <Accent>requests</Accent> <Dim>│</Dim> <Accent>latency</Accent>  <Dim>│</Dim></Row>
        <Row><Dim>│</Dim> <Bold>12.4k</Bold>    <Dim>│</Dim> <Bold>142ms</Bold>    <Dim>│</Dim></Row>
        <Row><Dim>├──────────┼──────────┤</Dim></Row>
        <Row><Dim>│</Dim> <Accent>errors</Accent>   <Dim>│</Dim> <Accent>uptime</Accent>   <Dim>│</Dim></Row>
        <Row><Dim>│</Dim> <Danger>4</Danger>        <Dim>│</Dim> <Success>99.98%</Success>   <Dim>│</Dim></Row>
        <Row><Dim>└──────────┴──────────┘</Dim></Row>
      </>
    ),
  },

  // ==========================================================================
  // MESSAGES
  // ==========================================================================
  {
    name: 'info',
    slug: 'info',
    category: 'message',
    description: 'Neutral informational line.',
    preview: <InfoMessage>Cache cleared. 128 files removed.</InfoMessage>,
  },
  {
    name: 'success',
    slug: 'success',
    category: 'message',
    description: 'Success confirmation line.',
    preview: <SuccessMessage>Build complete in 2.3s</SuccessMessage>,
  },
  {
    name: 'warning',
    slug: 'warning',
    category: 'message',
    description: 'Non-fatal warning line.',
    preview: <WarningMessage>Deprecated config syntax</WarningMessage>,
  },
  {
    name: 'debug',
    slug: 'debug',
    category: 'message',
    description: 'Dimmed debug trace line.',
    preview: (
      <>
        <Row><Dim>debug: parsing caret.config.ts</Dim></Row>
        <Row><Dim>debug: resolved 14 components</Dim></Row>
        <Row><Dim>debug: theme = dark-default</Dim></Row>
      </>
    ),
  },

  // ==========================================================================
  // LAYOUT
  // ==========================================================================
  {
    name: 'panel',
    slug: 'panel',
    category: 'layout',
    description: 'Bordered container with optional title.',
    preview: (
      <>
        <Row><Accent>╭─ Config ──────────────╮</Accent></Row>
        <Row><Accent>│</Accent> region: us-east-1     <Accent>│</Accent></Row>
        <Row><Accent>│</Accent> replicas: 3           <Accent>│</Accent></Row>
        <Row><Accent>│</Accent> cache: enabled        <Accent>│</Accent></Row>
        <Row><Accent>╰───────────────────────╯</Accent></Row>
      </>
    ),
  },
  {
    name: 'scrollable',
    slug: 'scrollable',
    category: 'layout',
    description: 'Scrollable viewport container with indicator.',
    preview: (
      <>
        <Row><Accent bold>Build output</Accent></Row>
        <Row />
        <Row>Compiling TypeScript…          <Dim>▎</Dim></Row>
        <Row>Bundling 14 modules…           <Dim>▎</Dim></Row>
        <Row>Minifying assets…              </Row>
        <Row>Writing dist/index.js          </Row>
        <Row />
        <Row><Dim>↑↓/jk scroll  q quit  42L  68%</Dim></Row>
      </>
    ),
  },
  {
    name: 'splitPane',
    slug: 'split-pane',
    category: 'layout',
    description: 'Side-by-side scrollable layout.',
    preview: (
      <>
        <Row><Accent bold>Source</Accent>          <Dim>│</Dim> Output</Row>
        <Row>const x = 1    <Dim>│</Dim> <Dim>&gt; Building…</Dim></Row>
        <Row>const y = 2    <Dim>│</Dim> <Dim>&gt; Compiled.</Dim></Row>
        <Row>export &#123;x, y&#125; <Dim>│</Dim> <Success>&gt; Done ✓</Success></Row>
      </>
    ),
  },
  {
    name: 'divider',
    slug: 'divider',
    category: 'layout',
    description: 'Horizontal rule with optional tracked label.',
    preview: (
      <>
        <Divider width={26} />
        <Divider label="Section" width={26} />
        <Divider width={26} />
      </>
    ),
  },
  {
    name: 'space',
    slug: 'space',
    category: 'layout',
    description: 'Typed vertical spacer.',
    preview: (
      <>
        <Row>first block</Row>
        <Row><Dim>· · ·</Dim></Row>
        <Row>second block</Row>
      </>
    ),
  },
  {
    name: 'clear',
    slug: 'clear',
    category: 'layout',
    description: 'Clear the terminal surface.',
    preview: (
      <>
        <Row><Dim>$ caret clear</Dim></Row>
        <Row><Dim>───────────────</Dim></Row>
        <Row><Dim>(screen cleared)</Dim></Row>
      </>
    ),
  },

  // ==========================================================================
  // TEXT
  // ==========================================================================
  {
    name: 'paragraph',
    slug: 'paragraph',
    category: 'text',
    description: 'Wrapped prose with grid-safe line breaks.',
    preview: (
      <>
        <Row>Caret gives your CLI a consistent voice</Row>
        <Row>across prompts, spinners, tables, and</Row>
        <Row>errors — without shipping a framework.</Row>
      </>
    ),
  },
  {
    name: 'quote',
    slug: 'quote',
    category: 'text',
    description: 'Side-barred pull quote.',
    preview: (
      <>
        <Row><Dim>│</Dim> <span>Design is how it works —</span></Row>
        <Row><Dim>│</Dim> <span>not how it looks.</span></Row>
        <Row><Dim>│</Dim>   <Dim>— s. jobs</Dim></Row>
      </>
    ),
  },
  {
    name: 'code',
    slug: 'code',
    category: 'text',
    description: 'Inline code span in accent.',
    preview: (
      <>
        <Row>Run <Accent>`caret add spinner`</Accent> to copy it.</Row>
        <Row>Then import from <Accent>`@/cli/spinner`</Accent>.</Row>
      </>
    ),
  },
  {
    name: 'snippet',
    slug: 'snippet',
    category: 'text',
    description: 'Code block with copy-to-clipboard affordance.',
    preview: (
      <>
        <Row><Dim>─ bash ──────────────────</Dim></Row>
        <Row><Dim>│</Dim> npm install caret-cli</Row>
        <Row><Dim>──────────────</Dim></Row>
      </>
    ),
  },
  {
    name: 'codeBlock',
    slug: 'code-block',
    category: 'text',
    description: 'Framed multi-line code with gutter numbers.',
    preview: (
      <>
        <Row><Dim>1 │</Dim> <Accent>import</Accent> &#123; spinner &#125; <Accent>from</Accent> &apos;caret&apos;</Row>
        <Row><Dim>2 │</Dim></Row>
        <Row><Dim>3 │</Dim> <Accent>await</Accent> spinner(&apos;Building…&apos;,</Row>
        <Row><Dim>4 │</Dim>   () =&gt; build())</Row>
      </>
    ),
  },
  {
    name: 'markdown',
    slug: 'markdown',
    category: 'text',
    description: 'Renders a subset of Markdown in the terminal.',
    preview: (
      <>
        <Row><Bold># Getting started</Bold></Row>
        <Row />
        <Row>Install the CLI:</Row>
        <Row><Dim>```</Dim></Row>
        <Row>  <Accent>npx caret init</Accent></Row>
        <Row><Dim>```</Dim></Row>
      </>
    ),
  },

  // ==========================================================================
  // DATA VIZ
  // ==========================================================================
  {
    name: 'sparkline',
    slug: 'sparkline',
    category: 'data',
    description: 'Compact braille trend line.',
    preview: (
      <>
        <Row><Dim>cpu   </Dim> <Accent>▂▃▅▇▆▄▃▅▇█▇▅</Accent></Row>
        <Row><Dim>mem   </Dim> <Accent>▁▁▂▃▃▄▄▅▅▆▆▇</Accent></Row>
        <Row><Dim>reqs  </Dim> <Accent>▇▆▅▄▃▂▁▂▄▆▇█</Accent></Row>
      </>
    ),
  },
  {
    name: 'brailleChart',
    slug: 'braille-chart',
    category: 'data',
    description: 'Higher-resolution braille line/bar chart.',
    preview: (
      <>
        <Row><Dim>100 │</Dim>           <Accent>⣠⣶⣿</Accent></Row>
        <Row><Dim> 75 │</Dim>      <Accent>⢀⣴⣿⣿⣿</Accent></Row>
        <Row><Dim> 50 │</Dim>   <Accent>⣀⣼⣿⣿⣿⣿⣿</Accent></Row>
        <Row><Dim> 25 │</Dim> <Accent>⣠⣾⣿⣿⣿⣿⣿⣿⣿</Accent></Row>
        <Row><Dim>  0 └──────────────</Dim></Row>
      </>
    ),
  },
  {
    name: 'gauge',
    slug: 'gauge',
    category: 'data',
    description: 'Single metric dial rendered with blocks.',
    preview: (
      <>
        <Row><Dim>CPU</Dim>   <Block count={12} /> <Dim>{'░'.repeat(8)}</Dim> <Bold>62%</Bold></Row>
        <Row><Dim>MEM</Dim>   <Block count={16} /> <Dim>{'░'.repeat(4)}</Dim> <Bold>81%</Bold></Row>
        <Row><Dim>DISK</Dim>  <Block count={6} />  <Dim>{'░'.repeat(14)}</Dim> <Bold>33%</Bold></Row>
      </>
    ),
  },
  {
    name: 'radar',
    slug: 'radar',
    category: 'data',
    description: 'Polar chart for small multivariate sets.',
    preview: (
      <>
        <Row>       <Dim>speed</Dim>       </Row>
        <Row>        <Accent>●</Accent>        </Row>
        <Row>       <Dim>╱ ╲</Dim>       </Row>
        <Row>  <Dim>reach</Dim> <Accent>●</Accent>   <Accent>●</Accent> <Dim>ux</Dim>  </Row>
        <Row>       <Dim>╲ ╱</Dim>       </Row>
        <Row>        <Accent>●</Accent>        </Row>
        <Row>       <Dim>cost</Dim>       </Row>
      </>
    ),
  },
  {
    name: 'waveform',
    slug: 'waveform',
    category: 'data',
    description: 'Symmetric audio-style waveform.',
    preview: (
      <>
        <Row><Accent>▂▄▆█▆▅▃▂▁▂▃▅▆█▇▅▃▁</Accent></Row>
        <Row><Dim>·················</Dim></Row>
        <Row><Accent>▂▄▆█▆▅▃▂▁▂▃▅▆█▇▅▃▁</Accent></Row>
      </>
    ),
  },
  {
    name: 'flamegraph',
    slug: 'flamegraph',
    category: 'data',
    description: 'Stacked CPU/profile flamegraph.',
    preview: (
      <>
        <Row><Accent>{'█'.repeat(20)}</Accent> <Dim>main</Dim></Row>
        <Row> <Accent>{'█'.repeat(16)}</Accent>   <Dim>render</Dim></Row>
        <Row>  <Accent>{'█'.repeat(10)}</Accent>      <Dim>layout</Dim></Row>
        <Row>   <Accent>{'█'.repeat(5)}</Accent>           <Dim>measure</Dim></Row>
      </>
    ),
  },
  {
    name: 'qrcode',
    slug: 'qrcode',
    category: 'data',
    description: 'Block-character QR code.',
    preview: (
      <>
        <Row>█▀▀▀▀▀█ ▄▀█ █▀▀▀▀▀█</Row>
        <Row>█ ███ █ ▀█▀ █ ███ █</Row>
        <Row>█ ▀▀▀ █ ▄ ▄ █ ▀▀▀ █</Row>
        <Row>▀▀▀▀▀▀▀ ▄ █ ▀▀▀▀▀▀▀</Row>
        <Row>█▄▀▀█▀▀▄▀ ▀ █▄▀ ▄ ▀</Row>
      </>
    ),
  },

  // ==========================================================================
  // ANIMATION
  // ==========================================================================
  {
    name: 'splash',
    slug: 'splash',
    category: 'animation',
    description: 'Full-screen opening logo with tagline.',
    preview: (
      <>
        <Row>       <Accent bold>^ CARET</Accent>       </Row>
        <Row />
        <Row>  <Dim>design system for CLIs</Dim>  </Row>
        <Row />
        <Row>     <Dim>press any key</Dim>     </Row>
      </>
    ),
  },
  {
    name: 'logo',
    slug: 'logo',
    category: 'animation',
    description: 'Gradient-ready ASCII logo.',
    preview: (
      <>
        <Row><Accent>  ██████  █████  ██████  ███████ ████████</Accent></Row>
        <Row><Accent> ██      ██   ██ ██   ██ ██         ██</Accent></Row>
        <Row><Accent> ██      ███████ ██████  █████      ██</Accent></Row>
        <Row><Accent> ██      ██   ██ ██   ██ ██         ██</Accent></Row>
        <Row><Accent>  ██████ ██   ██ ██   ██ ███████    ██</Accent></Row>
      </>
    ),
  },
  {
    name: 'typewriter',
    slug: 'typewriter',
    category: 'animation',
    description: 'Character-by-character text reveal.',
    preview: (
      <>
        <Row>Hello, world<Accent>▎</Accent></Row>
        <Row><Dim>Welcome to Caret…</Dim></Row>
      </>
    ),
  },
  {
    name: 'smartTypewriter',
    slug: 'smart-typewriter',
    category: 'animation',
    description: 'Typewriter with natural speed profiles.',
    preview: (
      <>
        <Row>Analyzing your project<Accent>▎</Accent></Row>
        <Row><Dim>14 components found.</Dim></Row>
      </>
    ),
  },
  {
    name: 'reveal',
    slug: 'reveal',
    category: 'animation',
    description: 'Per-line reveal with fade-in dim.',
    preview: (
      <>
        <Row>The design system</Row>
        <Row><Dim>for modern</Dim></Row>
        <Row><Dim>command-line tools.</Dim></Row>
      </>
    ),
  },
  {
    name: 'boot',
    slug: 'boot',
    category: 'animation',
    description: 'Staged boot sequence with OK/ERR markers.',
    preview: (
      <>
        <Row><Success>[ OK ]</Success> loading config</Row>
        <Row><Success>[ OK ]</Success> resolving components</Row>
        <Row><Success>[ OK ]</Success> starting spinner</Row>
        <Row><Dim>[ .. ]</Dim> <Dim>mounting renderer</Dim></Row>
      </>
    ),
  },
  {
    name: 'countdown',
    slug: 'countdown',
    category: 'animation',
    description: 'Counting down seconds before an action.',
    preview: (
      <>
        <Row>Deploying in <Accent bold>3</Accent>…</Row>
        <Row><Dim>Ctrl+C to cancel</Dim></Row>
      </>
    ),
  },
  {
    name: 'skeleton',
    slug: 'skeleton',
    category: 'animation',
    description: 'Dim placeholder blocks while loading.',
    preview: (
      <>
        <Row><Dim>████████████████</Dim></Row>
        <Row><Dim>██████████</Dim></Row>
        <Row><Dim>█████████████</Dim></Row>
        <Row><Dim>███████</Dim></Row>
      </>
    ),
  },
  {
    name: 'morph',
    slug: 'morph',
    category: 'animation',
    description: 'Morphs one string into another character by character.',
    preview: (
      <>
        <Row><Dim>loading…</Dim></Row>
        <Row><Accent>l█ading█</Accent></Row>
        <Row><Success>ready ✓</Success></Row>
      </>
    ),
  },
  {
    name: 'brailleTransition',
    slug: 'braille-transition',
    category: 'animation',
    description: 'Braille-based fade between screens.',
    preview: (
      <>
        <Row><Accent>⣿⣿⣿⣿⡿⠿⠛⠋</Accent></Row>
        <Row><Accent>⣿⣿⡟⠋⠁</Accent></Row>
        <Row><Dim>fading…</Dim></Row>
      </>
    ),
  },
  {
    name: 'gradient',
    slug: 'gradient',
    category: 'animation',
    description: 'Applies an accent gradient across text.',
    preview: (
      <>
        <Row>
          <Accent>C</Accent>
          <Accent>a</Accent>
          <Accent>r</Accent>
          <Accent>e</Accent>
          <Accent>t</Accent>{' '}
          <Dim>•</Dim> <Dim>modern CLIs</Dim>
        </Row>
      </>
    ),
  },

  // ==========================================================================
  // EFFECTS
  // ==========================================================================
  {
    name: 'confetti',
    slug: 'confetti',
    category: 'effect',
    description: 'Terminal-native confetti burst.',
    preview: <ConfettiEffect />,
  },
  {
    name: 'fireworks',
    slug: 'fireworks',
    category: 'effect',
    description: 'Screen-sized burst with trailing sparks.',
    preview: <FireworksEffect />,
  },
  {
    name: 'celebrate',
    slug: 'celebrate',
    category: 'effect',
    description: 'Combined confetti + message celebration.',
    preview: <CelebrateEffect />,
  },
  {
    name: 'matrix',
    slug: 'matrix',
    category: 'effect',
    description: 'The Matrix digital rain, in accent.',
    preview: <MatrixEffect />,
  },
  {
    name: 'particles',
    slug: 'particles',
    category: 'effect',
    description: 'Text explode and reassemble.',
    preview: <ParticlesEffect />,
  },
  {
    name: 'gameOfLife',
    slug: 'game-of-life',
    category: 'effect',
    description: 'Conway\'s Game of Life running in the corner.',
    preview: <GameOfLifeEffect />,
  },

  // ==========================================================================
  // UTILITY
  // ==========================================================================
  {
    name: 'avatar',
    slug: 'avatar',
    category: 'utility',
    description: 'Initials-based user representation.',
    preview: (
      <>
        <Row>
          <Accent bold>[GY]</Accent> Görkem Yıldız
        </Row>
        <Row>
          <Success bold>[AC]</Success> Alice Carter
        </Row>
        <Row>
          <Dim>[BM]</Dim> <Dim>Bob Martinez</Dim>
        </Row>
      </>
    ),
  },
  {
    name: 'badge',
    slug: 'badge',
    category: 'utility',
    description: 'Small inline colored label.',
    preview: (
      <>
        <Row>
          <Badge color="accent">beta</Badge> <Badge color="success">passing</Badge>{' '}
          <Badge color="warning">slow</Badge> <Badge color="danger">failed</Badge>
        </Row>
        <Row>
          <Badge color="info">new</Badge> <Badge color="muted">archived</Badge>
        </Row>
      </>
    ),
  },
  {
    name: 'kbd',
    slug: 'kbd',
    category: 'utility',
    description: 'Keyboard key combinations.',
    preview: (
      <>
        <Row><Kbd keys={['Ctrl', 'K']} /> open command palette</Row>
        <Row><Kbd keys={['Ctrl', 'C']} /> cancel</Row>
        <Row><Kbd keys="Enter" /> confirm</Row>
      </>
    ),
  },
  {
    name: 'timestamp',
    slug: 'timestamp',
    category: 'utility',
    description: 'Formatted timestamps and relative time.',
    preview: (
      <>
        <Row><Dim>2026-04-09 10:42:18</Dim></Row>
        <Row><Dim>2 minutes ago</Dim></Row>
        <Row><Dim>in 3 days</Dim></Row>
      </>
    ),
  },
]

export function getCountByCategory() {
  const counts = {} as Record<CatalogCategory, number>
  for (const entry of CATALOG) {
    counts[entry.category] = (counts[entry.category] ?? 0) + 1
  }
  return counts
}
