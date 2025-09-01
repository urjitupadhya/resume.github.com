"use client"

export default function GridBackground({ animate = false }: { animate?: boolean }) {
  return (
    <div className="absolute inset-0 bg-[#0b0f1a]">
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          backgroundPosition: "center",
          animation: animate ? "gridPulse 6s ease-in-out infinite" : undefined,
        }}
      />
      <style jsx>{`
        @keyframes gridPulse {
          0%, 100% { opacity: 0.18; }
          50% { opacity: 0.35; }
        }
      `}</style>
    </div>
  )
}
