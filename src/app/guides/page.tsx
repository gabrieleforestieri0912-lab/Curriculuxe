import type { Metadata } from "next";
import Link from "next/link";
import { guides } from "@/lib/seoData";

export const metadata: Metadata = {
  title: "Guide — CV, Cover Letter, Colloqui | Curriculuxe",
  description: "Guide pratiche per scrivere CV efficaci, superare l'ATS e preparare colloqui. Con template ed esempi.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <div className="pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white">Guide</h1>
        <p className="text-zinc-400 mt-2">Long-form pratici, non fuffa — ognuno con checklist e template.</p>
        <div className="mt-8 space-y-4">
          {guides.map((g) => (
            <article key={g.slug} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="text-white font-bold">{g.title}</h3>
              <p className="text-zinc-400 text-sm mt-1">{g.excerpt}</p>
              <div className="text-xs text-zinc-600 mt-2">{g.readMin} min di lettura</div>
            </article>
          ))}
        </div>
        <p className="text-sm text-zinc-500 mt-8">Vuoi un feedback sul tuo CV? <Link href="/resume-score" className="text-fuchsia-400">Prova il Resume Score</Link>.</p>
      </div>
    </div>
  );
}
