import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FolderKanban } from "lucide-react";
import { projects } from "@/lib/seoData";

export const metadata: Metadata = {
  title: "Progetti da Portfolio — 81 idee build-worthy | Curriculuxe",
  description: "Libreria di progetti guidati per arricchire il CV: da SaaS billing a ATS parser. Ogni progetto con stack e guida.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <div className="pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-fuchsia-400 mb-3 px-3 py-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10">
            Risorse
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Progetti da <span className="text-gradient">portfolio</span>
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto">81 progetti selezionati — qui 4 estratti, tutti disponibili per gli iscritti.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {projects.map((p) => (
            <div key={p.slug} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-fuchsia-500/30 hover:bg-white/[0.05] transition-all">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-semibold">{p.stack}</span>
                <FolderKanban className="w-5 h-5 text-zinc-600 group-hover:text-fuchsia-300 transition-colors" />
              </div>
              <h3 className="text-white font-bold text-lg mt-4">{p.title}</h3>
              <p className="text-zinc-400 text-sm mt-1.5 leading-relaxed">{p.desc}</p>
              <Link href="/register" className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-fuchsia-400 hover:text-fuchsia-300 transition-colors">
                Sblocca la guida completa
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
        <p className="text-xs text-zinc-600 mt-8 text-center">Logica limiti: Free 22 progetti, Pro/Premium tutti gli 81.</p>
      </div>
    </div>
  );
}
