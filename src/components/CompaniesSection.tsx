"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { navHref } from "@/lib/seo";
import { jobCatalog } from "@/lib/jobs";

/**
 * Le aziende mostrate sono esattamente quelle con almeno un annuncio nel
 * Career Market: niente loghi di terze parti, niente claim di utilizzo.
 */
export default function CompaniesSection() {
  const { t, lang } = useLanguage();
  const tCompanies = t.companies as Record<string, string>;

  const companies = useMemo(
    () => [...new Set(jobCatalog.map((job) => job.company))],
    []
  );

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
        <Link
          href={navHref(lang, "/career-market")}
          className="mt-4 inline-block text-sm font-semibold text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
        >
          {tCompanies.cta as string} →
        </Link>
      </motion.div>

      <div
        className="marquee-viewport"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        } as React.CSSProperties}
      >
        <div className="marquee-track" style={{ "--marquee-duration": "55s" } as React.CSSProperties}>
          {[...companies, ...companies].map((name, i) => (
            <div key={`${name}-${i}`} className="flex items-center shrink-0 px-10 sm:px-12 py-4">
              <span className="text-lg sm:text-xl font-bold text-zinc-500 hover:text-zinc-200 transition-colors whitespace-nowrap">
                {name}
              </span>
              <span
                aria-hidden="true"
                className="ml-10 sm:ml-12 w-1.5 h-1.5 rounded-full bg-fuchsia-500/50 shrink-0"
              />
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