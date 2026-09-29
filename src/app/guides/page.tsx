import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { guides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guide — CV, Cover Letter, Colloqui | Curriculuxe",
  description: "Guide pratiche per scrivere CV efficaci, superare l'ATS e preparare colloqui. Con checklist e template.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <div className="pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-fuchsia-400 mb-3 px-3 py-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10">
            Risorse
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Guide <span className="text-gradient">pratiche</span>
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto">Long-form pratici, non fuffa — ognuno con checklist e template da copiare.</p>
        </div>
        <div className="space-y-4">
          {guides.map((g, i) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="group flex items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-fuchsia-500/30 hover:bg-white/[0.05] transition-all"
            >
              <span className="text-sm font-bold text-zinc-600 tabular-nums shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold group-hover:text-fuchsia-200 transition-colors">{g.title}</h3>
                <p className="text-zinc-400 text-sm mt-1">{g.excerpt}</p>
                <div className="text-xs text-zinc-600 mt-2">{g.readMin} min di lettura</div>
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-fuchsia-300 group-hover:translate-x-1 transition-all shrink-0" />
            </Link>
          ))}
        </div>
        <p className="text-sm text-zinc-500 mt-8 text-center">Vuoi un feedback sul tuo CV? <Link href="/resume-score" className="text-fuchsia-400 hover:text-fuchsia-300">Prova il Resume Score</Link>.</p>
      </div>
    </div>
  );
}
