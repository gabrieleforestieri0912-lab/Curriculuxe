import type { Metadata } from "next";
import { projects } from "@/lib/seoData";

export const metadata: Metadata = {
  title: "Progetti da Portfolio — 81 idee build-worthy | Curriculuxe",
  description: "Libreria di progetti guidati per arricchire il CV: da SaaS billing a ATS parser. Ogni progetto con stack e guida.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <div className="pt-20 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white">Progetti da Portfolio</h1>
        <p className="text-zinc-400 mt-2">81 progetti selezionati — qui 4 estratti, tutti disponibili per gli iscritti.</p>
        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          {projects.map((p) => (
            <div key={p.slug} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 inline-block">{p.stack}</div>
              <h3 className="text-white font-bold mt-3">{p.title}</h3>
              <p className="text-zinc-500 text-sm mt-1">{p.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-zinc-600 mt-6">Logica limiti: Free 22 progetti, Pro/Premium tutti gli 81.</p>
      </div>
    </div>
  );
}
