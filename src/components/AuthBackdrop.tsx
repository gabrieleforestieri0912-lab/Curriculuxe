"use client";

import { motion } from "framer-motion";

interface MiniCVConfig {
  id: string;
  className: string;
  rotate: number;
  score: string;
  scoreClasses: string;
  avatar: string;
  bar: string;
  barWidth: string;
  duration: number;
  delay: number;
  opacity: string;
}

const CARDS: MiniCVConfig[] = [
  {
    id: "cv-1",
    className: "left-[3%] top-[10%] w-44 sm:w-52",
    rotate: -8,
    score: "92",
    scoreClasses: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    avatar: "from-emerald-400 to-teal-600",
    bar: "bg-emerald-400/70",
    barWidth: "w-[92%]",
    duration: 7,
    delay: 0,
    opacity: "opacity-70",
  },
  {
    id: "cv-2",
    className: "right-[4%] top-[14%] w-44 sm:w-52 hidden md:block",
    rotate: 7,
    score: "88",
    scoreClasses: "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30",
    avatar: "from-fuchsia-400 to-purple-600",
    bar: "bg-fuchsia-400/70",
    barWidth: "w-[88%]",
    duration: 8,
    delay: 0.8,
    opacity: "opacity-70",
  },
  {
    id: "cv-3",
    className: "left-[7%] bottom-[9%] w-44 sm:w-52 hidden md:block",
    rotate: 6,
    score: "95",
    scoreClasses: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
    avatar: "from-indigo-400 to-blue-600",
    bar: "bg-indigo-400/70",
    barWidth: "w-[95%]",
    duration: 9,
    delay: 0.4,
    opacity: "opacity-60",
  },
  {
    id: "cv-4",
    className: "right-[8%] bottom-[12%] w-44 sm:w-52 hidden md:block",
    rotate: -6,
    score: "81",
    scoreClasses: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    avatar: "from-amber-400 to-orange-600",
    bar: "bg-amber-400/70",
    barWidth: "w-[81%]",
    duration: 7.5,
    delay: 1.1,
    opacity: "opacity-60",
  },
  {
    id: "cv-5",
    className: "left-[40%] top-[3%] w-40 hidden lg:block",
    rotate: -3,
    score: "90",
    scoreClasses: "bg-sky-500/20 text-sky-300 border border-sky-500/30",
    avatar: "from-sky-400 to-cyan-600",
    bar: "bg-sky-400/70",
    barWidth: "w-[90%]",
    duration: 10,
    delay: 0.2,
    opacity: "opacity-40",
  },
  {
    id: "cv-6",
    className: "right-[36%] bottom-[4%] w-40 hidden lg:block",
    rotate: 4,
    score: "87",
    scoreClasses: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
    avatar: "from-rose-400 to-pink-600",
    bar: "bg-rose-400/70",
    barWidth: "w-[87%]",
    duration: 9.5,
    delay: 1.4,
    opacity: "opacity-40",
  },
];

function MiniCV({ card }: { card: MiniCVConfig }) {
  return (
    <motion.div
      initial={{ y: 0, rotate: card.rotate, opacity: 0 }}
      animate={{ y: [0, -16, 0], rotate: card.rotate, opacity: 1 }}
      transition={{ y: { duration: card.duration, repeat: Infinity, ease: "easeInOut", delay: card.delay }, opacity: { duration: 1, delay: card.delay } }}
      className={`absolute ${card.className} ${card.opacity}`}
    >
      <div className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-md p-4 shadow-2xl shadow-black/60 select-none">
        <div className="flex items-center gap-2.5">
          <div className={`h-9 w-9 shrink-0 rounded-full bg-gradient-to-br ${card.avatar}`} />
          <div className="flex-1 space-y-1.5">
            <div className="h-2 w-3/4 rounded-full bg-white/25" />
            <div className="h-1.5 w-1/2 rounded-full bg-white/10" />
          </div>
          <div className={`rounded-lg px-1.5 py-1 text-[10px] font-bold leading-none ${card.scoreClasses}`}>
            {card.score}
          </div>
        </div>
        <div className="mt-3 space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-white/10" />
          <div className="h-1.5 w-11/12 rounded-full bg-white/10" />
          <div className="h-1.5 w-4/5 rounded-full bg-white/10" />
        </div>
        <div className="mt-3 flex gap-1.5">
          <div className="h-4 w-12 rounded-full bg-white/10" />
          <div className="h-4 w-10 rounded-full bg-white/10" />
          <div className="h-4 w-14 rounded-full bg-white/10" />
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className={`h-full rounded-full ${card.bar} ${card.barWidth}`} />
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Sfondo animato per le pagine di accesso: mini-CV fluttuanti
 * su base scura con aloni viola. Non interattivo.
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
