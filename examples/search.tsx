/**
 * search example
 *
 *   pnpm search
 */

import { search, success, info } from '@caret/registry'

const services = [
  { id: 'api-gw',    name: 'api-gateway',    status: 'running',  region: 'us-east-1' },
  { id: 'billing',   name: 'billing-svc',    status: 'failed',   region: 'eu-west-1' },
  { id: 'auth',      name: 'auth-service',   status: 'running',  region: 'us-east-1' },
  { id: 'notify',    name: 'notifications',  status: 'running',  region: 'ap-south-1' },
  { id: 'payments',  name: 'payment-proc',   status: 'starting', region: 'us-east-1' },
  { id: 'search',    name: 'search-engine',  status: 'running',  region: 'us-west-2' },
  { id: 'storage',   name: 'object-store',   status: 'running',  region: 'eu-west-1' },
  { id: 'analytics', name: 'analytics-svc',  status: 'running',  region: 'us-east-1' },
  { id: 'cache',     name: 'redis-cache',    status: 'running',  region: 'us-east-1' },
  { id: 'queue',     name: 'message-queue',  status: 'degraded', region: 'eu-west-1' },
  { id: 'logs',      name: 'log-collector',  status: 'running',  region: 'us-west-2' },
  { id: 'ml',        name: 'ml-inference',   status: 'stopped',  region: 'us-east-1' },
]

const selected = await search({
  items: services.map((s) => ({
    value: s.id,
    label: s.name,
    description: `${s.status} · ${s.region}`,
  })),
  placeholder: 'Search services…',
  limit: 8,
})

if (selected) {
  const svc = services.find((s) => s.id === selected)!
  success(`Selected: ${svc.name}`)
  info(`Status: ${svc.status} · Region: ${svc.region}`)
} else {
  info('Cancelled')
}
