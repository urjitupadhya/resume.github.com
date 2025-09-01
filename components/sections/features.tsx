"use client"

import { motion } from "framer-motion"
import { FileText, Brain, ShieldCheck, BarChart3, UserCircle2, Sparkles } from "lucide-react"

const features = [
  { title: "Resume builder from GitHub", icon: <FileText className="h-5 w-5" aria-hidden />, color: "#00D4FF" },
  { title: "Dynamic dashboard", icon: <BarChart3 className="h-5 w-5" aria-hidden />, color: "#9B5BFF" },
  { title: "ATS score checker", icon: <ShieldCheck className="h-5 w-5" aria-hidden />, color: "#00FFA3" },
  { title: "AI-powered enhancer", icon: <Brain className="h-5 w-5" aria-hidden />, color: "#00D4FF" },
  { title: "Professional templates", icon: <Sparkles className="h-5 w-5" aria-hidden />, color: "#9B5BFF" },
  { title: "Google authentication & profile", icon: <UserCircle2 className="h-5 w-5" aria-hidden />, color: "#00FFA3" },
]

export default function Features() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 py-24 md:py-32">
      <motion.h3
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-2xl md:text-4xl font-semibold mb-6"
      >
        Features Transformation
      </motion.h3>

      <p className="text-white/80 leading-relaxed">
        From basic static functionality to a modern, AI‑augmented experience.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-lg border border-white/10 bg-white/5 p-4"
          >
            <div className="flex items-center gap-2">
              <span className="rounded-md p-2" style={{ background: `${f.color}20`, color: f.color }}>
                {f.icon}
              </span>
              <h4 className="font-medium">{f.title}</h4>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md bg-white/5 p-2">
                <p className="text-white/60">Old</p>
                <p className="text-white/90">Basic static functionality</p>
              </div>
              <div className="rounded-md bg-white/10 p-2">
                <p className="text-white/60">New</p>
                <p className="text-white/90">Upgraded, interactive, and intelligent</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
