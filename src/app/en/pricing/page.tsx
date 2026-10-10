import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import { breadcrumbSchema, buildMetadata, faqPageSchema, jsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  lang: "en",
  title: "Simple Pricing - AI Resume Builder Plans from $4.99/month",
  description:
    "Pick the plan that fits you: Free, Starter $4.99/month, Pro $6.99/month, Enterprise $9.99/month. Save 20-30% yearly. Cancel anytime, no lock-in.",
  path: "/pricing",
  keywords: [
    "resume builder pricing",
    "AI resume builder free",
    "cheap resume builder",
    "resume maker subscription",
  ],
});

const faqItems = [
  {
    q: "Can I change plan at any time?",
    a: "Yes: upgrade or downgrade from the Stripe portal in /dashboard/settings, and the change applies at the next billing cycle.",
  },
  {
    q: "Do unused credits roll over?",
    a: "Subscription credits renew every billing cycle; the one-time 10-credit top-up never expires.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes: the Free plan includes 3 trial AI credits, a full ATS score and unlimited resume templates.",
  },
];

export default function EnglishPricingPage() {
  return (
    <div className="pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqPageSchema(faqItems)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema("en", "/pricing", [
              { name: "Home", path: "/" },
              { name: "Pricing", path: "/pricing" },
            ])
          ),
        }}
      />
      <Pricing />
      <FAQ />
    </div>
  );
}
