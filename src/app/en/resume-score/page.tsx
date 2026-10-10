import Analyze from "@/components/Analyze";
import { breadcrumbSchema, buildMetadata, jsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  lang: "en",
  title: "Free ATS Resume Checker - Get an Instant Resume Score",
  description:
    "Upload your resume and get an instant 0-100 ATS score with text evidence, missing keywords and recruiter-style bullet rewrites. Free, analysed in your browser.",
  path: "/resume-score",
  keywords: [
    "ATS resume checker",
    "free ATS checker",
    "ATS score",
    "resume scoring tool",
    "applicant tracking system test",
    "ATS friendly resume",
  ],
});

export default function EnglishResumeScorePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to check your resume with Resume Score",
            description:
              "Upload your resume, paste the job description and get an ATS score, keyword gaps and rewritten bullets.",
            step: [
              {
                "@type": "HowToStep",
                name: "Upload your resume",
                text: "Drag a PDF/DOCX file or paste the text.",
              },
              {
                "@type": "HowToStep",
                name: "Add the job description",
                text: "Paste the job posting to compute the job match score.",
              },
              {
                "@type": "HowToStep",
                name: "Get your score",
                text: "Receive a 0-100 score with strengths, gaps and rewritten bullets.",
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema("en", "/resume-score", [
              { name: "Home", path: "/" },
              { name: "Resume Score", path: "/resume-score" },
            ])
          ),
        }}
      />
      <Analyze />
    </>
  );
}
