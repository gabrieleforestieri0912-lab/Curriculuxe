"use client";

import { useMemo } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { jobCatalog, formatEuro } from "@/lib/jobs";
import { useLanguage } from "@/context/LanguageContext";
import { navHref } from "@/lib/seo";

export default function LiveMarketTicker() {
  const { t, lang } = useLanguage();
  const tTicker = t.liveMarket as Record<string, string>;
  const items = useMemo(() => jobCatalog.slice(0, 10), []);
  const total = jobCatalog.length;
  const lastCheck = tTicker.lastCheck as string;

  return (
    <section className="py-6 border-y border-white/5 bg-white/[0.02]">
      <div className="px-4">
        <div className="max-w-7xl mx-auto flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {tTicker.badge as string}
              </span>
              <span className="text-zinc-400">
                <span className="text-white font-bold">{total}</span>{" "}
                {tTicker.roles as string}
              </span>
            </div>
            <Link
              href={navHref(lang, "/career-market")}
              className="text-fuchsia-400 hover:text-fuchsia-300 font-semibold"
            >
              {tTicker.cta as string} →
            </Link>
          </div>
        </div>
      </div>

      {/* A tutta larghezza: con i bordi sfumati la lista sembra scorrere
          fuori dallo schermo invece di essere tagliata dal container. */}
      <div className="marquee-viewport mt-3">
        <div className="marquee-track gap-3 px-3" style={{ "--marquee-duration": "34s" } as React.CSSProperties}>
          {[...items, ...items].map((job, i) => (
            <Link
              key={`${job.id}-${i}`}
              href={`/career-market/${job.id}`}
              style={{ "--marquee-index": i % items.length } as React.CSSProperties}
              className="marquee-item shrink-0 flex items-center gap-3 pl-4 pr-5 py-3 rounded-xl border border-white/10 bg-black/40 hover:bg-white/[0.06] transition-colors min-w-[300px]"
            >
              <span className="text-white text-sm font-semibold truncate">{job.role}</span>
              <span className="text-zinc-500 text-xs truncate inline-flex items-center gap-1">
                {job.company}
                <span className="text-zinc-700">·</span>
                <MapPin className="w-3 h-3 shrink-0" />
                {job.location}
              </span>
              <span className="ml-auto text-emerald-300 text-xs font-semibold whitespace-nowrap">
                {formatEuro(job.salaryMin)}–{formatEuro(job.salaryMax)}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-[11px] text-zinc-600 mt-3">
            {tTicker.disclaimer as string}
          </p>
        </div>
      </div>
    </section>
  );
}