"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import type { LoopStep } from "./types";
import StepShell from "./StepShell";

interface StepProps {
  step: LoopStep;
  active?: boolean;
}

export default function Step04({ step, active = false }: StepProps) {
  const { t } = useLanguage();
  const demo = (t.loop as Record<string, unknown>).demos as Record<string, unknown>;
  const d = demo.letter as Record<string, string>;

  return (
    <StepShell step={step} active={active}>
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10 bg-white/95 text-slate-900">
        <div className="border-b-2 border-slate-900 pb-3 mb-3">
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide"
          >
            {d.subject}
          </motion.p>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          className="text-sm mb-3"
        >
          {d.greeting}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
          className="text-sm leading-relaxed mb-4"
        >
          {d.body}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
          className="flex flex-wrap items-center gap-2"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-600 px-2.5 py-1 text-[11px] font-semibold">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generata da Atlas
          </span>
          <span className="text-[11px] text-slate-500 font-medium">{d.signature}</span>
        </motion.div>
      </div>
    </StepShell>
  );
}