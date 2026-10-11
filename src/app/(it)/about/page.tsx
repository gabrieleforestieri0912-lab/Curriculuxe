import type { Metadata } from "next";
import ResourceShell from "@/components/ResourceShell";
import ResourceHub from "@/components/resources/ResourceHub";
import AboutSections from "@/components/resources/AboutSections";
import { about } from "@/content/about";
import { breadcrumbSchema, buildMetadata, jsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  lang: "it",
  title: "Chi siamo - il job search copilot",
  description:
    "Curriculuxe mantiene l'evidenza in ogni passo della candidatura: score ATS con prove, tailoring con approvazione, nessun invio massivo. Come trattiamo i tuoi dati e come verifichiamo gli annunci.",
  path: "/about",
  keywords: [
    "chi siamo Curriculuxe",
    "job search copilot",
    "AI per il curriculum",
    "come trattiamo i dati",
    "sicurezza e privacy",
  ],
});

export default function AboutPage() {
  return (
    <ResourceShell>
      <ResourceHub
        title="Chi"
        highlight="siamo"
        description={about.it.lead}
        meta="Nessuna scrittura senza la tua approvazione, nessun invio massivo, nessuna esperienza inventata"
        cta={{
          label: "Analizza il tuo CV",
          href: "/resume-score",
          hint: "Il modo piu' rapido per capire se facciamo quello che diciamo: guarda l'evidenza di ogni penalita'.",
        }}
        trail={[{ label: "Risorse", href: "/about" }, { label: "Chi siamo" }]}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@graph": [
                breadcrumbSchema("it", "/about", [
                  { name: "Risorse", path: "/about" },
                  { name: "Chi siamo", path: "/about" },
                ]),
                {
                  "@type": "AboutPage",
                  "@id": "https://curriculuxe.vercel.app/about#aboutpage",
                  url: "https://curriculuxe.vercel.app/about",
                  name: "Chi siamo",
                  inLanguage: "it",
                  mainEntity: { "@id": "https://curriculuxe.vercel.app/#organization" },
                },
              ],
            }),
          }}
        />

        <AboutSections lang="it" />
      </ResourceHub>
    </ResourceShell>
  );
}