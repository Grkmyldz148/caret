import type { Metadata } from 'next'
import Link from 'next/link'
import { Callout, CodeBlock, Prose } from '@/components/docs/Prose'

export const metadata: Metadata = {
  title: 'Install — Caret docs',
  description:
    'Install the Caret CLI, scaffold a new project, or add Caret to an existing one. Includes the registry layout and how component lookup resolves.',
}

export default function InstallPage() {
  return (
    <Prose>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-3">
        Overview · Install
      </div>
      <h1>Install</h1>
      <p>
        Caret ships as a single npm package: <code>caret-cli</code>. There is no
        runtime to install in the consumer project — the CLI copies component source
        files into your repo and exits. Your code never imports from{' '}
        <code>caret-cli</code> at runtime.
      </p>

      <h2 id="scaffold">Scaffold a new project</h2>
      <p>
        Run init with a project name. It creates a directory, writes the starter
        files, and prints next steps.
      </p>
      <CodeBlock language="sh">{`npx caret-cli init my-cli
cd my-cli
npm install
npm run dev`}</CodeBlock>
      <p>
        What lands in <code>my-cli/</code>:
      </p>
      <ul>
        <li>
          <code>package.json</code> — <code>tsx</code> for dev, <code>tsc</code> for
          build, <code>ink</code> + <code>react</code> as runtime deps.
        </li>
        <li>
          <code>tsconfig.json</code> — strict mode, ESM, JSX preset for Ink.
        </li>
        <li>
          <code>src/index.ts</code> — a tiny working CLI you can run immediately.
        </li>
        <li>
          <code>caret.md</code> — instruction file for AI assistants. Drop this in
          your repo root and Claude, Cursor, and Copilot produce correct Caret code
          on the first try. See{' '}
          <Link href="/docs/authoring/ai-native">AI-native workflow</Link>.
        </li>
        <li>
          <code>.gitignore</code> — <code>node_modules</code>, <code>dist</code>, and
          friends.
        </li>
      </ul>

      <h2 id="add">Add a single component</h2>
      <p>
        Already have a project? Run <code>add</code> with a component name. Files land
        under <code>caret/</code> by default; pass <code>--dir</code> for a different
        target.
      </p>
      <CodeBlock language="sh">{`npx caret-cli add prompt
npx caret-cli add spinner

# custom destination
npx caret-cli add error --dir src/ui`}</CodeBlock>
      <p>
        Each component prints its required runtime dependencies (e.g.{' '}
        <code>ink</code>, <code>react</code>, <code>chalk</code>). Install them once
        per project; the components themselves are vendored.
      </p>

      <Callout kind="info" title="Own the code">
        Components are not symlinked or imported from <code>caret-cli</code>. They
        are copied verbatim and live in your repo. Modify, fork, or delete them —
        Caret is a starting point, not a runtime dependency.
      </Callout>

      <h2 id="list">List the registry</h2>
      <p>
        See every component the bundled registry exposes:
      </p>
      <CodeBlock language="sh">{`npx caret-cli list`}</CodeBlock>
      <p>
        Output groups components by kind (<code>interactive</code>,{' '}
        <code>display</code>, <code>utility</code>) with a one-line description for
        each. The full live catalog with previews is at{' '}
        <Link href="/components">/components</Link>.
      </p>

      <h2 id="registry-layout">Registry layout</h2>
      <p>
        The CLI ships its own copy of the registry inside the npm tarball. The
        <code> add</code> command resolves the registry from one of three locations,
        in order:
      </p>
      <ol className="list-decimal pl-6 my-4 text-[15px] text-muted leading-relaxed">
        <li>
          Bundled with the package — <code>node_modules/caret-cli/registry/</code>
        </li>
        <li>
          Workspace dev environment — useful when contributing to Caret itself
        </li>
        <li>
          Current working directory — for advanced custom registry overrides
        </li>
      </ol>
      <p>
        The first location applies to virtually every consumer. Each registered
        component has a manifest entry that lists its files, declared runtime
        dependencies, and the spec it implements.
      </p>

      <h2 id="versioning">Versioning</h2>
      <p>
        Caret follows semver. Major bumps may rename or remove components — pin{' '}
        <code>caret-cli</code> with <code>npx -p caret-cli@0.1</code> if you need
        a stable surface during a refactor. Components copied into your repo are
        frozen at the version you ran <code>add</code> with; re-run to upgrade.
      </p>
    </Prose>
  )
}
