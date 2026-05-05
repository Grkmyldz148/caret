/**
 * Caret tree — demo
 *
 *   pnpm --filter @caret/examples tree
 */

import { tree } from '@caret/registry/components/index.js'

process.stdout.write('Project structure:\n')
tree({
  root: {
    label: 'caret',
    children: [
      {
        label: 'registry',
        children: [
          {
            label: 'components',
            children: [
              {
                label: 'prompt',
                children: [
                  { label: 'index.tsx' },
                  { label: 'shared.tsx' },
                  { label: 'text.tsx' },
                  { label: 'select.tsx' },
                ],
              },
              { label: 'error.ts' },
              { label: 'spinner.tsx' },
              { label: 'table.ts' },
            ],
          },
          {
            label: 'theme',
            children: [
              { label: 'types.ts' },
              { label: 'default.ts' },
              { label: 'context.tsx' },
            ],
          },
        ],
      },
      { label: 'specs' },
      { label: 'examples' },
      { label: 'package.json' },
    ],
  },
})

process.stdout.write('\nMultiple roots:\n')
tree({
  root: [
    { label: 'apps', children: [{ label: 'web' }, { label: 'mobile' }] },
    { label: 'packages', children: [{ label: 'ui' }, { label: 'config' }] },
  ],
})
