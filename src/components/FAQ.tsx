"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Cpu, CreditCard, ShieldCheck, Briefcase, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { faqIt, faqEn, type FAQCategory } from "@/lib/faq";

const CATEGORIES: Array<{ id: FAQCategory | "all"; icon: typeof Cpu }> = [
  { id: "all", icon: Plus },
  { id: "product", icon: Cpu },
  { id: "pricing", icon: CreditCard },
  { id: "ai", icon: ShieldCheck },
  { id: "jobs", icon: Briefcase },
];

const CATEGORY_LABEL: Record<string, Record<string, string>> = {
  all: { it: "Tutte", en: "All" },
  product: { it: "Prodotto", en: "Product" },
  pricing: { it: "Prezzi e crediti", en: "Pricing & credits" },
  ai: { it: "AI e privacy", en: "AI & privacy" },
  jobs: { it: "Candidature", en: "Applications" },
};

const CATEGORY_CTA: Record<FAQCategory, { href: string; it: string; en: string }> = {
  product: { href: "/analyze", it: "Analizza il tuo CV", en: "Analyze your CV" },
  pricing: { href: "/#pricing", it: "Vedi i piani", en: "See plans" },
  ai: { href: "/privacy", it: "Leggi la Privacy Policy", en: "Read the Privacy Policy" },
  jobs: { href: "/career-market", it: "Esplora il Career Market", en: "Explore the Career Market" },
};

export default function FAQ() {
  const { lang } = useLanguage();
  const locale = lang === "en" ? "en" : "it";
  const items = lang === "en" ? faqEn : faqIt;
  const [category, setCategory] = useState<FAQCategory | "all">("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const visible = items
    .map((item, i) => ({ ...item, index: i }))
    .filter((item) => category === "all" || item.category === category);

  return (
    <section id="faq" className="py-24 px-6 relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.10),transparent_45%)]"
      />
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-fuchsia-400 mb-3 px-3 py-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {locale === "en" ? "Questions, answered concretely" : "Domande vere, risposte concrete"}
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            {locale === "en"
              ? "How scores, credits, AI and applications really work."
              : "Come funzionano davvero score, crediti, AI e candidature."}
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-8" role="tablist" aria-label="FAQ categories">
          {CATEGORIES.map(({ id, icon: Icon }) => {
            const active = category === id;
            const count = id === "all" ? items.length : items.filter((it) => it.category === id).length;
            return (
              <button
                key={id}
                role="tab"
                aria-selected={active}
                onClick={() => { setCategory(id); setOpenIndex(0); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                  active
                    ? "bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-500/40"
                    : "bg-white/5 text-zinc-400 border-white/10 hover:text-white hover:border-white/25"
                }`}
              >
                {id !== "all" && <Icon className="w-3.5 h-3.5" />}
                {CATEGORY_LABEL[id][locale]}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? "bg-fuchsia-500/25" : "bg-white/10"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <motion.div layout className="space-y-3">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((item, pos) => {
              const open = openIndex === pos;
              const cta = CATEGORY_CTA[item.category];
              return (
                <motion.div
                  key={`${category}-${item.index}`}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, delay: Math.min(pos * 0.04, 0.2) }}
                  className={`rounded-2xl border overflow-hidden transition-colors duration-300 ${
                    open
                      ? "bg-gradient-to-b from-fuchsia-500/[0.08] to-transparent border-fuchsia-500/30"
                      : "glass-card border-white/10 hover:border-white/25"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(open ? null : pos)}
                    aria-expanded={open}
                    className="w-full flex items-center gap-4 px-5 sm:px-6 py-4 text-left cursor-pointer"
                  >
                    <span className={`text-xs font-bold tabular-nums ${open ? "text-fuchsia-300" : "text-zinc-600"}`}>
                      {String(pos + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-white font-semibold text-sm sm:text-base">{item.q}</span>
                    <motion.span
                      animate={{ rotate: open ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                      className={`shrink-0 flex items-center justify-center w-7 h-7 rounded-full border transition-colors ${
                        open ? "bg-fuchsia-500/20 border-fuchsia-500/40 text-fuchsia-200" : "border-white/10 text-zinc-500"
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-5 sm:px-6 pb-5 pl-[3.25rem] sm:pl-[3.75rem]">
                          <p className="text-zinc-300 text-sm leading-relaxed">{item.a}</p>
                          <a
                            href={cta.href}
                            className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-fuchsia-300 hover:text-fuchsia-200 transition-colors"
                          >
                            {cta[locale]}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
