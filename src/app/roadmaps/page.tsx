import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Map } from "lucide-react";
import { roadmaps } from "@/lib/seoData";

export const metadata: Metadata = {
  title: "Roadmap di Carriera — Frontend, Backend, Data, PM | Curriculuxe",
  description: "Percorsi guidati per crescere: skill, progetti e checklist per ogni ruolo. Aggiornati al mercato Italia/EU/USA.",
  alternates: { canonical: "/roadmaps" },
};

export default function RoadmapsPage() {
  return (
    <div className="pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-fuchsia-400 mb-3 px-3 py-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10">
            Risorse
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Roadmap <span className="text-gradient">di carriera</span>
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto">Scegli il percorso, segui i passi, verifica i progressi con Atlas.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {roadmaps.map((r, i) => (
            <div key={r.slug} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-fuchsia-500/30 hover:bg-white/[0.05] transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-indigo-300 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25">
                  <Map className="w-3 h-3" />
                  {r.level}
                </span>
                <span className="text-xs font-bold text-zinc-700 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="text-white font-bold text-lg">{r.title}</h3>
              <ol className="mt-4 space-y-2.5">
                {r.steps.map((s, j) => (
                  <li key={s} className="flex items-center gap-3 text-sm text-zinc-300">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-zinc-400 shrink-0">
                      {j + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
              <Link href="/guides" className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-fuchsia-400 hover:text-fuchsia-300 transition-colors">
                Guide correlate
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center rounded-2xl border border-white/10 bg-white/[0.02] p-8">
          <h2 className="text-xl font-bold text-white mb-2">Non sai da dove partire?</h2>
          <p className="text-zinc-400 text-sm mb-5">Analizza il tuo CV gratis e scopri il tuo prossimo passo.</p>
          <Link href="/analyze" className="btn-primary inline-block text-white px-6 py-3 rounded-full font-semibold text-sm">
            Analizza il tuo CV
          </Link>
        </div>
      </div>
    </div>
  );
}
