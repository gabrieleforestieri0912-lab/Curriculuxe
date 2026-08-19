"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { LoopStep } from "./types";
import StepShell from "./StepShell";

interface StepProps {
  step: LoopStep;
  active?: boolean;
}

interface Offer {
  company: string;
  role: string;
  score: number;
  tags: string[];
}

function OfferCard({ offer, delay }: { offer: Offer; delay: number }) {
  const color = offer.score >= 85 ? "text-emerald-400" : offer.score >= 65 ? "text-amber-400" : "text-zinc-400";
  const circumference = 2 * Math.PI * 14;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
      className="flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/10 p-3"
    >
      <div className="relative w-9 h-9 shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
          <motion.circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: circumference - (circumference * offer.score) / 100 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: delay + 0.2 }}
            className={color}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-[10px] font-bold ${color}`}>{offer.score}</span>
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-white truncate">{offer.role}</p>
        <p className="text-[10px] text-zinc-500 truncate">{offer.company}</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {offer.tags.map((tag) => (
            <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Step01({ step, active = false }: StepProps) {
  const { t } = useLanguage();
  const demo = (t.loop as Record<string, unknown>).demos as Record<string, unknown>;
  const d = demo.discover as Record<string, unknown>;
  const offers = (d.offers as Offer[]) ?? [];

  return (
    <StepShell step={step} active={active}>
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-fuchsia-300">
            <Sparkles className="w-3.5 h-3.5" />
            {d.label as string}
          </span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{d.scoreLabel as string}</span>
        </div>
        <div className="space-y-2.5">
          {offers.map((offer, i) => (
            <OfferCard key={offer.company} offer={offer} delay={0.1 + i * 0.1} />
          ))}
        </div>
      </div>
    </StepShell>
  );
}