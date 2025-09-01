"use client"

import { useId, useRef, useState } from "react"

type BeforeAfterProps = {
  beforeSrc: string
  afterSrc: string
  beforeAlt: string
  afterAlt: string
  initial?: number // 0..100
}

export default function BeforeAfter({ beforeSrc, afterSrc, beforeAlt, afterAlt, initial = 50 }: BeforeAfterProps) {
  const [value, setValue] = useState(Math.min(100, Math.max(0, initial)))
  const id = useId()
  const containerRef = useRef<HTMLDivElement | null>(null)

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border bg-muted"
        aria-label="Before and after comparison"
        role="group"
      >
        {/* Before image (full) */}
        <img
          src={beforeSrc || "/placeholder.svg?height=720&width=1280&query=before"}
          alt={beforeAlt}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />

        {/* After image (clipped by slider value) */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ width: `${value}%`, overflow: "hidden" }}
          aria-hidden="true"
        >
          <img
            src={afterSrc || "/placeholder.svg?height=720&width=1280&query=after"}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        {/* Divider handle */}
        <div
          className="pointer-events-none absolute inset-y-0"
          style={{ left: `calc(${value}% - 1px)` }}
          aria-hidden="true"
        >
          <div className="h-full w-0.5 bg-foreground/70" />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <label htmlFor={id} className="text-xs text-muted-foreground">
          Drag to compare
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
          aria-label="Before and after slider"
        />
      </div>

      <p className="sr-only">
        Before image: {beforeAlt}. After image: {afterAlt}.
      </p>
    </div>
  )
}
