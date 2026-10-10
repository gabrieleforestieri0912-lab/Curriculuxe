import AboutContent from "@/app/(it)/about/content";
import { breadcrumbSchema, buildMetadata, jsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  lang: "en",
  title: "About Curriculuxe - The Job Search Copilot",
  description:
    "Curriculuxe is an AI job search copilot: ATS resume scoring, evidence-based tailoring and interview preparation, without spam applications or auto-apply.",
  path: "/about",
  keywords: ["about Curriculuxe", "AI job search copilot", "resume tools company"],
});

export default function EnglishAboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema("en", "/about", [
              { name: "Home", path: "/" },
              { name: "About", path: "/about" },
            ])
          ),
        }}
      />
      <AboutContent />
    </>
  );
}
