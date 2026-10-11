import type { Metadata } from "next";
import ResourceShell from "@/components/ResourceShell";
import ResourceHub from "@/components/resources/ResourceHub";
import ProjectExplorer from "@/components/resources/ProjectExplorer";
import { projects } from "@/content/projects";
import { breadcrumbSchema, buildMetadata, collectionPageSchema, jsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  lang: "it",
  title: "Progetti da portfolio per il CV",
  description:
    "Progetti da costruire per dimostrare una skill nel curriculum: obiettivo, stack, difficolta', tempo stimato, milestone, errori comuni e il bullet da mettere nel CV.",
  path: "/projects",
  keywords: [
    "progetti portfolio",
    "progetti da mettere nel curriculum",
    "idee progetto CV",
    "portfolio developer",
    "progetti per colloqui tech",
  ],
});

export default function ProjectsPage() {
  return (
    <ResourceShell>
      <ResourceHub
        title="Progetti"
        highlight="da portfolio"
        description="Non sono idee generiche: ogni progetto ha un obiettivo, un tempo stimato, le milestone e il bullet pronto da mettere nel CV. Scegli quello che dimostra la skill che ti manca."
        meta={`${projects.length} progetti nel catalogo · anteprima aperta a tutti, milestone complete dal piano indicato`}
        cta={{
          label: "Analizza il tuo CV",
          href: "/resume-score",
          hint: "Trova la skill che ti manca, poi torna qui e scegli il progetto che la dimostra.",
        }}
        trail={[{ label: "Risorse", href: "/projects" }, { label: "Progetti da portfolio" }]}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@graph": [
                breadcrumbSchema("it", "/projects", [
                  { name: "Risorse", path: "/projects" },
                  { name: "Progetti da portfolio", path: "/projects" },
                ]),
                collectionPageSchema(
                  "it",
                  "/projects",
                  "Progetti da portfolio",
                  "Progetti da costruire per dimostrare una competenza nel curriculum.",
                  projects.map((project) => ({
                    name: project.title,
                    path: `/projects/${project.slug}`,
                  }))
                ),
              ],
            }),
          }}
        />

        <ProjectExplorer />
      </ResourceHub>
    </ResourceShell>
  );
}