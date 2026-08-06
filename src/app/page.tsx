import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ScoreDemo from "@/components/ScoreDemo";
import Features from "@/components/Features";
import ProductShowcase from "@/components/ProductShowcase";
import CompaniesSection from "@/components/CompaniesSection";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Navbar />
      <Hero />
      <ScoreDemo />
      <Features />
      <ProductShowcase />
      <CompaniesSection />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}
