import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analisi salvata",
  robots: { index: false, follow: false, nocache: true },
};

export default function AnalyzeIdLayout({ children }: { children: React.ReactNode }) {
  return children;
}
