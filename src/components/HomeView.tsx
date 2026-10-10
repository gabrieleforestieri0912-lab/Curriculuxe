import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ScoreDemo from "@/components/ScoreDemo";
import LoopSection from "@/components/loop/LoopSection";
import Features from "@/components/Features";
import { faqEn, faqIt } from "@/lib/faq";
import {
  breadcrumbSchema,
  faqPageSchema,
  jsonLd,
  softwareApplicationSchema,
  type SiteLang,
} from "@/lib/seo";

const LiveMarketTicker = dynamic(() => import("@/components/LiveMarketTicker"));
const ProductShowcase = dynamic(() => import("@/components/ProductShowcase"), { loading: () => <div className="min-h-[40vh]" /> });
const CompaniesSection = dynamic(() => import("@/components/CompaniesSection"));
const Pricing = dynamic(() => import("@/components/Pricing"));
const FAQ = dynamic(() => import("@/components/FAQ"));
const CTA = dynamic(() => import("@/components/CTA"));
const Footer = dynamic(() => import("@/components/Footer"));

const descriptions = {
  it: "Piattaforma AI per creare, ottimizzare e monitorare curriculum professionali con analisi ATS, generazione CV con AI e preparazione ai colloqui.",
  en: "AI platform to create, optimize and track your resume with ATS analysis, AI resume generation and interview preparation.",
};

export default function HomeView({ lang }: { lang: SiteLang }) {
  const faq = lang === "en" ? faqEn : faqIt;

  return (
    <div className="flex flex-col flex-1 min-h-screen overflow-x-clip bg-[#07070d] relative">
      {/* Alone viola morbidi (la griglia vive solo nella hero) */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 50% 6%, rgba(232,121,249,0.12), transparent 36%), radial-gradient(circle at 85% 40%, rgba(129,140,248,0.08), transparent 30%), radial-gradient(circle at 12% 65%, rgba(168,85,247,0.08), transparent 32%)",
        }}
      />
      <div className="relative z-10 flex flex-col flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd(softwareApplicationSchema(lang, descriptions[lang])),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(faqPageSchema(faq)) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd(breadcrumbSchema(lang, "/", [{ name: "Home", path: "/" }])),
          }}
        />
        <Navbar />
        <Hero />
        <LiveMarketTicker />
        <ScoreDemo />
        <LoopSection />
        <Features />
        <ProductShowcase />
        <Pricing />
        <FAQ />
        <CTA />
        <CompaniesSection />
        <Footer />
      </div>
    </div>
  );
}
