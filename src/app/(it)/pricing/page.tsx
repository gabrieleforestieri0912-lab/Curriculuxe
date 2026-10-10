import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import { breadcrumbSchema, buildMetadata, faqPageSchema, jsonLd } from "@/lib/seo";
import { faqIt } from "@/lib/faq";

export const metadata = buildMetadata({
  lang: "it",
  title: "Prezzi semplici - piani AI da 4,99 euro al mese",
  description:
    "Scegli il piano che fa per te: Free, Starter 4,99 euro al mese, Pro 6,99 euro al mese, Enterprise 9,99 euro al mese. Annuale -20/30%. Annulla quando vuoi.",
  path: "/pricing",
  keywords: [
    "prezzi AI CV builder",
    "quanto costa creare un CV con AI",
    "piani Curriculuxe",
    "resume builder pricing",
  ],
});

const faqSchema = faqPageSchema(faqIt.filter((item) => item.category === "pricing"));

export default function PricingPage() {
  return (
    <div className="pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema("it", "/pricing", [
              { name: "Home", path: "/" },
              { name: "Prezzi", path: "/pricing" },
            ])
          ),
        }}
      />
      <Pricing />
      <FAQ />
    </div>
  );
}
