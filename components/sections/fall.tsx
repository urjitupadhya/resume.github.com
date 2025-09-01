"use client"

import { motion } from "framer-motion"

export default function Fall() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 py-24 md:py-32">
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.4 }}
        className="text-2xl md:text-4xl font-semibold mb-6"
      >
        Once a star, then forgotten
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        viewport={{ once: true }}
        className="text-white/80 leading-relaxed max-w-3xl"
      >
        Coded in vanilla JS with a 2015-era frontend, the project gradually lost momentum. Without maintenance, issues
        piled up and the community drifted away.
      </motion.p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Old code (vanilla JS snippet) */}
        <motion.div
          initial={{ opacity: 0, filter: "grayscale(100%)" }}
          whileInView={{ opacity: 1, filter: "grayscale(0%)" }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
          className="rounded-lg border border-white/10 bg-white/5 p-4"
        >
          <p className="text-xs text-white/60 mb-2">Old Code (Vanilla JS)</p>
          <pre className="text-sm leading-6 overflow-x-auto">
            {`// 2015-style DOM manipulation
var btn = document.getElementById('save');
btn.addEventListener('click', function () {
  var name = document.getElementById('name').value;
  localStorage.setItem('name', name);
  alert('Saved: ' + name);
});`}
          </pre>
        </motion.div>

        {/* Old UI screenshot */}
        <motion.div
          initial={{ opacity: 0, filter: "grayscale(100%)" }}
          whileInView={{ opacity: 1, filter: "grayscale(0%)" }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
          className="relative rounded-lg overflow-hidden border border-white/10"
        >
          <img
            src="/2015-static-frontend-ui-screenshot-outdated.png"
            alt="Old 2015 static frontend UI"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  )
}
