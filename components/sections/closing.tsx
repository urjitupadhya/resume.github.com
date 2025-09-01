"use client"

import { motion } from "framer-motion"
import GridBackground from "@/components/ui/grid-background"

export default function Closing() {
  return (
    <section className="relative overflow-hidden px-6 py-24 md:py-32">
      <div className="absolute inset-0">
        <GridBackground animate />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
        <motion.h3
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-2xl md:text-4xl font-semibold mb-4"
        >
          Not just revived, but reimagined
        </motion.h3>
        <p className="text-white/80 leading-relaxed mb-8">
          A repo reborn with AI, modern frameworks, and endless possibilities.
        </p>

        <motion.a
          href="#"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ boxShadow: "0 0 40px rgba(0,212,255,0.35)", y: -2 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className="inline-block rounded-full bg-[#00D4FF] px-6 py-3 font-medium text-black"
          aria-label="Explore the New Repo"
        >
          Explore the New Repo
        </motion.a>
      </div>
    </section>
  )
}
