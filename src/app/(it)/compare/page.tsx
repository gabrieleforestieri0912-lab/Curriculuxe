import type { Metadata } from "next";
import Link from "next/link";
import { Check, Minus, HelpCircle } from "lucide-react";
import ResourceShell from "@/components/ResourceShell";
import ResourceHub from "@/components/resources/ResourceHub";
import {
  compareCategoryLabels,
  compareFaq,
  compareHonesty,
  comparePlanRows,
  compareRows,
} from "@/content/compare";
import type { CompareCell } from "@/content/types";
import { breadcrumbSchema, buildMetadata, faqPageSchema, jsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  lang: "it",
  title: "Confronto: Curriculuxe e i builder generici",
  description:
    "Confronto onesto fra Curriculuxe e i generatori di CV con intelligenza artificiale, su analisi ATS, tailoring, mercato e trasparenza. Dove non sappiamo, lo diciamo.",
  path: "/compare",
  keywords: [
    "miglior AI CV builder",
    "confronto generatori CV",
    "Curriculuxe recensioni",
    "differenze tra CV builder",
  ],
});

const cellStyles: Record<CompareCell["value"], { icon: typeof Check; className: string; label: string }> = {
  yes: { icon: Check, className: "text-emerald-300", label: "Si" },
  no: { icon: Minus, className: "text-zinc-500", label: "No" },
  partial: { icon: Minus, className: "text-amber-300", label: "In parte" },
  unknown: { icon: HelpCircle, className: "text-zinc-400", label: "Non dichiarato" },
};

function Cell({ cell }: { cell: CompareCell }) {
  const style = cellStyles[cell.value];
  const Icon = style.icon;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span
        className={`inline-flex items-center justify-center w-7 h-7 rounded-full border ${
          cell.value === "yes"
            ? "bg-emerald-500/20 border-emerald-500/40"
            : cell.value === "no"
              ? "bg-white/5 border-white/10"
              : cell.value === "partial"
                ? "bg-amber-500/15 border-amber-500/30"
                : "bg-white/[0.03] border-white/10"
        }`}
      >
        <Icon className={`w-4 h-4 ${style.className}`} aria-hidden="true" />
      </span>
      <span className="text-[11px] text-zinc-500 sr-only">{style.label}</span>
      <span className="text-xs text-zinc-500 text-center leading-snug">{cell.detail}</span>
    </div>
  );
}

export default function ComparePage() {
  const categories = Object.keys(compareCategoryLabels) as Array<
    keyof typeof compareCategoryLabels
  >;

  return (
    <ResourceShell>
      <ResourceHub
        title="Confronto"
        description="Cosa facciamo, cosa non facciamo, e cosa fanno i generatori di CV con intelligenza artificiale. Dove non abbiamo dati verificabili lo scriviamo, invece di riempiere la casella."
        meta="Nessun prodotto di terzi viene valutato per nome: descriviamo il comportamento tipico dichiarato nelle pagine di vendita"
        cta={{
          label: "Prova lo score ATS",
          href: "/resume-score",
          hint: "Il confronto si verifica in un minuto: carica il CV e guarda l'evidenza di ogni penalita'.",
        }}
        trail={[{ label: "Risorse", href: "/compare" }, { label: "Confronto" }]}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@graph": [
                breadcrumbSchema("it", "/compare", [
                  { name: "Risorse", path: "/compare" },
                  { name: "Confronto", path: "/compare" },
                ]),
                faqPageSchema(compareFaq),
              ],
            }),
          }}
        />

        <div className="space-y-8">
          {categories.map((category) => (
            <section key={category}>
              <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500 mb-3">
                {compareCategoryLabels[category]}
              </h2>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-x-auto">
                <table className="w-full text-sm min-w-[640px]">
                  <caption className="sr-only">
                    Confronto fra Curriculuxe e i builder generici: {compareCategoryLabels[category]}
                  </caption>
                  <thead className="bg-white/[0.03] text-zinc-400">
                    <tr>
                      <th scope="col" className="text-left p-4 font-semibold w-[34%]">
                        Funzionalita&apos;
                      </th>
                      <th scope="col" className="p-4 font-semibold w-[33%]">
                        Curriculuxe
                      </th>
                      <th scope="col" className="p-4 font-semibold w-[33%]">
                        Builder generico
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {compareRows
                      .filter((row) => row.category === category)
                      .map((row) => (
                        <tr key={row.feature}>
                          <th scope="row" className="text-left p-4 font-medium text-zinc-200 align-top">
                            {row.feature}
                          </th>
                          <td className="p-4 align-top text-center">
                            <Cell cell={row.curriculuxe} />
                          </td>
                          <td className="p-4 align-top text-center">
                            <Cell cell={row.generic} />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-5 mt-6 text-xs text-zinc-500">
          <span className="inline-flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-300" /> presente
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Minus className="w-3.5 h-3.5 text-amber-300" /> presente in parte
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Minus className="w-3.5 h-3.5 text-zinc-500" /> assente
          </span>
          <span className="inline-flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-zinc-400" /> non dichiarato dal prodotto
          </span>
        </div>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-white mb-4">Piani a confronto</h2>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-white/[0.03] text-zinc-400">
                <tr>
                  <th scope="col" className="text-left p-4">Piano</th>
                  <th scope="col" className="text-left p-4">Prezzo</th>
                  <th scope="col" className="text-left p-4">Curriculuxe</th>
                  <th scope="col" className="text-left p-4">Builder generico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {comparePlanRows.map((row) => (
                  <tr key={row.plan}>
                    <th scope="row" className="text-left p-4 font-semibold text-white">
                      {row.plan}
                    </th>
                    <td className="p-4 text-zinc-300">{row.price}</td>
                    <td className="p-4 text-zinc-300">{row.curriculuxe}</td>
                    <td className="p-4 text-zinc-500">{row.generic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-white mb-2">Quando non scegliere Curriculuxe</h2>
          <p className="text-zinc-400 text-sm mb-5 max-w-2xl">
            Un confronto in cui vinciamo su tutto non dice niente. Questi sono i casi in cui
            un&apos;altra scelta e&apos; migliore, anche se non e&apos; la nostra.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {compareHonesty.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <h3 className="text-white font-bold">{item.title}</h3>
                <p className="text-zinc-400 text-sm mt-2 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-white mb-4">Domande frequenti</h2>
          <div className="space-y-3">
            {compareFaq.map((item) => (
              <details
                key={item.q}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 group"
              >
                <summary className="cursor-pointer text-white font-semibold text-sm list-none flex items-center justify-between gap-3">
                  {item.q}
                  <span
                    aria-hidden="true"
                    className="text-fuchsia-400 transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="text-zinc-400 text-sm mt-3 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="mt-12 rounded-2xl border border-fuchsia-500/25 bg-fuchsia-500/[0.06] p-6 text-center">
          <h2 className="text-white font-bold text-lg">Verificalo tu</h2>
          <p className="text-zinc-300 text-sm mt-2 max-w-xl mx-auto">
            Il modo piu&apos; rapido per capire se un tool fa quello che promette e&apos; guardare
            l&apos;evidenza. Nel nostro caso e&apos; il frammento di CV che genera ogni penalita&apos;.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-5">
            <Link
              href="/resume-score"
              className="btn-primary px-6 py-3 rounded-full text-sm font-bold text-white"
            >
              Analizza il tuo CV gratis
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-full text-sm font-semibold border border-white/15 bg-white/5 hover:bg-white/10 transition-colors"
            >
              Vedi i piani
            </Link>
          </div>
        </div>
      </ResourceHub>
    </ResourceShell>
  );
}