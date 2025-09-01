"use client"

import React from "react"
import { motion, useScroll, useTransform } from "framer-motion"

type Milestone = { year: number; label: string }

export default function Timeline({
  startYear,
  endYear,
  milestones,
}: {
  startYear: number
  endYear: number
  milestones: Milestone[]
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <div ref={ref} className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between text-sm text-white/70">
        <span>{startYear}</span>
        <span>{endYear}</span>
      </div>
      <div className="relative mt-4 h-2 w-full rounded-full bg-white/10">
        <motion.div style={{ width }} className="absolute left-0 top-0 h-2 rounded-full">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-[#00D4FF] via-[#9B5BFF] to-[#00FFA3]" />
        </motion.div>
      </div>

      <div className="relative mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        {milestones.map((m) => (
          <motion.div
            key={m.year}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="rounded-md border border-white/10 bg-white/5 p-3"
          >
            <div className="text-xs text-white/60">{m.year}</div>
            <div className="text-sm">{m.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
