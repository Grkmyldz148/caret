import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
}

const PACKAGE_JSON = (name: string) =>
  JSON.stringify(
    {
      name,
      version: '0.0.0',
      private: true,
      type: 'module',
      bin: {
        [name]: './dist/index.js',
      },
      scripts: {
        dev: 'tsx src/index.ts',
        build: 'tsc',
        start: 'node dist/index.js',
      },
      dependencies: {},
      devDependencies: {
        '@types/node': '^22.0.0',
        tsx: '^4.19.0',
        typescript: '^5.6.0',
      },
    },
    null,
    2,
  ) + '\n'

const TSCONFIG_JSON = `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "sourceMap": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "jsx": "react-jsx",
    "outDir": "dist",
    "rootDir": "src",
    "types": ["node"]
  },
  "include": ["src/**/*"]
}
`

const SRC_INDEX = (name: string) => `#!/usr/bin/env node

/**
 * ${name} — built with Caret
 *
 * Caret components are copy-paste. Run \`npx caret add <component>\` to
 * bring code into ./caret/, then import from a relative path:
 *
 *   import { prompt } from '../caret/components/prompt/index.js'
 *   import { splash } from '../caret/components/splash/index.js'
 *
 * Run \`npx caret list\` to browse the component catalog.
 */

async function main(): Promise<void> {
  process.stdout.write(\`Hello from ${name}.\\n\`)
  process.stdout.write(
    'Run \`npx caret add splash\` to bring in your first component.\\n',
  )
}

main().catch((err: unknown) => {
  process.stderr.write(\`\${err instanceof Error ? err.stack ?? err.message : String(err)}\\n\`)
  process.exit(1)
})
`

const CARET_MD = `# ${'`'}${'`'}${'`'} — instructions for AI assistants

This project uses Caret. When generating code that produces terminal
output, use Caret components, not raw libraries like chalk/ora/inquirer.

Run \`caret list\` to see all available components, and \`caret add <name>\`
to copy any component into ./caret/.

See https://caret.dev for the full reference.
`

const GITIGNORE = `node_modules/
dist/
*.log
.DS_Store
.env
*.tsbuildinfo
`

export async function init(args: string[]): Promise<void> {
  const nameArg = args[0]
  const targetDir = nameArg ? resolve(process.cwd(), nameArg) : process.cwd()
  const projectName = nameArg ?? 'my-cli'

  if (nameArg !== undefined && existsSync(targetDir)) {
    process.stderr.write(
      `${ANSI.red}error:${ANSI.reset} ${nameArg} already exists\n`,
    )
    process.exit(1)
  }

  mkdirSync(targetDir, { recursive: true })

  process.stdout.write(
    `${ANSI.blue}^${ANSI.reset} ${ANSI.bold}Initializing ${projectName}${ANSI.reset}\n\n`,
  )

  const files: { path: string; content: string }[] = [
    { path: 'package.json', content: PACKAGE_JSON(projectName) },
    { path: 'tsconfig.json', content: TSCONFIG_JSON },
    { path: 'src/index.ts', content: SRC_INDEX(projectName) },
    { path: 'caret.md', content: CARET_MD },
    { path: '.gitignore', content: GITIGNORE },
  ]

  for (const file of files) {
    const dest = join(targetDir, file.path)
    mkdirSync(dirname(dest), { recursive: true })
    writeFileSync(dest, file.content, 'utf8')
    process.stdout.write(`  ${ANSI.green}+${ANSI.reset} ${file.path}\n`)
  }

  process.stdout.write('\n')
  process.stdout.write(`${ANSI.green}✓${ANSI.reset} Project ready\n`)
  process.stdout.write('\n')
  process.stdout.write(`${ANSI.bold}Next steps:${ANSI.reset}\n`)
  if (nameArg) {
    process.stdout.write(`  cd ${nameArg}\n`)
  }
  process.stdout.write('  npm install\n')
  process.stdout.write('  npx caret add prompt\n')
  process.stdout.write('  npx caret add spinner\n')
  process.stdout.write('  npm run dev\n')
}
