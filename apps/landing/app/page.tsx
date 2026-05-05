import { Nav } from '@/components/sections/Nav'
import { Hero } from '@/components/sections/Hero'
import { Problem } from '@/components/sections/Problem'
import { Components } from '@/components/sections/Components'
import { Principles } from '@/components/sections/Principles'
import { Code } from '@/components/sections/Code'
import { AiNative } from '@/components/sections/AiNative'
import { Cta } from '@/components/sections/Cta'
import { Footer } from '@/components/sections/Footer'

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="w-full max-w-7xl mx-auto px-6 lg:px-12">
        <Hero />
        <Problem />
        <Components />
        <Principles />
        <Code />
        <AiNative />
        <Cta />
      </main>
      <Footer />
    </>
  )
}
