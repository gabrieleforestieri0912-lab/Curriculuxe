"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { DerivedSalaryBand } from "@/content/salaries";
import { formatBandValue, getRoleGroups, marketLabels } from "@/content/salaries";
import ResourceFilters from "./ResourceFilters";

/**
 * Fasce salariali con fonte, campione e data.
 *
 * I numeri non sono un benchmark di mercato: sono la distribuzione dei
 * trattamenti dichiarati dagli annunci verificati del Career Market, e
 * ogni fascia porta il numero di annunci da cui deriva piu' i link per
 * aprirli uno a uno.
 */
export default function SalaryExplorer({ bands }: { bands: DerivedSalaryBand[] }) {
  const [query, setQuery] = useState("");
  const [market, setMarket] = useState("");
  const [role, setRole] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return bands
      .filter((band) => (market ? band.market === market : true))
      .filter((band) => (role ? band.roleGroup === role : true))
      .filter((band) =>
        needle
          ? `${band.roleGroup} ${band.market} ${band.locations.join(" ")}`
              .toLowerCase()
              .includes(needle)
          : true
      );
  }, [bands, query, market, role]);

  const globalMin = Math.min(...bands.map((band) => band.min));
  const globalMax = Math.max(...bands.map((band) => band.max));

  return (
    <>
      <ResourceFilters
        query={query}
        onQueryChange={setQuery}
        facets={[
          {
            key: "market",
            label: "Mercato",
            options: ["italia", "europa", "usa"].map((value) => ({
              value,
              label: marketLabels[value as keyof typeof marketLabels],
            })),
          },
          {
            key: "role",
            label: "Ruolo",
            options: getRoleGroups().map((group) => ({ value: group.key, label: group.label })),
          },
        ]}
        selected={{ market, role }}
        onFacetChange={(key, value) => {
          if (key === "market") setMarket(value);
          if (key === "role") setRole(value);
        }}
        resultLabel={`${filtered.length} fasce · ${filtered.reduce((total, band) => total + band.postings, 0)} annunci in totale`}
        searchPlaceholder="Cerca per ruolo o localita'"
        resetLabel="Azzera filtri"
      />

      {filtered.length === 0 ? (
        <p className="text-center text-zinc-500 py-12">
          Nessuna fascia corrisponde ai filtri scelti.
        </p>
      ) : (
        <div className="space-y-4">
          {filtered.map((band) => {
            const scaleMin = globalMin - (globalMax - globalMin) * 0.05;
            const scaleMax = globalMax + (globalMax - globalMin) * 0.05;
            const toPercent = (value: number) =>
              ((value - scaleMin) / (scaleMax - scaleMin)) * 100;

            return (
              <article
                key={band.key}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-white font-bold text-lg">{band.roleGroup}</h2>
                    <p className="text-sm text-zinc-500 mt-0.5">
                      {marketLabels[band.market]} · {band.seniority} ·{" "}
                      {band.locations.slice(0, 3).join(", ")}
                      {band.locations.length > 3 ? ` +${band.locations.length - 3}` : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-300 font-bold text-lg tabular-nums">
                      {formatBandValue(band.median, band.currency)}
                    </p>
                    <p className="text-xs text-zinc-500">mediano dichiarato</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="relative h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="absolute h-full rounded-full bg-gradient-to-r from-indigo-400/70 to-fuchsia-500/70"
                      style={{
                        left: `${toPercent(band.min)}%`,
                        width: `${Math.max(2, toPercent(band.max) - toPercent(band.min))}%`,
                      }}
                    />
                    <div
                      className="absolute h-full w-0.5 bg-white"
                      style={{ left: `${toPercent(band.median)}%` }}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-zinc-500 mt-2 tabular-nums">
                    <span>min {formatBandValue(band.min, band.currency)}</span>
                    <span>max {formatBandValue(band.max, band.currency)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-white/5">
                  <p className="text-xs text-zinc-600">
                    {band.postings} annunci · ultimo controllo{" "}
                    {new Date(band.latestPostedAt).toLocaleDateString("it-IT", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {band.jobIds.slice(0, 4).map((jobId) => (
                      <Link
                        key={jobId}
                        href={`/career-market/${jobId}`}
                        className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-300 hover:text-white hover:border-white/25 transition-colors"
                      >
                        Apri annuncio
                      </Link>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <h2 className="text-white font-bold text-lg">Come usare questi numeri</h2>
        <ul className="mt-3 space-y-2 text-sm text-zinc-400">
          <li>
            Ogni fascia e&apos; la distribuzione dei trattamenti dichiarati in un gruppo di{" "}
            {bands.reduce((total, band) => total + band.postings, 0)} annunci verificati: non
            sostituisce un report di settore.
          </li>
          <li>
            Il campione e&apos; piccolo e selezionato. Con una o due offerte la fascia non dice
            nulla: guarda sempre il numero di annunci accanto a ogni valore.
          </li>
          <li>
            Le fasce sono trattamenti annunciati, non busta paga effettiva: variano con
            benefit, equity e modalita&apos; di lavoro.
          </li>
          <li>
            Per negoziare una cifra che ti riguarda serve un confronto con la tua posizione,
            non solo la mediana del mercato.
          </li>
        </ul>
        <Link
          href="/guides/negoziazione-ral"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
        >
          Come si usa una fascia in negoziazione
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </>
  );
}