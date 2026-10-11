"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Clock, CalendarDays, ArrowRight } from "lucide-react";
import { guides, guideCategoryLabels, guideReadMinutes } from "@/content/guides";
import ResourceFilters from "./ResourceFilters";
import type { GuideCategory } from "@/content/types";

const categoryOptions = (Object.keys(guideCategoryLabels) as GuideCategory[]).map((key) => ({
  value: key,
  label: guideCategoryLabels[key],
}));

export default function GuideExplorer({ initialCategory = "" }: { initialCategory?: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return guides
      .filter((guide) => (category ? guide.category === category : true))
      .filter((guide) =>
        needle
          ? [guide.title, guide.excerpt, ...guide.sections.map((s) => s.heading)]
              .join(" ")
              .toLowerCase()
              .includes(needle)
          : true
      )
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [query, category]);

  return (
    <>
      <ResourceFilters
        query={query}
        onQueryChange={setQuery}
        facets={[{ key: "category", label: "Categoria", options: categoryOptions }]}
        selected={{ category }}
        onFacetChange={(key, value) => {
          if (key === "category") setCategory(value);
        }}
        resultLabel={`${filtered.length} guide su ${guides.length}`}
        searchPlaceholder="Cerca per titolo o argomento"
        resetLabel="Azzera filtri"
      />

      {filtered.length === 0 ? (
        <p className="text-center text-zinc-500 py-12">
          Nessuna guida corrisponde ai filtri scelti.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-fuchsia-500/30 hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-2.5 py-0.5 font-semibold text-fuchsia-300">
                  {guideCategoryLabels[guide.category]}
                </span>
                <span className="inline-flex items-center gap-1 text-zinc-500">
                  <Clock className="w-3 h-3" aria-hidden="true" />
                  {guideReadMinutes(guide)} min
                </span>
                <span className="inline-flex items-center gap-1 text-zinc-600">
                  <CalendarDays className="w-3 h-3" aria-hidden="true" />
                  aggiornata{" "}
                  {new Date(guide.updatedAt).toLocaleDateString("it-IT", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              <h2 className="text-white font-bold text-lg mt-3 leading-snug">{guide.title}</h2>
              <p className="text-zinc-400 text-sm mt-2 leading-relaxed flex-1">{guide.excerpt}</p>

              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-fuchsia-400 group-hover:text-fuchsia-300">
                Leggi la guida
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}