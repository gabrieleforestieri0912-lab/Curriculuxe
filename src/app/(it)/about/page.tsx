import type { Metadata } from "next";
import AboutContent from "./content";
import { breadcrumbSchema, buildMetadata, jsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  lang: "it",
  title: "Chi siamo - Il job search copilot",
  description:
    "Curriculuxe nasce per portare il job search copilot in Italia: score ATS, tailoring basato su evidenze e preparazione ai colloqui, senza spam-apply.",
  path: "/about",
  keywords: ["chi siamo Curriculuxe", "job search copilot", "AI per il curriculum"],
});

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema("it", "/about", [
              { name: "Home", path: "/" },
              { name: "Chi siamo", path: "/about" },
            ])
          ),
        }}
      />
      <AboutContent />
    </>
  );
}
