import type { ReactNode } from 'react'
import {
  Banner,
  ErrorBlock,
  KeyValue,
  List,
  Progress,
  Prompt,
  Spinner,
  Step,
  SuccessMessage,
  Table,
  TerminalStage,
} from '@/components/terminal'

function Card({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="bg-terminal-canvas p-6 md:p-8 min-h-[200px] flex flex-col justify-between gap-6 overflow-hidden">
      <div className="flex-1 flex items-start overflow-hidden">
        <TerminalStage>{children}</TerminalStage>
      </div>
      <div className="text-[10px] font-mono text-terminal-muted uppercase tracking-[0.2em]">
        {label}
      </div>
    </div>
  )
}

export function Components() {
  return (
    <section id="components" className="py-24 hairline-t">
      <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="font-mono text-xs text-accent mb-4 uppercase tracking-[0.2em]">
            Components
          </div>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight max-w-2xl">
            Every primitive a CLI needs. And then some.
          </h2>
        </div>
        <a
          href="/components"
          className="inline-flex items-center text-sm font-medium text-fg hover:text-accent transition-colors w-max border-b border-hairline hover:border-accent pb-1"
        >
          Browse all components <span className="ml-2 font-mono">↗</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-terminal-hairline border border-terminal-hairline">
        <Card label="banner">
          <Banner title="my-cli" subtitle="v2.0.0 — production" width={26} />
        </Card>

        <Card label="prompt">
          <Prompt
            label="Project name"
            description="Used as the package name"
            value="acme-cli"
          />
        </Card>

        <Card label="spinner">
          <Spinner label="Building packages…" state="spinning" />
          <Spinner label="Compile assets" state="success" suffixTime="1.2s" />
          <Spinner label="Publish" state="failure" suffixTime="4.8s" />
        </Card>

        <Card label="error">
          <ErrorBlock
            title="missing required flag '--output'"
            hint="pass --output=./dist or set caret.outDir"
            see="https://caret.dev/docs/errors/E102"
          />
        </Card>

        <Card label="step">
          <Step
            steps={[
              { label: 'Install dependencies', status: 'done' },
              { label: 'Compile assets', status: 'done' },
              { label: 'Run unit tests', status: 'active' },
              { label: 'Deploy to edge', status: 'pending' },
            ]}
          />
        </Card>

        <Card label="progress">
          <Progress value={72} total={100} label="Build " width={22} />
          <Progress value={34} total={100} label="Upload" width={22} />
          <Progress value={100} total={100} label="Deploy" width={22} />
        </Card>

        <Card label="table">
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
        </Card>

        <Card label="keyValue">
          <KeyValue
            width={38}
            rows={[
              { key: 'Environment', value: 'production' },
              { key: 'Region', value: 'us-east-1' },
              { key: 'Build', value: '2.3s' },
            ]}
          />
        </Card>

        <Card label="list · message">
          <List
            variant="bullet"
            items={[
              { label: 'Authentication', description: 'Sign in with email' },
              { label: 'Database', description: 'PostgreSQL on Neon' },
            ]}
          />
          <div className="h-[1ch]" aria-hidden />
          <SuccessMessage>Deploy complete</SuccessMessage>
        </Card>
      </div>

      <div className="mt-12 flex items-center justify-between text-xs font-mono text-muted">
        <span>
          Showing 9 of 80+ components
        </span>
        <a
          href="/components"
          className="text-accent hover:text-fg transition-colors"
        >
          See the full catalog →
        </a>
      </div>
    </section>
  )
}
