import type { Metadata } from "next";
import ResourceShell from "@/components/ResourceShell";
import ResourceHub from "@/components/resources/ResourceHub";
import RoadmapExplorer from "@/components/resources/RoadmapExplorer";
import { roadmaps } from "@/content/roadmaps";
import { breadcrumbSchema, buildMetadata, collectionPageSchema, jsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  lang: "it",
  title: "Roadmap di carriera per ruoli tech",
  description:
    "Roadmap per Frontend, Backend, Data Scientist e Product Manager: tappe con skill richieste, progetti da costruire, cosa scrivere nel CV e il criterio che chiude ogni tappa.",
  path: "/roadmaps",
  keywords: [
    "roadmap carriera",
    "roadmap frontend developer",
    "roadmap backend developer",
    "roadmap data scientist",
    "roadmap product manager",
    "skill per colloqui tech",
    "come crescere come sviluppatore",
  ],
});

export default function RoadmapsPage() {
  return (
    <ResourceShell>
      <ResourceHub
        title="Roadmap"
        highlight="di carriera"
        description="Percorsi che dicono, tappa per tappa, quali skill servono, che progetti costruirci sopra e come capire quando hai davvero finito. Ogni tappa si chiude solo con un criterio verificabile."
        meta={`${roadmaps.length} percorsi · ${roadmaps.reduce((total, roadmap) => total + roadmap.stops.length, 0)} tappe in totale`}
        cta={{
          label: "Analizza il tuo CV",
          href: "/resume-score",
          hint: "Vedi quali skill di queste roadmap hai gia' nel CV e quali ti mancano.",
        }}
        trail={[{ label: "Home", href: "/" }, { label: "Roadmap di carriera" }]}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@graph": [
                breadcrumbSchema("it", "/roadmaps", [
                  { name: "Risorse", path: "/roadmaps" },
                  { name: "Roadmap di carriera", path: "/roadmaps" },
                ]),
                collectionPageSchema(
                  "it",
                  "/roadmaps",
                  "Roadmap di carriera",
                  "Percorsi guidati per crescere nei ruoli tech piu richiesti.",
                  roadmaps.map((roadmap) => ({
                    name: roadmap.title,
                    path: `/roadmaps/${roadmap.slug}`,
                  }))
                ),
              ],
            }),
          }}
        />

        <RoadmapExplorer />
      </ResourceHub>
    </ResourceShell>
  );
}