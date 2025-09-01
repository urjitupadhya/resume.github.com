"use client"

import React from "react"
import { motion } from "framer-motion"

export default function BeforeAfterSlider({
  before,
  after,
}: {
  before: { src: string; alt: string; label?: string }
  after: { src: string; alt: string; label?: string }
}) {
  const [value, setValue] = React.useState(50)

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-white/10">
      <div className="absolute z-10 left-0 top-0 m-2 rounded bg-black/60 px-2 py-1 text-xs">{before.label}</div>
      <div className="absolute z-10 right-0 top-0 m-2 rounded bg-black/60 px-2 py-1 text-xs">{after.label}</div>

      <img src={before.src || "/placeholder.svg"} alt={before.alt} className="block h-[360px] w-full object-cover" />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${value}%` }}
        aria-hidden
      >
        <img src={after.src || "/placeholder.svg"} alt="" className="block h-[360px] w-full object-cover" />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-black/40 px-4 py-3">
        <input
          className="w-full"
          type="range"
          min={0}
          max={100}
          value={value}
          aria-label="Before after slider"
          onChange={(e) => setValue(Number(e.target.value))}
        />
        <motion.div
          key={value}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-white/70 w-16 text-right"
        >
          {value}%
        </motion.div>
      </div>
    </div>
  )
}
