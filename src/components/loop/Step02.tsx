"use client";

import { motion } from "framer-motion";
import { FileText, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { LoopStep } from "./types";
import StepShell from "./StepShell";

interface StepProps {
  step: LoopStep;
  active?: boolean;
}

export default function Step02({ step, active = false }: StepProps) {
  const { t } = useLanguage();
  const demo = (t.loop as Record<string, unknown>).demos as Record<string, unknown>;
  const d = demo.optimize as Record<string, unknown>;
  const keywordTags = (d.keywordTags as string[]) ?? [];

  return (
    <StepShell step={step} active={active}>
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10 space-y-4">
        {/* Pasted job description snippet */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex items-start gap-2.5"
        >
          <FileText className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-400 italic leading-relaxed">“{d.jdSnippet as string}”</p>
        </motion.div>

        {/* Before / After */}
        <div className="grid sm:grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="rounded-xl bg-red-500/[0.06] border border-red-500/20 p-4"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-2">
              {d.beforeLabel as string}
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed">{d.beforeBullet as string}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
            className="rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20 p-4"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-2">
              {d.afterLabel as string}
            </p>
            <p className="text-xs text-zinc-200 leading-relaxed">{d.afterBullet as string}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {keywordTags.map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, ease: "easeOut", delay: 0.35 + i * 0.08 }}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Keywords found badge — appears after the rewritten text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.55 }}
          className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {d.keywordsFound as string}
        </motion.div>
      </div>
    </StepShell>
  );
}
