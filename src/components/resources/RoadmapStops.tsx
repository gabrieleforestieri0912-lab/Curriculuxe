"use client";

import type { Roadmap } from "@/content/types";
import Link from "next/link";
import { useResourceProgress } from "@/lib/useResourceProgress";
import Checklist from "./Checklist";
import { getProject } from "@/content/projects";

/**
 * Tappe della roadmap con checklist di avanzamento collegata al progresso
 * persistente (Supabase se loggato, localStorage altrimenti).
 */
export default function RoadmapStops({ roadmap }: { roadmap: Roadmap }) {
  const { items: done, toggle, reset, synced } = useResourceProgress("roadmap", roadmap.slug);

  const checklistItems = roadmap.stops.flatMap((stop) => [
    {
      id: `${stop.id}-skill`,
      label: stop.title,
      hint: stop.skills.slice(0, 3).join(" · "),
      children: (
        <span className="mt-2 flex flex-wrap gap-1.5">
          {stop.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-zinc-400"
            >
              {skill}
            </span>
          ))}
        </span>
      ),
    },
  ]);

  return (
    <>
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 mb-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
          <h2 className="text-white font-bold">Le tappe della roadmap</h2>
          <span className="text-xs text-zinc-500">
            {roadmap.stops.filter((stop) => done[`${stop.id}-skill`]).length} di {roadmap.stops.length}{" "}
            completate
          </span>
        </div>

        <div className="relative pl-6 sm:pl-8">
          <span
            aria-hidden="true"
            className="absolute left-2 sm:left-3 top-2 bottom-2 w-px bg-gradient-to-b from-indigo-400/40 via-fuchsia-500/30 to-transparent"
          />
          <ol className="space-y-6">
            {roadmap.stops.map((stop, stopIndex) => {
              const isDone = Boolean(done[`${stop.id}-skill`]);
              return (
                <li key={stop.id} className="relative">
                  <span
                    aria-hidden="true"
                    className={`absolute -left-6 sm:-left-8 top-1 w-4 h-4 rounded-full border-2 transition-colors ${
                      isDone
                        ? "border-fuchsia-400 bg-fuchsia-500/30"
                        : "border-white/20 bg-[#0b0b14]"
                    }`}
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-zinc-600 tabular-nums">
                      {String(stopIndex + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-white font-bold text-lg">{stop.title}</h3>
                  </div>
                  <p className="text-zinc-400 text-sm mt-2 leading-relaxed">{stop.goal}</p>

                  <div className="grid sm:grid-cols-2 gap-3 mt-4">
                    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-2">
                        Skill da acquisire
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {stop.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-indigo-500/25 bg-indigo-500/10 px-2 py-0.5 text-[11px] text-indigo-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-2">
                        Cosa scrivere nel CV
                      </p>
                      <p className="text-zinc-300 text-xs leading-relaxed">{stop.cvEvidence}</p>
                    </div>
                  </div>

                  {stop.projects.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-zinc-500">Dimostralo con:</span>
                      {stop.projects.map((projectSlug) => {
                        const project = getProject(projectSlug);
                        if (!project) return null;
                        return (
                          <Link
                            key={projectSlug}
                            href={`/projects/${project.slug}`}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-zinc-300 hover:text-white hover:border-white/25 transition-colors"
                          >
                            {project.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  <p className="mt-3 flex items-start gap-2 text-xs text-emerald-300/90">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"
                    />
                    <span>
                      <span className="font-semibold">Tappa chiusa quando:</span> {stop.doneWhen}
                    </span>
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {!synced && (
        <p className="text-xs text-zinc-600 mb-3" role="status">
          Caricamento del tuo avanzamento...
        </p>
      )}

      <div className="mb-6">
        <Checklist
          items={checklistItems}
          done={done}
          onToggle={toggle}
          legend="Il tuo avanzamento"
          progressLabel={`Avanzamento della roadmap ${roadmap.title}`}
          renderExtra={
            <button
              type="button"
              onClick={reset}
              className="mt-4 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Azzera il progresso
            </button>
          }
        />
      </div>
    </>
  );
}