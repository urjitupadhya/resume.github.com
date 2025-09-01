"use client"

import React from "react"

export default function ParallaxShell({
  children,
  background,
  intensity = 0.15,
  className,
}: {
  children: React.ReactNode
  background?: React.ReactNode
  intensity?: number
  className?: string
}) {
  const [offset, setOffset] = React.useState(0)

  React.useEffect(() => {
    const onScroll = () => setOffset(window.scrollY || 0)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const translate = `translate3d(0, ${-(offset * intensity)}px, 0)`

  return (
    <div className={className}>
      {background && (
        <div
          className="pointer-events-none absolute inset-0 will-change-transform"
          style={{ transform: translate }}
          aria-hidden
        >
          {background}
        </div>
      )}
      <div className="relative">{children}</div>
    </div>
  )
}
