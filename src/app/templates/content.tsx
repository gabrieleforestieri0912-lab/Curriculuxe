"use client";

import Link from "next/link";
import { templates } from "@/lib/seoData";
import { useLanguage } from "@/context/LanguageContext";

export default function TemplatesContent() {
  const { t } = useLanguage();
  const tTemplates = t.templates as Record<string, string>;

  return (
    <div className="pt-20 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white">{tTemplates.title}</h1>
        <p className="text-zinc-400 mt-2">{tTemplates.subtitle}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {templates.map((t) => (
            <div key={t.slug} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <span className="text-[11px] px-2 py-1 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-300">{t.tag}</span>
              <h3 className="text-white font-bold mt-3">{t.name}</h3>
              <p className="text-zinc-500 text-sm mt-1">{t.desc}</p>
              <Link href="/dashboard/create" className="inline-block mt-4 text-sm font-semibold text-fuchsia-400 hover:text-fuchsia-300">{tTemplates.useTemplate}</Link>
            </div>
          ))}
        </div>
        <p className="text-xs text-zinc-600 mt-8">{tTemplates.viewAllPrefix} <Link href="/dashboard/create" className="text-zinc-400 underline">{tTemplates.viewAllCta}</Link> {tTemplates.viewAllSuffix}</p>
      </div>
    </div>
  );
}
