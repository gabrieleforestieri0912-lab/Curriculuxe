import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  lang: "it",
  title: "Accedi",
  description: "Accedi a Curriculuxe per continuare a creare e ottimizzare il tuo curriculum.",
  path: "/login",
  keywords: ["Curriculuxe login", "accedi al CV builder"],
  noindex: true,
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
