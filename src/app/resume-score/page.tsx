import type { Metadata } from "next";
import Analyze from "@/components/Analyze";

export const metadata: Metadata = {
  title: "Resume Score — Analisi ATS gratuita | Curriculuxe",
  description:
    "Carica il tuo CV e ottieni in secondi un punteggio ATS 0-100 con evidenze testuali, keyword mancanti e riscritture bullet in stile recruiter. Gratis, lettura nel browser.",
  alternates: { canonical: "/resume-score" },
  openGraph: {
    title: "Resume Score — Analisi ATS gratuita",
    description: "Punteggio ATS 0-100, keyword match e riscritture pronte da usare.",
    url: "/resume-score",
    type: "website",
  },
};

export default function ResumeScorePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "Come valutare il tuo CV con Resume Score",
            description: "Carica il CV, aggiungi la job description e ottieni score ATS, keyword e riscritture.",
            step: [
              { "@type": "HowToStep", name: "Carica il CV", text: "Trascina PDF/DOCX o incolla il testo." },
              { "@type": "HowToStep", name: "Aggiungi job description", text: "Incolla l'offerta per calcolare il job match." },
              { "@type": "HowToStep", name: "Ricevi lo score", text: "Ottieni 0-100 con punti di forza, gap e bullet riscritti." },
            ],
          }),
        }}
      />
      <Analyze />
    </>
  );
}
