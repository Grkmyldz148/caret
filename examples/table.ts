/**
 * Caret table — demo
 *
 *   pnpm --filter @caret/examples table
 */

import { table } from '@caret/registry/components/index.js'

type AppRow = { name: string; status: string; region: string; uptime: string; cpu: number }

const rows: AppRow[] = [
  { name: 'web-frontend',  status: 'running',  region: 'us-east-1', uptime: '3d 4h',  cpu: 12 },
  { name: 'api-server',    status: 'running',  region: 'us-east-1', uptime: '3d 4h',  cpu: 38 },
  { name: 'worker-queue',  status: 'starting', region: 'eu-west-1', uptime: '32s',    cpu: 4  },
  { name: 'billing-svc',   status: 'failed',   region: 'us-east-1', uptime: '0s',     cpu: 0  },
  { name: 'analytics-job', status: 'idle',     region: 'us-west-2', uptime: '12h',    cpu: 1  },
]

process.stdout.write('Borderless (default):\n')
table<AppRow>({
  columns: [
    { header: 'NAME',    accessor: (r) => r.name },
    { header: 'STATUS',  accessor: (r) => r.status },
    { header: 'REGION',  accessor: (r) => r.region },
    { header: 'UPTIME',  accessor: (r) => r.uptime },
    { header: 'CPU %',   accessor: (r) => r.cpu, align: 'right' },
  ],
  rows,
})

process.stdout.write('\nWith borders:\n')
table<AppRow>({
  columns: [
    { header: 'NAME',    accessor: (r) => r.name },
    { header: 'STATUS',  accessor: (r) => r.status },
    { header: 'REGION',  accessor: (r) => r.region },
    { header: 'UPTIME',  accessor: (r) => r.uptime },
    { header: 'CPU %',   accessor: (r) => r.cpu, align: 'right' },
  ],
  rows,
  borders: true,
})
