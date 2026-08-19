"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { LoopStep } from "./types";

interface StepShellProps {
  step: LoopStep;
  /** Whether this step is currently in the viewport */
  active?: boolean;
  /** The visual demo for this step (mockup) */
  children: ReactNode;
}

/**
 * Shared layout for every step of the loop:
 * index + title + headline + description on the left,
 * the visual demo (mockup) on the right. Stacks vertically on mobile.
 */
export default function StepShell({ step, active = false, children }: StepShellProps) {
  return (
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center py-14 first:pt-0 last:pb-0 border-t border-white/5 first:border-t-0">
      {/* Text column */}
      <div className="order-1">
        <motion.span
          animate={active ? { scale: 1.06 } : { scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border transition-colors duration-300 ${
            active
              ? "text-fuchsia-300 border-fuchsia-500/50 bg-fuchsia-500/15"
              : "text-zinc-500 border-white/10 bg-white/[0.03]"
          }`}
        >
          {step.index}
        </motion.span>
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 mt-4">{step.title}</h3>
        <p className="text-lg text-zinc-300 leading-snug mb-3">{step.headline}</p>
        <p className="text-zinc-400 leading-relaxed">{step.description}</p>
      </div>

      {/* Mockup column */}
      <div className="order-2">{children}</div>
    </div>
  );
}
