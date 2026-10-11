import type { Metadata } from "next";
import ResourceShell from "@/components/ResourceShell";
import ResourceHub from "@/components/resources/ResourceHub";
import GuideExplorer from "@/components/resources/GuideExplorer";
import { guides } from "@/content/guides";
import { breadcrumbSchema, buildMetadata, collectionPageSchema, jsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  lang: "it",
  title: "Guide CV, ATS, cover letter e colloqui",
  description:
    "Guide operative scritte per essere applicate: form per superare i filtri ATS, keyword, tailoring, cover letter, colloqui STAR e negoziazione della retribuzione.",
  path: "/guides",
  keywords: [
    "guide CV",
    "come scrivere un curriculum",
    "superare un filtro ATS",
    "cover letter",
    "colloquio STAR",
    "negoziare la retribuzione",
    "consigli per il curriculum",
  ],
});

export default function GuidesPage() {
  return (
    <ResourceShell>
      <ResourceHub
        title="Guide"
        highlight="operative"
        description="Ogni guida ha una sezione per ogni punto che promette nel titolo, esempi prima e dopo, e una checklist da spuntare. Nessun consiglio generico: solo cose che puoi applicare subito al tuo CV."
        meta={`${guides.length} guide · tempo di lettura calcolato sul contenuto reale di ciascun articolo`}
        cta={{
          label: "Analizza il tuo CV",
          href: "/resume-score",
          hint: "Verifica in seconds quali delle regole di queste guide il tuo CV rispetta già e quali no.",
        }}
        trail={[{ label: "Risorse", href: "/guides" }, { label: "Guide" }]}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@graph": [
                breadcrumbSchema("it", "/guides", [
                  { name: "Risorse", path: "/guides" },
                  { name: "Guide", path: "/guides" },
                ]),
                collectionPageSchema(
                  "it",
                  "/guides",
                  "Guide CV, ATS, cover letter e colloqui",
                  "Guide operative per scrivere un CV che supera i filtri automatici.",
                  guides.map((guide) => ({
                    name: guide.title,
                    path: `/guides/${guide.slug}`,
                  }))
                ),
              ],
            }),
          }}
        />

        <GuideExplorer />
      </ResourceHub>
    </ResourceShell>
  );
}