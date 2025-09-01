"use client"

import { motion } from "framer-motion"

export default function TransformationDeepDive() {
  return (
    <section aria-labelledby="transformation-deep-dive-title" className="border-t bg-background">
      <div className="mx-auto w-full max-w-5xl px-6 py-16 md:py-24">
        <header className="mb-8 md:mb-12">
          <h2
            id="transformation-deep-dive-title"
            className="text-pretty text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
          >
            Deep Dive: How We Turned Risk Into Momentum
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
            We didn’t “rewrite.” We iterated. Each change shrank uncertainty: stabilize, isolate, then modernize. This
            is what that looked like in practice—step by step, with proof at every milestone.
          </p>
        </header>

        {/* Frame 1: Stabilize the core */}
        <div className="grid gap-10 md:grid-cols-2 md:gap-12">
          <motion.article
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            className="flex flex-col gap-4 text-sm leading-6 text-foreground md:text-base md:leading-7"
          >
            <h3 className="text-lg font-medium tracking-tight md:text-xl">1) Stabilize the Core</h3>
            <p className="text-pretty">
              We started with the foundation: flaky builds and untyped boundaries. Smoke tests covered critical flows,
              build caching reduced regression cost, and a “no surprise” CI surfaced failures early. This made the next
              steps boring—in a good way.
            </p>
            <ul className="ml-4 list-disc space-y-2 text-muted-foreground">
              <li>Introduce smoke tests for top revenue paths.</li>
              <li>Cache dependencies and split pipelines for faster feedback loops.</li>
              <li>Pin versions and document the “golden path” for contributors.</li>
            </ul>
          </motion.article>

          <motion.figure
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            className="rounded-lg border bg-card p-4"
          >
            <img
              src="/legacy-build-logs-with-flaky-tests.png"
              alt="Legacy build logs with frequent flakes and timeouts"
              className="h-auto w-full rounded-md"
            />
            <figcaption className="mt-3 text-xs text-muted-foreground">
              Before: brittle, opaque builds. After: deterministic CI with early signal.
            </figcaption>
          </motion.figure>
        </div>

        {/* Frame 2: Carve typed seams */}
        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-12">
          <motion.figure
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            className="rounded-lg border bg-card p-4"
          >
            <img
              src="/spaghetti-modules-with-tight-coupling.png"
              alt="Tightly coupled modules with unclear interfaces"
              className="h-auto w-full rounded-md"
            />
            <figcaption className="mt-3 text-xs text-muted-foreground">
              Before: implicit contracts, side effects everywhere.
            </figcaption>
          </motion.figure>

          <motion.article
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            className="flex flex-col gap-4 text-sm leading-6 text-foreground md:text-base md:leading-7"
          >
            <h3 className="text-lg font-medium tracking-tight md:text-xl">2) Carve Typed Seams</h3>
            <p className="text-pretty">
              We wrapped risky areas with typed boundaries, clarifying inputs/outputs and reducing blast radius. The
              refactor surface became explicit—tests and logs made drift visible.
            </p>
            <ul className="ml-4 list-disc space-y-2 text-muted-foreground">
              <li>Define interfaces for legacy adapters and gateways.</li>
              <li>Log at seams and assert invariants to catch regressions.</li>
              <li>Refactor incrementally, merging behind feature flags.</li>
            </ul>
          </motion.article>
        </div>

        {/* Frame 3: Design system adoption */}
        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-12">
          <motion.article
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            className="flex flex-col gap-4 text-sm leading-6 text-foreground md:text-base md:leading-7"
          >
            <h3 className="text-lg font-medium tracking-tight md:text-xl">3) Design System Adoption</h3>
            <p className="text-pretty">
              A cohesive design system replaced one-off UI. Accessibility, spacing, and typography became consistent,
              and contributors shipped faster with fewer surprises.
            </p>
            <ul className="ml-4 list-disc space-y-2 text-muted-foreground">
              <li>Audit components and consolidate to shared primitives.</li>
              <li>Document usage with examples and lint rules.</li>
              <li>Use feature flags to progressively roll out new UI.</li>
            </ul>
          </motion.article>

          <motion.figure
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            className="rounded-lg border bg-card p-4"
          >
            <img
              src="/modern-design-system-clean-components.png"
              alt="Modern design system with clean, consistent components"
              className="h-auto w-full rounded-md"
            />
            <figcaption className="mt-3 text-xs text-muted-foreground">
              After: shared primitives, consistent UX, and faster iteration.
            </figcaption>
          </motion.figure>
        </div>
      </div>
    </section>
  )
}
