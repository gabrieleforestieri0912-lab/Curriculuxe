"use client";

import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export default function AnimatedCounter({ value, suffix = "", decimals = 0, className = "" }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => `${latest.toFixed(decimals)}${suffix}`);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;

    const controls = animate(count, value, {
      duration: 1.4,
      ease: "easeOut",
    });

    return controls.stop;
  }, [count, inView, value]);

  return <motion.span ref={ref} className={className}>{rounded}</motion.span>;
}
