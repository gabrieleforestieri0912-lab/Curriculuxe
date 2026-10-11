import type { Metadata } from "next";
import AboutSections from "@/components/resources/AboutSections";
import ResourceShell from "@/components/ResourceShell";
import ResourceHub from "@/components/resources/ResourceHub";
import { about } from "@/content/about";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  lang: "en",
  title: "About us - the job search copilot",
  description:
    "Curriculuxe keeps the evidence at every step: ATS scores with proof, tailoring with approval, no mass applying. How we handle your data and how we verify postings.",
  path: "/en/about",
  keywords: ["about Curriculuxe", "job search copilot", "CV data privacy"],
});

export default function EnglishAboutPage() {
  return (
    <ResourceShell>
      <ResourceHub
        title="About"
        highlight="us"
        description={about.en.lead}
        meta="Nothing is written without your approval, nothing is mass applied, nothing is invented"
        cta={{
          label: "Check your resume score",
          href: "/en/resume-score",
          hint: "The fastest way to see whether we do what we claim: read the evidence behind every penalty.",
        }}
        trail={[
          { label: "Resources", href: "/en" },
          { label: "About", href: "/en/about" },
        ]}
      >
        <AboutSections lang="en" />
      </ResourceHub>
    </ResourceShell>
  );
}