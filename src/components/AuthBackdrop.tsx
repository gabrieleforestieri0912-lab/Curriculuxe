"use client";

import { motion } from "framer-motion";

interface MiniCVConfig {
  id: string;
  className: string;
  rotate: number;
  duration: number;
  delay: number;
  opacity: string;
  score: string;
  bar: string;
}

const CARDS: MiniCVConfig[] = [
  { id: "cv-1", className: "left-[3%] top-[10%] w-32 sm:w-40", rotate: -8, duration: 7, delay: 0, opacity: "opacity-90", score: "bg-emerald-500/80", bar: "bg-emerald-500/60" },
  { id: "cv-2", className: "right-[4%] top-[14%] w-32 sm:w-40 hidden md:block", rotate: 7, duration: 8, delay: 0.8, opacity: "opacity-90", score: "bg-fuchsia-500/80", bar: "bg-fuchsia-500/60" },
  { id: "cv-3", className: "left-[7%] bottom-[9%] w-32 sm:w-40 hidden md:block", rotate: 6, duration: 9, delay: 0.4, opacity: "opacity-80", score: "bg-indigo-500/80", bar: "bg-indigo-500/60" },
  { id: "cv-4", className: "right-[8%] bottom-[12%] w-32 sm:w-40 hidden md:block", rotate: -6, duration: 7.5, delay: 1.1, opacity: "opacity-80", score: "bg-amber-500/80", bar: "bg-amber-500/60" },
  { id: "cv-5", className: "left-[40%] top-[3%] w-28 hidden lg:block", rotate: -3, duration: 10, delay: 0.2, opacity: "opacity-60", score: "bg-sky-500/80", bar: "bg-sky-500/60" },
  { id: "cv-6", className: "right-[36%] bottom-[4%] w-28 hidden lg:block", rotate: 4, duration: 9.5, delay: 1.4, opacity: "opacity-60", score: "bg-rose-500/80", bar: "bg-rose-500/60" },
];

function MiniCV({ card }: { card: MiniCVConfig }) {
  return (
    <motion.div
      initial={{ y: 0, rotate: card.rotate, opacity: 0 }}
      animate={{ y: [0, -16, 0], rotate: card.rotate, opacity: 1 }}
      transition={{ y: { duration: card.duration, repeat: Infinity, ease: "easeInOut", delay: card.delay }, opacity: { duration: 1, delay: card.delay } }}
      className={`absolute ${card.className} ${card.opacity}`}
    >
      <div className="aspect-[3/4] w-full rounded-[5px] bg-[#f8f7f4] shadow-2xl shadow-black/60 select-none overflow-hidden p-2.5 flex flex-col">
        <div className="h-1 rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-indigo-500" />
        <div className="mt-2 flex items-center gap-1.5">
          <div className="h-6 w-6 shrink-0 rounded-full bg-zinc-300" />
          <div className="flex-1 space-y-1">
            <div className="h-1.5 w-4/5 rounded-full bg-zinc-300" />
            <div className="h-1 w-3/5 rounded-full bg-zinc-200" />
          </div>
          <div className={`h-4 w-7 shrink-0 rounded ${card.score}`} />
        </div>
        <div className="mt-2 space-y-1">
          <div className="h-1 w-full rounded-full bg-zinc-200" />
          <div className="h-1 w-11/12 rounded-full bg-zinc-200" />
          <div className="h-1 w-4/5 rounded-full bg-zinc-200" />
          <div className="h-1 w-full rounded-full bg-zinc-200" />
          <div className="h-1 w-3/5 rounded-full bg-zinc-200" />
        </div>
        <div className="mt-2 flex gap-1">
          <div className="h-3 w-9 rounded-full bg-zinc-200" />
          <div className="h-3 w-7 rounded-full bg-zinc-200" />
          <div className="h-3 w-10 rounded-full bg-zinc-200" />
        </div>
        <div className="mt-2 space-y-1">
          <div className="h-1 w-full rounded-full bg-zinc-200" />
          <div className="h-1 w-4/5 rounded-full bg-zinc-200" />
          <div className="h-1 w-3/5 rounded-full bg-zinc-200" />
        </div>
        <div className="mt-auto h-1.5 rounded-full bg-zinc-200 overflow-hidden">
          <div className={`h-full w-4/5 rounded-full ${card.bar}`} />
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Sfondo animato per le pagine di accesso: scheletri di CV anonimi
 * (solo linee, nessuna scritta) fluttuanti su base scura. Non interattivo.
 */
export default function AuthBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(168,85,247,0.22),transparent_40%),radial-gradient(circle_at_85%_80%,rgba(232,121,249,0.14),transparent_40%),radial-gradient(circle_at_60%_50%,rgba(99,102,241,0.10),transparent_45%)]" />
      {CARDS.map((card) => (
        <MiniCV key={card.id} card={card} />
      ))}
    </div>
  );
}
