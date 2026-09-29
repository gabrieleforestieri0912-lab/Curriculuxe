import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ScoreDemo from "@/components/ScoreDemo";
import LoopSection from "@/components/loop/LoopSection";
import Features from "@/components/Features";
import { faqIt } from "@/lib/faq";

const LiveMarketTicker = dynamic(() => import("@/components/LiveMarketTicker"));
const ProductShowcase = dynamic(() => import("@/components/ProductShowcase"), { loading: () => <div className="min-h-[40vh]" /> });
const CompaniesSection = dynamic(() => import("@/components/CompaniesSection"));
const Pricing = dynamic(() => import("@/components/Pricing"));
const FAQ = dynamic(() => import("@/components/FAQ"));
const CTA = dynamic(() => import("@/components/CTA"));
const Footer = dynamic(() => import("@/components/Footer"));

const baseUrl = process.env.NEXT_PUBLIC_URL || "https://curriculuxe.vercel.app";

// Structured data: SoftwareApplication con le offerte dei piani (GEO/entity).
const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Curriculuxe",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: baseUrl,
  description:
    "Piattaforma AI-powered per creare, ottimizzare e monitorare curriculum professionali con analisi ATS, generazione CV e preparazione ai colloqui.",
  inLanguage: "it",
  offers: [
    { "@type": "Offer", name: "Free", price: "0", priceCurrency: "EUR" },
    { "@type": "Offer", name: "Starter", price: "4.99", priceCurrency: "EUR", description: "50 crediti AI al mese" },
    { "@type": "Offer", name: "Pro", price: "6.99", priceCurrency: "EUR", description: "500 crediti AI al mese" },
    { "@type": "Offer", name: "Enterprise", price: "9.99", priceCurrency: "EUR", description: "2000 crediti AI al mese" },
  ],
};

// Structured data: FAQPage per gli answer engine (AEO), allineata alla FAQ visibile.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqIt.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function Home() {
  return (
    <div className="flex flex-col flex-1 min-h-screen overflow-x-clip bg-[#07070d] relative">
      {/* Stesso stile della hero su tutta la landing: griglia + aloni viola morbidi */}
      <div className="absolute inset-0 subtle-grid pointer-events-none" aria-hidden="true" />
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 50% 6%, rgba(232,121,249,0.16), transparent 36%), radial-gradient(circle at 85% 40%, rgba(129,140,248,0.10), transparent 30%), radial-gradient(circle at 12% 65%, rgba(168,85,247,0.10), transparent 32%)",
        }}
      />
      <div className="relative z-10 flex flex-col flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <Navbar />
        <Hero />
        <CompaniesSection />
        <LiveMarketTicker />
        <ScoreDemo />
        <LoopSection />
        <Features />
        <ProductShowcase />
        <Pricing />
        <FAQ />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}
