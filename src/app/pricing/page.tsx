import type { Metadata } from "next";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";

export const metadata: Metadata = {
  title: "Prezzi semplici — da 4,99€/mese | Curriculuxe",
  description:
    "Scegli il piano che fa per te: Free, Starter 4,99€/mese, Pro 6,99€/mese, Enterprise 9,99€/mese. Annuale -20/30% . Annulla quando vuoi.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <div className="pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Posso cambiare piano in qualsiasi momento?",
                acceptedAnswer: { "@type": "Answer", text: "Sì, puoi fare upgrade/downgrade dal portale Stripe in /dashboard/settings." },
              },
              {
                "@type": "Question",
                name: "I crediti non usati si accumulano?",
                acceptedAnswer: { "@type": "Answer", text: "I crediti dei piani in abbonamento si rinnovano ogni ciclo; la ricarica one-time da 10 crediti non scade." },
              },
            ],
          }),
        }}
      />
      <Pricing />
      <FAQ />
    </div>
  );
}
