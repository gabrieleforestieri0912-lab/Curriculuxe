import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  lang: "it",
  title: "Pagina non trovata (404)",
  description: "La pagina che cerchi non esiste. Torna alla home o alle risorse di Curriculuxe.",
  path: "/404",
  noindex: true,
});

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#07070d] text-white flex flex-col items-center justify-center px-6 text-center">
      <p className="text-fuchsia-400 font-bold tracking-widest text-sm">404</p>
      <h1 className="text-4xl font-bold mt-3 mb-4">Pagina non trovata</h1>
      <p className="text-zinc-400 max-w-md mb-8">
        Questa pagina non esiste piu. Prova dalla home o dalle guide gratuite per scrivere un
        curriculum che supera i filtri ATS.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="btn-primary px-6 py-3 rounded-full font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Torna alla home
        </Link>
        <Link
          href="/guides"
          className="px-6 py-3 rounded-full font-semibold text-sm border border-white/10 bg-white/5 hover:bg-white/10"
        >
          Guide CV
        </Link>
      </div>
    </main>
  );
}
