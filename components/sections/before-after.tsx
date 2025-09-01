"use client"

import { motion } from "framer-motion"
import BeforeAfter from "@/components/ui/before-after"

export default function BeforeAfterSection() {
  return (
    <section aria-labelledby="before-after-title" className="border-t bg-background">
      <div className="mx-auto w-full max-w-5xl px-6 py-16 md:py-24">
        <header className="mb-8 md:mb-12">
          <h2
            id="before-after-title"
            className="text-pretty text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
          >
            Before & After: Visualizing the Change
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
            Modernization reshaped navigation, performance, and feedback loops—see the difference.
          </p>
        </header>

        <div className="grid gap-12 md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-4"
          >
            <h3 className="text-lg font-medium tracking-tight md:text-xl">Navigation and Information Density</h3>
            <BeforeAfter
              initial={55}
              beforeSrc="/legacy-dashboard-cluttered-navigation.png"
              afterSrc="/modern-dashboard-clean-navigation-design-system.png"
              beforeAlt="Legacy dashboard with cluttered navigation and inconsistent components"
              afterAlt="Modern dashboard with simplified navigation and consistent design system"
            />
            <p className="text-sm leading-6 text-muted-foreground md:text-base">
              We consolidated menus, removed duplicate patterns, and standardized spacing and typography. Critical
              actions are now consistently placed and easy to discover.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-medium tracking-tight md:text-xl">Performance and Feedback</h3>
            <BeforeAfter
              initial={45}
              beforeSrc="/slow-forms-blocking-spinners-timeouts.png"
              afterSrc="/snappy-forms-optimistic-updates-clear-progress.png"
              beforeAlt="Slow forms with blocking spinners and frequent timeouts"
              afterAlt="Snappy interactions with optimistic updates and clear progress indicators"
            />
            <p className="text-sm leading-6 text-muted-foreground md:text-base">
              Optimistic UI and server-driven data trimmed wait times and error loops. Users see immediate updates with
              safe rollback if needed.
            </p>
          </motion.div>

          {/* New comparison added */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-medium tracking-tight md:text-xl">Code Quality & Architecture</h3>
            <BeforeAfter
              initial={50}
              beforeSrc="/legacy-spaghetti-code--no-tests--tight-coupling.png"
              afterSrc="/modular-typed-boundaries--tests--fast-builds.png"
              beforeAlt="Legacy codebase with tight coupling, no tests, and unclear boundaries"
              afterAlt="Modular, typed boundaries with tests and faster, reliable builds"
            />
            <p className="text-sm leading-6 text-muted-foreground md:text-base">
              Typed seams, modest refactors, and targeted tests turned hidden risks into transparent interfaces. The
              result is a calmer codebase—safer changes, predictable builds, and fewer surprises.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
