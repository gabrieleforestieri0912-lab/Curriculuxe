"use client";

import { motion } from "framer-motion";
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

  return (
    <section className="py-16 sm:py-20 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 px-6"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          {tCompanies.title as string}
        </h2>
        <p className="text-zinc-400 max-w-xl mx-auto">
          {tCompanies.subtitle as string}
        </p>
      </motion.div>

      <div
        className="marquee-viewport"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        } as React.CSSProperties}
      >
        <div className="marquee-track" style={{ "--marquee-duration": "45s" } as React.CSSProperties}>
          {[...companyNames, ...companyNames].map((name, i) => (
            <div key={i} className="flex items-center px-14 sm:px-16 py-4">
              <CompanyLogo name={name} />
            </div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-center px-6"
      >
          <p className="text-zinc-500 text-sm">
            {tCompanies.statLine as string}
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
