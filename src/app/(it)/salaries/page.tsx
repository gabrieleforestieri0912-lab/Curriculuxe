import type { Metadata } from "next";
import ResourceShell from "@/components/ResourceShell";
import ResourceHub from "@/components/resources/ResourceHub";
import SalaryExplorer from "@/components/resources/SalaryExplorer";
import { buildSalaryBands, formatBandValue } from "@/content/salaries";
import { breadcrumbSchema, buildMetadata, jsonLd, siteUrl } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  lang: "it",
  title: "Stipendi tech: fasce dagli annunci verificati",
  description:
    "Fasce salariali per ruolo, seniority e mercato, calcolate sugli annunci verificati del Career Market. Ogni valore mostra quante offerte lo compongono e permette di aprirle.",
  path: "/salaries",
  keywords: [
    "stipendi tech Italia",
    "quanto guadagna uno sviluppatore",
    "stipendio frontend developer",
    "stipendio backend developer",
    "salario data scientist",
    "negoziare lo stipendio",
    "salary benchmark Europa",
  ],
});

export default function SalariesPage() {
  const bands = buildSalaryBands();
  const totalPostings = bands.reduce((total, band) => total + band.postings, 0);
  const latestCheck = bands
    .map((band) => band.latestPostedAt)
    .sort((a, b) => b.localeCompare(a))[0];
  const highestBand = bands.reduce((top, band) => (band.max > top.max ? band : top), bands[0]);

  return (
    <ResourceShell>
      <ResourceHub
        title="Stipendi"
        highlight="tech"
        description="Ogni fascia e' calcolata sugli annunci che pubblichiamo e verifichiamo: sotto ogni numero trovi quanti annunci lo compongono e puoi aprirli uno a uno."
        meta={`${bands.length} fasce · ${totalPostings} annunci · ultimo controllo ${new Date(latestCheck).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}`}
        cta={{
          label: "Prepara la negoziazione",
          href: "/guides/negoziazione-ral",
          hint: "Le fasce servono a dare una cifra di partenza. Qui trovi quando chiedere e come.",
        }}
        trail={[{ label: "Risorse", href: "/salaries" }, { label: "Stipendi tech" }]}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Dataset",
                  "@id": `${siteUrl}/salaries#dataset`,
                  name: "Fasce salariali tech per mercato",
                  description:
                    "Distribuzione dei trattamenti dichiarati negli annunci verificati del Career Market, raggruppati per ruolo e mercato.",
                  url: `${siteUrl}/salaries`,
                  creator: { "@id": `${siteUrl}/#organization` },
                  isAccessibleForFree: true,
                  temporalCoverage: "2026-08-05/2026-08-15",
                  dateModified: latestCheck,
                  variableMeasured: bands.map((band) => ({
                    "@type": "PropertyValue",
                    name: `${band.roleGroup} - ${band.market}`,
                    minValue: band.min,
                    maxValue: band.max,
                    value: band.median,
                    unitText: `${band.currency}/anno, da ${band.postings} annunci`,
                  })),
                  distribution: [
                    {
                      "@type": "DataDownload",
                      encodingFormat: "text/html",
                      contentUrl: `${siteUrl}/career-market`,
                    },
                  ],
                },
                breadcrumbSchema("it", "/salaries", [
                  { name: "Risorse", path: "/salaries" },
                  { name: "Stipendi tech", path: "/salaries" },
                ]),
              ],
            }),
          }}
        />

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 mb-6">
          <h2 className="text-white font-bold">Nota metodologica</h2>
          <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
            I valori provengono esclusivamente dagli annunci pubblicati sul Career Market da
            Curriculuxe, che ne verifica fonte e data di controllo. Non usiamo stime di terze
            parti ne dataset aperti. Ogni fascia indica il numero di annunci da cui deriva e
            ogni annuncio e&apos; apribile: se una fascia e&apos; basata su una sola offerta,
            il numero di annunci te lo dice. Il campione e&apos &quot;stima su annunci
            pubblicati&quot;, non benchmark di mercato.
          </p>
        </div>

        <SalaryExplorer bands={bands} />

        <p className="text-xs text-zinc-700 mt-8">
          I trattamenti sono espressi in {bands.some((band) => band.currency === "USD") ? "EUR e USD" : "EUR"}{" "}
          annuali lordi come dichiarati negli annunci: la fascia pi&apos; alta osservata e{" "}
          {formatBandValue(highestBand.max, highestBand.currency)}
          . Nessuna di queste informazioni e&apos; consulenza fiscale o retributiva.
        </p>
      </ResourceHub>
    </ResourceShell>
  );
}