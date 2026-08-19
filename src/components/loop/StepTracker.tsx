"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface StepTrackerProps {
  index: number;
  onActive: (index: number) => void;
  children: ReactNode;
}

/**
 * Wraps a loop step: fades/slides it in on scroll (only transform + opacity)
 * and reports to the parent which step is currently in the viewport.
 */
export default function StepTracker({ index, onActive, children }: StepTrackerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
