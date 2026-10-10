import TemplatesContent from "@/app/(it)/templates/content";
import { breadcrumbSchema, buildMetadata, collectionPageSchema, jsonLd } from "@/lib/seo";
import { templates } from "@/lib/seoData";

export const metadata = buildMetadata({
  lang: "en",
  title: "ATS-Friendly Resume Templates - 4 Free Formats",
  description:
    "Browse ATS-friendly resume templates built on single-column layouts, standard fonts and labelled sections. Export to PDF, DOC or TXT and check your ATS score before sending.",
  path: "/templates",
  keywords: [
    "ATS resume templates",
    "ATS friendly resume template",
    "free resume templates",
    "modern resume template",
    "executive resume template",
    "academic CV template",
  ],
});

export default function EnglishTemplatesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema("en", "/templates", [
              { name: "Home", path: "/" },
              { name: "Templates", path: "/templates" },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            collectionPageSchema(
              "en",
              "/templates",
              "ATS-Friendly Resume Templates",
              "Resume templates designed to pass automated tracking systems.",
              templates.map((t) => ({ name: t.name, path: "/templates" }))
            )
          ),
        }}
      />
      <TemplatesContent />
    </>
  );
}
