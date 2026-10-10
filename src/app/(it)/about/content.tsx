"use client";

import { useLanguage } from "@/context/LanguageContext";
import ResourceShell from "@/components/ResourceShell";

export default function AboutContent() {
  const { t } = useLanguage();
  const tAbout = t.about as Record<string, string>;

  return (
    <ResourceShell>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white">{tAbout.title}</h1>
        <p className="text-zinc-300 mt-4 leading-relaxed">
          {tAbout.body}
        </p>
        <p className="text-zinc-400 mt-3">{tAbout.contact} <a href="mailto:gabriele.forestieri0912@gmail.com" className="text-fuchsia-400">gabriele.forestieri0912@gmail.com</a></p>
        <p className="text-xs text-zinc-600 mt-8">{tAbout.note}</p>
      </div>
    </ResourceShell>
  );
}
