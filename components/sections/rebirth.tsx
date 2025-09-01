"use client"

import { motion } from "framer-motion"
import { Users, Lightbulb } from "lucide-react"
import ShatterReveal from "@/components/ui/shatter-reveal"

export default function Rebirth() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 py-24 md:py-32">
      <div className="flex items-start justify-between gap-8 flex-col md:flex-row">
        <div className="max-w-2xl space-y-4">
          <motion.h3
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl font-semibold"
          >
            Taking responsibility to revive
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-white/80 leading-relaxed"
          >
            Our team stepped in to preserve the core idea and rebuild it with a modern foundation—built for the
            community, by the community.
          </motion.p>
          <div className="flex items-center gap-4 text-[#00FFA3]">
            <Users className="h-5 w-5" aria-hidden />
            <Lightbulb className="h-5 w-5" aria-hidden />
          </div>
        </div>

        <div className="w-full md:w-[420px]">
          <ShatterReveal
            fromSrc="/faded-old-repo-screenshot.png"
            to={
              <div
                aria-label="Modern repo glowing logo"
                className="flex h-48 items-center justify-center rounded-xl bg-gradient-to-tr from-[#00D4FF] via-[#9B5BFF] to-[#00FFA3] shadow-[0_0_40px_rgba(0,212,255,0.35)]"
              >
                <span className="text-2xl font-semibold tracking-wide">Repo v2</span>
              </div>
            }
          />
        </div>
      </div>
    </section>
  )
}
