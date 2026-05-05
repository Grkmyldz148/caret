export function Code() {
  return (
    <section className="py-24 hairline-t grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
      <div className="lg:col-span-4 flex flex-col gap-4 lg:sticky lg:top-24">
        <h2 className="text-3xl md:text-4xl font-light tracking-tight text-fg">
          No provider. No config. No theme object you forgot to pass down.
        </h2>
        <p className="text-muted text-lg font-light">That’s it. Import and go.</p>
      </div>

      <div className="lg:col-span-8">
        <div className="bg-terminal-surface border border-terminal-hairline rounded-lg overflow-hidden">
          <div className="flex items-center h-10 px-4 border-b border-terminal-hairline gap-4">
            <div className="flex items-center gap-2 text-terminal-fg text-xs font-mono border-b border-accent h-full px-2 pt-[1px]">
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
                className="text-accent"
                aria-hidden
              >
                <path
                  d="M2.5 13.5V2.5H10.5L13.5 5.5V13.5H2.5Z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
              deploy.ts
            </div>
          </div>

          <pre className="term p-6 overflow-x-auto text-fg">
            <code>
              <span className="text-accent">import</span>
              {' { prompt, error, spinner } '}
              <span className="text-accent">from</span>
              {' '}
              <span className="text-success">&apos;./caret&apos;</span>
              {'\n\n'}
              <span className="text-accent">const</span> name ={' '}
              <span className="text-accent">await</span> prompt.text({'{'}
              {'\n'}
              {'  '}label:{' '}
              <span className="text-success">&apos;Project name&apos;</span>,
              {'\n'}
              {'}'})
              {'\n\n'}
              <span className="text-accent">await</span> spinner(
              <span className="text-success">&apos;Deploying&apos;</span>,{' '}
              <span className="text-accent">async</span> () ={'>'} {'{'}
              {'\n'}
              {'  '}
              <span className="text-accent">await</span> deploy(name)
              {'\n'}
              {'}'})
              {'\n\n'}
              error(
              <span className="text-success">&apos;Deploy failed&apos;</span>,{' '}
              {'{'}
              {'\n'}
              {'  '}hint:{' '}
              <span className="text-success">
                &apos;Check your API key in ~/.config/my-cli&apos;
              </span>
              ,{'\n'}
              {'  '}see:{' '}
              <span className="text-success">
                &apos;https://my-cli.dev/docs/auth&apos;
              </span>
              ,{'\n'}
              {'}'})
            </code>
          </pre>
        </div>
      </div>
    </section>
  )
}
