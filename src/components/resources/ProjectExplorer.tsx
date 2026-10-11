"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { projects, projectPlanLabels } from "@/content/projects";
import { getRoadmap } from "@/content/roadmaps";
import { getGuide } from "@/content/guides";
import ResourceFilters from "./ResourceFilters";
import type { Project } from "@/content/types";

const PLAN_RANK: Record<Project["minPlan"], number> = {
  free: 0,
  starter: 1,
  pro: 2,
  enterprise: 3,
};

export function planSatisfies(userPlan: string | null, required: Project["minPlan"]) {
  const rank = userPlan ? (PLAN_RANK[userPlan as Project["minPlan"]] ?? -1) : -1;
  return rank >= PLAN_RANK[required];
}

const stackOptions = [...new Set(projects.flatMap((project) => project.stack))].sort().map((tech) => ({
  value: tech,
  label: tech,
}));

const roleOptions = [...new Set(projects.flatMap((project) => project.roles))].sort().map((role) => ({
  value: role,
  label: role,
}));

const difficultyOptions = [
  { value: "principiante", label: "Principiante" },
  { value: "intermedio", label: "Intermedio" },
  { value: "avanzato", label: "Avanzato" },
];

export default function ProjectExplorer() {
  const [query, setQuery] = useState("");
  const [stack, setStack] = useState("");
  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return projects
      .filter((project) => (stack ? project.stack.includes(stack) : true))
      .filter((project) => (role ? project.roles.includes(role) : true))
      .filter((project) => (difficulty ? project.difficulty === difficulty : true))
      .filter((project) =>
        needle
          ? [project.title, project.goal, project.stack.join(" "), project.skills.join(" ")]
              .join(" ")
              .toLowerCase()
              .includes(needle)
          : true
      );
  }, [query, stack, role, difficulty]);

  return (
    <>
      <ResourceFilters
        query={query}
        onQueryChange={setQuery}
        facets={[
          { key: "stack", label: "Stack", options: stackOptions },
          { key: "role", label: "Ruolo", options: roleOptions },
          { key: "difficulty", label: "Difficolta'", options: difficultyOptions },
        ]}
        selected={{ stack, role, difficulty }}
        onFacetChange={(key, value) => {
          if (key === "stack") setStack(value);
          if (key === "role") setRole(value);
          if (key === "difficulty") setDifficulty(value);
        }}
        resultLabel={`${filtered.length} progetti su ${projects.length}`}
        searchPlaceholder="Cerca per titolo o tecnologia"
        resetLabel="Azzera filtri"
      />

      {filtered.length === 0 ? (
        <p className="text-center text-zinc-500 py-12">
          Nessun progetto corrisponde ai filtri scelti.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => {
            const roadmap = project.roadmapSlug ? getRoadmap(project.roadmapSlug) : undefined;
            const guide = project.guideSlug ? getGuide(project.guideSlug) : undefined;
            const isOpen = project.minPlan === "free";

            return (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-fuchsia-500/30 hover:bg-white/[0.05] transition-colors"
              >
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="rounded-full border border-indigo-500/25 bg-indigo-500/10 px-2.5 py-0.5 text-indigo-200">
                    {project.difficulty}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-zinc-400">
                    ~{project.hours} ore
                  </span>
                  {!isOpen && (
                    <span className="rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-2.5 py-0.5 text-fuchsia-300 inline-flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      {projectPlanLabels[project.minPlan]}
                    </span>
                  )}
                </div>

                <h2 className="text-white font-bold mt-3 leading-snug">{project.title}</h2>
                <p className="text-zinc-400 text-sm mt-2 leading-relaxed flex-1">{project.goal}</p>

                <p className="text-xs text-zinc-500 mt-3 font-medium">{project.stack.join(" · ")}</p>

                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-xs text-zinc-600 mb-2">Nel CV scrivi:</p>
                  <p className="text-zinc-300 text-xs leading-relaxed">{project.cvBullet}</p>
                </div>

                {(roadmap || guide) && (
                  <div className="flex flex-wrap gap-2 mt-3 text-[11px] text-zinc-500">
                    {roadmap && (
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                        Roadmap {roadmap.role}
                      </span>
                    )}
                    {guide && (
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                        Guida collegata
                      </span>
                    )}
                  </div>
                )}

                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-fuchsia-400 group-hover:text-fuchsia-300">
                  Apri il progetto
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

/** Piano corrente dell'utente, letto dalla cache e confermato dal server. */
export function useUserPlan(): { plan: string | null; ready: boolean } {
  const [plan, setPlan] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const read = () => {
      try {
        const raw = localStorage.getItem("user");
        if (raw && !cancelled) {
          const user = JSON.parse(raw);
          setPlan(user?.plan ?? null);
        }
      } catch {
        // cache non leggibile: resta anonimo
      }
    };

    read();

    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data?.user?.plan) setPlan(data.user.plan);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { plan, ready };
}