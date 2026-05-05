/**
 * columns example
 *
 *   pnpm columns
 */

import { columns, banner } from '@caret/registry'

banner({ title: 'Columns Component' })

columns({
  items: [
    {
      title: 'Server A',
      content: 'Region:  us-east-1\nCPU:     45%\nMemory:  2.1 GB\nDisk:    120 GB\nUptime:  14d 3h',
    },
    {
      title: 'Server B',
      content: 'Region:  eu-west-1\nCPU:     82%\nMemory:  3.7 GB\nDisk:    89 GB\nUptime:  2d 11h',
    },
    {
      title: 'Server C',
      content: 'Region:  ap-south-1\nCPU:     12%\nMemory:  0.8 GB\nDisk:    200 GB\nUptime:  31d 0h',
    },
  ],
  separator: true,
})

console.log()

columns({
  items: [
    {
      title: 'Before',
      content: 'host: api.example.com\nport: 80\nssl: false\ntimeout: 30s',
    },
    {
      title: 'After',
      content: 'host: api.example.com\nport: 443\nssl: true\ntimeout: 10s',
    },
  ],
  gap: 8,
})
