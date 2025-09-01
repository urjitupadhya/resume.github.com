import Hero from "@/components/sections/hero"
import Fall from "@/components/sections/fall"
import Rebirth from "@/components/sections/rebirth"
import Modernization from "@/components/sections/modernization"
import Features from "@/components/sections/features"
import FrontendEvolution from "@/components/sections/frontend-evolution"
import Closing from "@/components/sections/closing"
import TransformationStory from "@/components/sections/transformation-story"
import BeforeAfterSection from "@/components/sections/before-after"
import TransformationDeepDive from "@/components/sections/transformation-deep-dive"

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0b0f1a] text-white font-sans">
      <Hero />
      <Fall />
      <Rebirth />
      <Modernization />
      <TransformationStory />
      <TransformationDeepDive />
      <BeforeAfterSection />
      <Features />
      <FrontendEvolution />
      <Closing />
    </main>
  )
}
