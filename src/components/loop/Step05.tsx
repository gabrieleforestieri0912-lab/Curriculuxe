"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { LoopStep } from "./types";
import StepShell from "./StepShell";

interface StepProps {
  step: LoopStep;
  active?: boolean;
}

const CATEGORY_STYLES: Record<string, string> = {
  technical: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  behavioral: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  roleFit: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

export default function Step05({ step, active = false }: StepProps) {
  const { t } = useLanguage();
  const demo = (t.loop as Record<string, unknown>).demos as Record<string, unknown>;
  const d = demo.prep as Record<string, unknown>;
  const categories = (d.categories as Record<string, string>) ?? {};
  const questions = (d.questions as Array<Record<string, string>>) ?? [];

  return (
    <StepShell step={step} active={active}>
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10 space-y-3">
        {questions.map((q, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.1 }}
            className="rounded-xl bg-white/[0.03] border border-white/10 p-4"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  CATEGORY_STYLES[q.category] ?? "bg-zinc-500/15 text-zinc-300 border-zinc-500/30"
                }`}
              >
                {categories[q.category] ?? q.category}
              </span>
              <MessageCircle className="w-3.5 h-3.5 text-zinc-600" />
            </div>
            <p className="text-xs text-zinc-200 font-medium leading-relaxed">{q.text}</p>
            <p className="text-[11px] text-zinc-500 italic leading-relaxed mt-2 border-l-2 border-fuchsia-500/40 pl-2.5">
              {q.bullet}
            </p>
          </motion.div>
        ))}
      </div>
    </StepShell>
  );
}
