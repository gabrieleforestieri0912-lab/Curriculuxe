import type { Metadata } from "next";
import Link from "next/link";
import { roadmaps } from "@/lib/seoData";

export const metadata: Metadata = {
  title: "Roadmap di Carriera — Frontend, Backend, Data, PM | Curriculuxe",
  description: "Percorsi guidati per crescere: skill, progetti e checklist per ogni ruolo. Aggiornati al mercato Italia/EU/USA.",
  alternates: { canonical: "/roadmaps" },
};

export default function RoadmapsPage() {
  return (
    <div className="pt-20 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white">Roadmap di Carriera</h1>
        <p className="text-zinc-400 mt-2">Scegli il percorso, segui i passi, verifica i progressi con Atlas.</p>
        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          {roadmaps.map((r) => (
            <div key={r.slug} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="text-xs text-zinc-500">{r.level}</div>
              <h3 className="text-white font-bold mt-1">{r.title}</h3>
              <ol className="list-decimal list-inside text-sm text-zinc-400 mt-3 space-y-1">
                {r.steps.map((s) => <li key={s}>{s}</li>)}
              </ol>
              <Link href="/guides" className="inline-block mt-4 text-sm font-semibold text-fuchsia-400">Guide correlate →</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
