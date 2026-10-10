import Link from "next/link";
import { ArrowRight, Banknote } from "lucide-react";
import { salaries } from "@/lib/seoData";
import ResourceShell from "@/components/ResourceShell";
import { breadcrumbSchema, buildMetadata, collectionPageSchema, jsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  lang: "it",
  title: "Salari tech - Fasce RAL per ruolo e mercato",
  description:
    "Dati salariali aggregati per Italia, Europa e USA. Fasce RAL indicative per negoziare la tua retribuzione con dati, non a sensazione.",
  path: "/salaries",
  keywords: [
    "stipendi tech Italia",
    "quanto guadagna un developer",
    "RAL frontend developer",
    "negoziare lo stipendio",
    "salary benchmark Europa",
    "stipendi USA tech",
  ],
});

export default function SalariesPage() {
  return (
    <ResourceShell>
      <div className="max-w-4xl mx-auto">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd(
              breadcrumbSchema("it", "/salaries", [
                { name: "Home", path: "/" },
                { name: "Salaries", path: "/salaries" },
              ])
            ),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@type": "Dataset",
              name: "Fasce salariali tech per mercato",
              description:
                "Fasce RAL aggregate per ruolo tech nei mercati Italia, Europa e USA.",
              url: "https://curriculuxe.vercel.app/salaries",
              creator: { "@id": "https://curriculuxe.vercel.app/#organization" },
              isAccessibleForFree: true,
              variableMeasured: salaries.map((s) => ({
                "@type": "PropertyValue",
                name: s.role,
                value: s.range,
                unitText: s.market,
              })),
            }),
          }}
        />
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-fuchsia-400 mb-3 px-3 py-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10">
            Risorse
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Salaries <span className="text-gradient">trasparenti</span>
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto">Fasce indicative — usa il negoziatore Atlas per benchmark personalizzati.</p>
        </div>
        <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.02]">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-zinc-400">
              <tr>
                <th className="text-left p-4 font-semibold">Ruolo</th>
                <th className="text-left p-4 font-semibold hidden sm:table-cell">Mercato</th>
                <th className="text-right p-4 font-semibold">Fascia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {salaries.map((s) => (
                <tr key={s.role} className="text-zinc-300 hover:bg-white/[0.03] transition-colors">
                  <td className="p-4">
                    <span className="inline-flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-emerald-400/70 shrink-0" />
                      {s.role}
                    </span>
                    <span className="block sm:hidden text-xs text-zinc-500 mt-1">{s.market}</span>
                  </td>
                  <td className="p-4 text-zinc-500 hidden sm:table-cell">{s.market}</td>
                  <td className="p-4 font-bold text-emerald-300 text-right whitespace-nowrap">{s.range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-zinc-600 mt-4 text-center">Dati aggregati a scopo informativo. Per offerta specifica usa <span className="text-zinc-400">Dashboard → Ricerca &amp; Negoziazione</span>.</p>
        <div className="mt-10 text-center rounded-2xl border border-fuchsia-500/25 bg-fuchsia-500/[0.06] p-8">
          <h2 className="text-xl font-bold text-white mb-2">Quanto vali davvero?</h2>
          <p className="text-zinc-400 text-sm mb-5">Genera email di negoziazione e controproposte con benchmark di mercato.</p>
          <Link href="/dashboard/job-search" className="btn-primary inline-flex items-center gap-2 text-white px-6 py-3 rounded-full font-semibold text-sm">
            Apri il negoziatore
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </ResourceShell>
  );
}
