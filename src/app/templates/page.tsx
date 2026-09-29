import type { Metadata } from "next";
import TemplatesContent from "./content";

export const metadata: Metadata = {
  title: "Template CV ATS-friendly — 16 modelli | Curriculuxe",
  description: "Sfoglia 16 template ATS-friendly: ATS-safe, creativi e accademici. Anteprima realistica ed export PDF/DOC/TXT.",
  alternates: { canonical: "/templates" },
};

export default function TemplatesPage() {
  return <TemplatesContent />;
}
