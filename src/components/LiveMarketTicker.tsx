"use client";

import { useMemo } from "react";
import Link from "next/link";
import { jobCatalog, formatEuro } from "@/lib/jobs";

export default function LiveMarketTicker() {
  const items = useMemo(() => jobCatalog.slice(0, 10), []);
  const total = jobCatalog.length;
  const lastCheck = "18 set 2026";

  return (
    <section className="py-6 px-4 border-y border-white/5 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live market
            </span>
            <span className="text-zinc-400">
              <span className="text-white font-bold">{total}</span> ruoli verificati · fonti employer dirette · ultimo controllo {lastCheck}
            </span>
          </div>
          <Link href="/career-market" className="text-fuchsia-400 hover:text-fuchsia-300 font-semibold">
            Esplora il Career Market →
          </Link>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-white/5 bg-black/30">
          <div className="flex animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused]">
            {[...items, ...items].map((job, i) => (
              <Link
                key={`${job.id}-${i}`}
                href={`/career-market/${job.id}`}
                className="shrink-0 flex items-center gap-3 px-5 py-3 border-r border-white/5 hover:bg-white/5 transition-colors min-w-[320px]"
              >
                <span className="text-white text-sm font-semibold truncate">{job.role}</span>
                <span className="text-zinc-500 text-xs truncate">{job.company} · {job.location}</span>
                <span className="ml-auto text-emerald-300 text-xs font-semibold whitespace-nowrap">{formatEuro(job.salaryMin)}–{formatEuro(job.salaryMax)}</span>
              </Link>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-zinc-600">Mai ranking sponsorizzati · Deduplica su azienda+titolo+location · Filtri condivisibili via link</p>
      </div>
      <style>{`@keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }`}</style>
    </section>
  );
}
