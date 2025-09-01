"use client"

import type React from "react"
import { motion } from "framer-motion"

export default function ShatterReveal({
  fromSrc,
  to,
}: {
  fromSrc: string
  to: React.ReactNode
}) {
  const shards = Array.from({ length: 6 })
  return (
    <div className="relative h-48 overflow-hidden rounded-xl border border-white/10 bg-white/5">
      <div className="absolute inset-0">
        {shards.map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 1, y: 0, rotate: 0 }}
            whileInView={{ opacity: 0, y: (i % 2 === 0 ? -1 : 1) * 40, rotate: (i % 2 === 0 ? -1 : 1) * 6 }}
            transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="absolute inset-0"
            style={{
              clipPath: `polygon(${(i * 100) / 6}% 0, ${((i + 1) * 100) / 6}% 0, ${((i + 1) * 100) / 6}% 100%, ${(i * 100) / 6}% 100%)`,
            }}
          >
            <img
              src={fromSrc || "/placeholder.svg"}
              alt="Old repo faded screenshot"
              className="h-full w-full object-cover"
            />
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        viewport={{ once: true }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {to}
      </motion.div>
    </div>
  )
}
