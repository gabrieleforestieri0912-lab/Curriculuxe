import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ScoreDemo from "@/components/ScoreDemo";
import LoopSection from "@/components/loop/LoopSection";
import Features from "@/components/Features";
import ProductShowcase from "@/components/ProductShowcase";
import CompaniesSection from "@/components/CompaniesSection";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import BackgroundVideo from "@/components/BackgroundVideo";
import { faqIt } from "@/lib/faq";

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
    { "@type": "Offer", name: "Pro", price: "8.99", priceCurrency: "EUR", description: "500 crediti AI al mese" },
    { "@type": "Offer", name: "Enterprise", price: "28.99", priceCurrency: "EUR", description: "2000 crediti AI al mese" },
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
    <div className="flex flex-col flex-1 min-h-screen overflow-x-clip">
      <BackgroundVideo />
      <div className="fixed inset-0 bg-black/50 pointer-events-none" />
      <div className="relative z-10 flex flex-col flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <Navbar />
        <Hero />
        <ScoreDemo />
        <LoopSection />
        <Features />
        <ProductShowcase />
        <CompaniesSection />
        <Pricing />
        <FAQ />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}
