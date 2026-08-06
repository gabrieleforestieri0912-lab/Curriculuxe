"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function HowItWorks() {
  const { t } = useLanguage();
  const tHowItWorks = t.howItWorks as Record<string, unknown>;
  const steps = tHowItWorks.steps as Array<Record<string, string>>;

  return (
    <section
      id="how-it-works"
      className="py-24 px-6 gradient-bg"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {tHowItWorks.title as string}
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Tre semplici passaggi per il curriculum perfetto.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step: Record<string, string>, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="text-center"
            >
              <motion.div
                whileInView={{ scale: [0, 1.1, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.2 }}
                className="w-16 h-16 rounded-2xl btn-primary flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white"
              >
                {step.num}
              </motion.div>
              <h3 className="text-xl font-semibold text-magenta-glow mb-3">
                {step.title}
              </h3>
              <p className="text-zinc-400 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
