import type { Metadata } from "next";
import TemplatesContent from "./content";
import { breadcrumbSchema, buildMetadata, collectionPageSchema, jsonLd } from "@/lib/seo";
import { templates } from "@/lib/seoData";

export const metadata = buildMetadata({
  lang: "it",
  title: "Template CV ATS-friendly - 4 modelli pronti",
  description:
    "Sfoglia template CV ATS-friendly: layout a colonna singola, font standard e sezioni etichettate che i parser leggono senza errori. Export in PDF, DOC o TXT.",
  path: "/templates",
  keywords: [
    "template CV",
    "modello curriculum",
    "template ATS",
    "curriculum europass alternativo",
    "modello CV da compilare",
  ],
});

export default function TemplatesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema("it", "/templates", [
              { name: "Home", path: "/" },
              { name: "Template", path: "/templates" },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            collectionPageSchema(
              "it",
              "/templates",
              "Template CV ATS-friendly",
              "Modelli di curriculum progettati per superare i sistemi di tracciamento.",
              templates.map((t) => ({ name: t.name, path: "/templates" }))
            )
          ),
        }}
      />
      <TemplatesContent />
    </>
  );
}
