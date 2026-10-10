import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  lang: "it",
  title: "Registrati gratis",
  description:
    "Crea il tuo account Curriculuxe gratis: genera il CV, analizza lo score ATS e inizia la tua ricerca di lavoro con l'AI.",
  path: "/register",
  keywords: ["registrazione Curriculuxe", "crea il tuo CV gratis"],
});

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
