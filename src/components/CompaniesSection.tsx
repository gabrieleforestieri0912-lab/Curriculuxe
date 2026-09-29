"use client";

import { motion, useMotionValue, useTransform, useAnimationFrame } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import CompanyLogo from "./CompanyLogos";

const companyNames: string[] = [
  "Google",
  "Apple",
  "Microsoft",
  "Amazon",
  "Meta",
  "Salesforce",
  "Spotify",
  "Airbnb",
  "GitHub",
  "LinkedIn",
  "Slack",
  "Discord",
  "Shopify",
];

export default function CompaniesSection() {
  const { t } = useLanguage();
  const tCompanies = t.companies as Record<string, string>;

  // Marquee guidato via rAF (non dipende dalle CSS animation):
  // scorre da 0 a -50% in loop sulla lista duplicata, senza mai fermarsi.
  const x = useMotionValue(0);
  useAnimationFrame((_, delta) => {
    x.set(x.get() - (delta / 1000) * 1.4);
  });
  const loopX = useTransform(x, (v) => `${-((((-v) % 50) + 50) % 50)}%`);

  return (
    <section
      className="py-24 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 px-6"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          {tCompanies.title as string}
        </h2>
        <p className="text-zinc-400 max-w-xl mx-auto">
          {tCompanies.subtitle as string}
        </p>
      </motion.div>

      <div
        className="overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
        } as React.CSSProperties}
      >
        <motion.div
          className="flex w-max will-change-transform"
          style={{ x: loopX }}
        >
            {[...companyNames, ...companyNames].map((name, i) => (
              <div
                key={i}
                className="flex items-center px-16 py-6"
              >
                <CompanyLogo name={name} />
              </div>
            ))}
          </motion.div>
        </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-10 text-center px-6"
      >
        <p className="text-zinc-500 text-sm">
          +5000 candidati assunti con il nostro curriculum negli ultimi 12 mesi
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-4">
          {[tCompanies.atsBadge, tCompanies.multiLangBadge, tCompanies.seoBadge].map((label) => (
            <div key={label} className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-zinc-400 text-sm">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
