"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function Features() {
  const { t } = useLanguage();
  const tFeatures = t.features as Record<string, unknown>;

  return (
    <section
      id="features"
      className="py-24 px-6"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {tFeatures.title as string}{" "}
            <span className="text-gradient text-magenta-glow-strong">{tFeatures.titleHighlight as string}</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            {tFeatures.subtitle as string}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(tFeatures.items as Array<Record<string, unknown>>).map((feature: Record<string, unknown>, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="glass-card rounded-2xl p-8 transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ background: `linear-gradient(135deg, ${feature.color}30, ${feature.color}15)` as React.CSSProperties["background"] }}
              >
                <svg
                  className="w-6 h-6"
                  style={{ color: feature.color as string }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d={feature.icon as string}
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-magenta-glow mb-3">
                {feature.title as string}
              </h3>
              <p className="text-zinc-400 leading-relaxed">{feature.desc as string}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
