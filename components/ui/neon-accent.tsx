"use client"

export default function NeonAccent() {
  return (
    <div
      aria-hidden
      className="absolute -inset-24 blur-3xl opacity-40"
      style={{
        background:
          "radial-gradient(600px circle at 20% 30%, rgba(0,212,255,0.35), transparent 60%), radial-gradient(600px circle at 80% 40%, rgba(155,91,255,0.35), transparent 60%), radial-gradient(700px circle at 50% 80%, rgba(0,255,163,0.35), transparent 60%)",
      }}
    />
  )
}
