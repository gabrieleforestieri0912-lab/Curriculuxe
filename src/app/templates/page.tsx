import type { Metadata } from "next";
import Link from "next/link";
import { templates } from "@/lib/seoData";

export const metadata: Metadata = {
  title: "Template CV ATS-friendly — 16 modelli | Curriculuxe",
  description: "Sfoglia 16 template ATS-friendly: ATS-safe, creativi e accademici. Anteprima realistica ed export PDF/DOC/TXT.",
  alternates: { canonical: "/templates" },
};

export default function TemplatesPage() {
  return (
    <div className="pt-20 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white">Template CV ATS-friendly</h1>
        <p className="text-zinc-400 mt-2">16 modelli curati — ogni template passa i filtri ATS (sezioni standard, contatti leggibili, keyword ≥55%).</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {templates.map((t) => (
            <div key={t.slug} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <span className="text-[11px] px-2 py-1 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-300">{t.tag}</span>
              <h3 className="text-white font-bold mt-3">{t.name}</h3>
              <p className="text-zinc-500 text-sm mt-1">{t.desc}</p>
              <Link href="/dashboard/create" className="inline-block mt-4 text-sm font-semibold text-fuchsia-400 hover:text-fuchsia-300">Usa questo template →</Link>
            </div>
          ))}
        </div>
        <p className="text-xs text-zinc-600 mt-8">Vuoi vedere tutti i 16? Vai in <Link href="/dashboard/create" className="text-zinc-400 underline">Crea CV</Link> per l'anteprima completa.</p>
      </div>
    </div>
  );
}
