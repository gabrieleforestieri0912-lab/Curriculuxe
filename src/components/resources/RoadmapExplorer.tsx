"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarClock, Clock3 } from "lucide-react";
import { roadmaps } from "@/content/roadmaps";
import ResourceFilters from "./ResourceFilters";

const roleOptions = [...new Set(roadmaps.map((roadmap) => roadmap.role))].map((role) => ({
  value: role,
  label: role,
}));

const levelOptions = [...new Set(roadmaps.map((roadmap) => roadmap.levelLabel))].map((level) => ({
  value: level,
  label: level,
}));

export default function RoadmapExplorer() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return roadmaps
      .filter((roadmap) => (role ? roadmap.role === role : true))
      .filter((roadmap) => (level ? roadmap.levelLabel === level : true))
      .filter((roadmap) =>
        needle
          ? [roadmap.title, roadmap.role, roadmap.intro].join(" ").toLowerCase().includes(needle)
          : true
      );
  }, [query, role, level]);

  return (
    <>
      <ResourceFilters
        query={query}
        onQueryChange={setQuery}
        facets={[
          { key: "role", label: "Ruolo", options: roleOptions },
          { key: "level", label: "Livello", options: levelOptions },
        ]}
        selected={{ role, level }}
        onFacetChange={(key, value) => {
          if (key === "role") setRole(value);
          if (key === "level") setLevel(value);
        }}
        resultLabel={`${filtered.length} roadmap su ${roadmaps.length}`}
        searchPlaceholder="Cerca per ruolo o obiettivo"
        resetLabel="Azzera filtri"
      />

      {filtered.length === 0 ? (
        <p className="text-center text-zinc-500 py-12">
          Nessuna roadmap corrisponde ai filtri scelti.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((roadmap) => (
            <Link
              key={roadmap.slug}
              href={`/roadmaps/${roadmap.slug}`}
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-fuchsia-500/30 hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-2.5 py-0.5 font-semibold text-fuchsia-300">
                  {roadmap.role}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-zinc-400">
                  {roadmap.levelLabel}
                </span>
              </div>

              <h2 className="text-white font-bold text-lg mt-3">{roadmap.title}</h2>
              <p className="text-zinc-400 text-sm mt-2 leading-relaxed flex-1">{roadmap.intro}</p>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-zinc-500">
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="w-3.5 h-3.5" aria-hidden="true" />
                  ~{roadmap.hoursPerWeek} ore/settimana
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarClock className="w-3.5 h-3.5" aria-hidden="true" />
                  {roadmap.months} mesi stimati
                </span>
                <span>{roadmap.stops.length} tappe</span>
              </div>

              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-fuchsia-400 group-hover:text-fuchsia-300">
                Apri la roadmap
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}