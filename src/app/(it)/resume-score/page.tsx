import Analyze from "@/components/Analyze";
import { breadcrumbSchema, buildMetadata, jsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  lang: "it",
  title: "Resume Score - Analisi ATS gratuita del CV",
  description:
    "Carica il tuo CV e ottieni in pochi secondi un punteggio ATS da 0 a 100 con evidenze testuali, keyword mancanti e riscritture dei bullet in stile recruiter. Gratuito.",
  path: "/resume-score",
  keywords: [
    "analisi ATS",
    "score ATS",
    "verifica curriculum",
    "test ATS gratuito",
    "curriculum ATS friendly",
    "controlla il mio CV",
  ],
});

export default function ResumeScorePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "Come valutare il tuo CV con Resume Score",
            description:
              "Carica il CV, aggiungi la job description e ottieni score ATS, keyword e riscritture.",
            step: [
              { "@type": "HowToStep", name: "Carica il CV", text: "Trascina PDF/DOCX o incolla il testo." },
              { "@type": "HowToStep", name: "Aggiungi la job description", text: "Incolla l'offerta per calcolare il job match." },
              { "@type": "HowToStep", name: "Ricevi lo score", text: "Ottieni 0-100 con punti di forza, gap e bullet riscritti." },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema("it", "/resume-score", [
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
