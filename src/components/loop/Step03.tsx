"use client";

import { motion, useInView } from "framer-motion";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { LoopStep } from "./types";
import StepShell from "./StepShell";

interface StepProps {
  step: LoopStep;
  active?: boolean;
}

export default function Step03({ step, active = false }: StepProps) {
  const { t } = useLanguage();
  const demo = (t.loop as Record<string, unknown>).demos as Record<string, unknown>;
  const d = demo.review as Record<string, unknown>;
  const feedback = (d.feedback as Array<Record<string, string>>) ?? [];
  const target = Number(d.score) || 0;

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(0);

  // Count-up to the target score once the mockup enters the viewport.
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const duration = 800;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(progress * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <StepShell step={step} active={active}>
      <div ref={ref} className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10">
        <div className="flex items-center gap-5 mb-5">
          {/* Overall score ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative w-24 h-24 shrink-0 flex items-center justify-center"
          >
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke="url(#loopScoreGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="100"
                strokeDashoffset={100 - display}
              />
              <defs>
                <linearGradient id="loopScoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-white">{display}</span>
              <span className="text-[9px] text-zinc-500 font-bold uppercase">/ {d.scoreMax as string}</span>
            </div>
          </motion.div>
          <div>
            <p className="text-sm font-semibold text-white">{d.statusLabel as string}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{d.statusDesc as string}</p>
          </div>
        </div>

        {/* Per-section feedback */}
        <div className="space-y-2.5">
          {feedback.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 + i * 0.08 }}
              className="flex items-center gap-2.5 text-xs"
            >
              {row.type === "ok" ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span className="text-zinc-500 font-medium w-24 shrink-0">{row.section}</span>
              <span className={row.type === "ok" ? "text-zinc-300" : "text-amber-200"}>{row.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </StepShell>
  );
}
