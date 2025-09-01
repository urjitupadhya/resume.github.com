"use client"

import { motion } from "framer-motion"
import { Clock, Cog } from "lucide-react"
import ParallaxShell from "@/components/ui/parallax-shell"
import NeonAccent from "@/components/ui/neon-accent"
import GridBackground from "@/components/ui/grid-background"

export default function Hero() {
  return (
    <ParallaxShell
      intensity={0.2}
      className="relative flex min-h-[90vh] items-center justify-center overflow-hidden"
      background={
        <div className="absolute inset-0">
          <GridBackground />
          {/* Faded old repo screenshot with cracked effect (placeholder) */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            <img
              src="/old-github-repo-screenshot-faded-and-cracked.png"
              alt="Faded old GitHub repo screenshot"
              className="h-full w-full object-cover"
            />
          </div>
          <NeonAccent />
        </div>
      }
    >
      <section className="relative z-10 px-6 text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="mx-auto flex items-center justify-center gap-3 text-[#00D4FF]">
            <Clock className="h-5 w-5" aria-hidden />
            <Cog className="h-5 w-5" aria-hidden />
          </div>
          <h1 className="text-pretty text-4xl md:text-6xl font-semibold">From Abandonment to Revival</h1>
          <p className="text-balance text-base md:text-lg text-white/80 leading-relaxed">
            The story of a repo with 66k+ stars, once legendary but lost to time.
          </p>
        </motion.div>
      </section>
    </ParallaxShell>
  )
}
