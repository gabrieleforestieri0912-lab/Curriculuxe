"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

export interface Facet {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface ResourceFiltersProps {
  query: string;
  onQueryChange: (value: string) => void;
  facets: Facet[];
  selected: Record<string, string>;
  onFacetChange: (key: string, value: string) => void;
  resultLabel: string;
  searchPlaceholder: string;
  resetLabel: string;
}

/** Filtri client-side: il catalogo e' piccolo e statico, nessuna query da mandare. */
export default function ResourceFilters({
  query,
  onQueryChange,
  facets,
  selected,
  onFacetChange,
  resultLabel,
  searchPlaceholder,
  resetLabel,
}: ResourceFiltersProps) {
  const [showSearch, setShowSearch] = useState(false);
  const activeCount = useMemo(
    () => Object.values(selected).filter(Boolean).length,
    [selected]
  );

  const reset = () => {
    onQueryChange("");
    facets.forEach((facet) => onFacetChange(facet.key, ""));
  };

  return (
    <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
<div className="flex flex-wrap items-center gap-2">
          {facets.map((facet) => (
            <div key={facet.key} className="relative">
              <select
                id={`facet-${facet.key}`}
                value={selected[facet.key] ?? ""}
                onChange={(event) => onFacetChange(facet.key, event.target.value)}
                className="appearance-none rounded-full bg-black/30 border border-white/10 pl-3 pr-7 py-2 text-xs font-medium text-zinc-300 outline-none hover:border-white/25 focus-visible:border-fuchsia-400/60 cursor-pointer"
              >
                <option value="">{facet.label}: tutte</option>
                {facet.options.map((option) => (
                  <option key={option.value} value={option.value} className="bg-zinc-900">
                    {option.label}
                  </option>
                ))}
              </select>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500"
              >
                ▾
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {showSearch && (
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <label htmlFor="resource-search" className="sr-only">
                Cerca
              </label>
              <input
                id="resource-search"
                type="search"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder={searchPlaceholder}
                className="w-48 rounded-full bg-black/30 border border-white/10 pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-600 outline-none focus-visible:border-fuchsia-400/60"
              />
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowSearch((prev) => !prev)}
            aria-expanded={showSearch}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:border-white/25 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            Cerca
          </button>
          {(activeCount > 0 || query) && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white hover:border-white/25 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              {resetLabel}
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-zinc-600 mt-3">{resultLabel}</p>
    </div>
  );
}