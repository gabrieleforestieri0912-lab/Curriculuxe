import type { Metadata } from "next";
import AboutContent from "./content";

export const metadata: Metadata = {
  title: "Chi siamo — Curriculuxe | Curriculuxe",
  description: "Curriculuxe nasce per portare il job search copilot in Italia: ATS, tailoring e preparazione colloqui senza spam-apply.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutContent />;
}
