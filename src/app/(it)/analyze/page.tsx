import Analyze from "@/components/Analyze";
import { alternatesForLang, buildMetadata } from "@/lib/seo";

const base = buildMetadata({
  lang: "it",
  title: "Analizza il tuo CV con l'AI",
  description:
    "Carica il tuo curriculum e ottieni subito score ATS, keyword mancanti, job match e bullet riscritti in stile recruiter. Analisi gratuita.",
  path: "/analyze",
  keywords: ["analisi CV online", "score ATS gratuito", "ottimizza il mio curriculum"],
});

// Stesso contenuto di /resume-score: la parola chiave "analyze" non deve
// generare una pagina gemella che si cannibalizza.
export const metadata = {
  ...base,
  alternates: alternatesForLang("it", "/resume-score"),
};

export default function AnalyzePage() {
  return <Analyze />;
}
