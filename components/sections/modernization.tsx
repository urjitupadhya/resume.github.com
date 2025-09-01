"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Code2, Server, Layers } from "lucide-react"
import Timeline from "@/components/ui/timeline"

export default function Modernization() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 py-24 md:py-32">
      <motion.h3
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-2xl md:text-4xl font-semibold mb-6"
      >
        From Vanilla JS to Modern Tech
      </motion.h3>

      <p className="text-white/80 leading-relaxed max-w-3xl">
        We rebuilt the codebase with a NestJS backend and a modern React frontend—typed, testable, and scalable.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard
          icon={<Code2 className="h-5 w-5 text-[#00D4FF]" aria-hidden />}
          title="Frontend"
          from="Vanilla JS + 2015 UI"
          to="React + TypeScript + shadcn/ui"
        />
        <InfoCard
          icon={<Server className="h-5 w-5 text-[#9B5BFF]" aria-hidden />}
          title="Backend"
          from="None / adhoc"
          to="NestJS + modular architecture"
        />
        <InfoCard
          icon={<Layers className="h-5 w-5 text-[#00FFA3]" aria-hidden />}
          title="DX"
          from="Manual scripts"
          to="CI, linting, formatting"
        />
      </div>

      <div className="mt-10">
        <Timeline
          startYear={2015}
          endYear={2025}
          milestones={[
            { year: 2015, label: "Launch, vanilla JS" },
            { year: 2018, label: "Stagnation" },
            { year: 2021, label: "Community forks" },
            { year: 2024, label: "Revival plan" },
            { year: 2025, label: "Modern release" },
          ]}
        />
      </div>
    </section>
  )
}

function InfoCard({
  icon,
  title,
  from,
  to,
}: {
  icon: React.ReactNode
  title: string
  from: string
  to: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="rounded-lg border border-white/10 bg-white/5 p-4"
    >
      <div className="flex items-center gap-2">
        {icon}
        <h4 className="font-medium">{title}</h4>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-md bg-white/5 p-2">
          <p className="text-white/60">Old</p>
          <p className="text-white/90">{from}</p>
        </div>
        <div className="rounded-md bg-white/10 p-2">
          <p className="text-white/60">New</p>
          <p className="text-white/90">{to}</p>
        </div>
      </div>
    </motion.div>
  )
}
