"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface TourStep {
  /** CSS selectors, first one currently visible wins (used for responsive fallbacks) */
  targets: string[];
  title: string;
  description: string;
}

interface TourLabels {
  next: string;
  prev: string;
  skip: string;
  finish: string;
}

interface DashboardTourProps {
  steps: TourStep[];
  open: boolean;
  labels: TourLabels;
  onClose: () => void;
}

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

const TOOLTIP_WIDTH = 320;
const TOOLTIP_HEIGHT = 190;

/**
 * Lightweight guided tour for the dashboard: dims the page with a spotlight
 * around the current step's target and shows a tooltip with navigation.
 * No external dependencies — built with framer-motion only.
 */
export default function DashboardTour({ steps, open, labels, onClose }: DashboardTourProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [tipPos, setTipPos] = useState<"bottom" | "top">("bottom");
  const timers = useRef<number[]>([]);

  const getTarget = useCallback(
    (index: number): Element | null => {
      const step = steps[index];
      if (!step) return null;
      for (const selector of step.targets) {
        const el = document.querySelector(selector);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) return el;
        }
      }
      return null;
    },
    [steps]
  );

  const measure = useCallback(
    (index: number) => {
      const el = getTarget(index);
      if (!el) return;
      const r = el.getBoundingClientRect();
      setRect({ left: r.left, top: r.top, width: r.width, height: r.height });
      const spaceBelow = window.innerHeight - r.bottom;
      const spaceAbove = r.top;
      setTipPos(spaceBelow >= 140 || spaceBelow >= spaceAbove ? "bottom" : "top");
    },
    [getTarget]
  );

  const goTo = useCallback(
    (index: number) => {
      const el = getTarget(index);
      if (!el) {
        // Target not rendered/visible: skip to the next step.
        if (index < steps.length - 1) goTo(index + 1);
        return;
      }
      setStepIndex(index);
      const r = el.getBoundingClientRect();
      if (r.top < 0 || r.bottom > window.innerHeight) {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
        const t = window.setTimeout(() => measure(index), 450);
        timers.current.push(t);
      } else {
        measure(index);
      }
    },
    [getTarget, measure, steps.length]
  );

  // Open/close lifecycle
  useEffect(() => {
    if (open) {
      goTo(0);
    } else {
      setRect(null);
    }
    return () => timers.current.forEach((t) => window.clearTimeout(t));
  }, [open, goTo]);

  // Re-measure the current target on scroll/resize
  useEffect(() => {
    if (!open) return;
    const reMeasure = () => measure(stepIndex);
    window.addEventListener("scroll", reMeasure, true);
    window.addEventListener("resize", reMeasure);
    return () => {
      window.removeEventListener("scroll", reMeasure, true);
      window.removeEventListener("resize", reMeasure);
    };
  }, [open, stepIndex, measure]);

  // Keyboard: Esc closes, arrows navigate
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, stepIndex, steps.length, onClose]);

  const next = () => {
    if (stepIndex < steps.length - 1) goTo(stepIndex + 1);
    else onClose();
  };
  const prev = () => {
    if (stepIndex > 0) goTo(stepIndex - 1);
  };

  const isLast = stepIndex >= steps.length - 1;
  const tooltipWidth = Math.min(TOOLTIP_WIDTH, window.innerWidth - 24);
  const tipLeft = rect
    ? Math.min(Math.max(rect.left + rect.width / 2 - tooltipWidth / 2, 12), window.innerWidth - tooltipWidth - 12)
    : 12;
  const tipTop = rect
    ? tipPos === "bottom"
      ? rect.top + rect.height + 12
      : Math.max(rect.top - TOOLTIP_HEIGHT - 12, 12)
    : 12;

  return (
    <AnimatePresence>
      {open && rect && steps.length > 0 && (
        <>
          {/* Dim layer (blocks interaction) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] bg-black/70"
          />

          {/* Spotlight hole around the target */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed z-[90] pointer-events-none rounded-2xl border-2 border-indigo-400/80"
            style={{
              left: rect.left - 4,
              top: rect.top - 4,
              width: rect.width + 8,
              height: rect.height + 8,
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.72)",
            }}
          />

          {/* Tooltip */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="tour-title"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="fixed z-[100] w-[min(320px,calc(100vw-24px))] glass-card rounded-2xl p-5 border border-white/10"
            style={{ left: tipLeft, top: tipTop }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                {stepIndex + 1} / {steps.length}
              </span>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
                aria-label={labels.skip}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p id="tour-title" className="text-white font-semibold mb-1.5">{steps[stepIndex]?.title}</p>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">{steps[stepIndex]?.description}</p>

            <div className="flex items-center justify-between gap-2">
              <button
                onClick={prev}
                disabled={stepIndex === 0}
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors px-2 py-1.5"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                {labels.prev}
              </button>
              <button
                onClick={next}
                className="flex items-center gap-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full transition-colors"
              >
                {isLast ? labels.finish : labels.next}
                {!isLast && <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
