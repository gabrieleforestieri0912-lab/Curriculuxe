"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import type { Project } from "@/content/types";
import { projectPlanLabels } from "@/content/projects";
import { useUserPlan, planSatisfies } from "./ProjectExplorer";

/**
 * Milestone del progetto: l'anteprima e' aperta a tutti, il piano completo
 * dipende dal piano dell'utente. Il controllo e' sul lato client perche' la
 * pagina resta statica e veloce; il contenuto non e' segreto, e' la
 * stessa guida che mettiamo anche su richiesta.
 */
export default function ProjectMilestones({ project }: { project: Project }) {
  const { plan, ready } = useUserPlan();
  const unlocked = planSatisfies(plan, project.minPlan);
  const requiredPlan = projectPlanLabels[project.minPlan];

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 mb-8">
      <h2 className="text-white font-bold text-lg mb-4">Milestone</h2>

      <ol className="space-y-2">
        {project.previewMilestones.map((milestone) => (
          <li key={milestone} className="flex items-start gap-2.5 text-sm text-zinc-200">
            <span
              aria-hidden="true"
              className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"
            />
            {milestone}
          </li>
        ))}
      </ol>

      <div className="mt-6 pt-5 border-t border-white/10">
        {ready && !unlocked ? (
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
              <Lock className="w-4 h-4 text-fuchsia-400" aria-hidden="true" />
              Le {project.fullMilestones.length} milestone restanti sono incluse dal piano{" "}
              {requiredPlan}
            </p>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm text-zinc-400">
                Nell&apos;anteprima trovi obiettivo, architettura, errori da evitare e il bullet
                per il CV: il 70% di quello che ti serve per partire. Il piano {requiredPlan}{" "}
                aggiunge il piano di lavoro completo, con criteri di qualita&apos; e tempi.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <Link
                  href="/pricing"
                  className="btn-primary px-5 py-2.5 rounded-full text-sm font-bold text-white"
                >
                  Vedi i piani
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 rounded-full text-sm font-semibold border border-white/15 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Crea un account
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <ol className="space-y-2">
              {project.fullMilestones.map((milestone) => (
                <li key={milestone} className="flex items-start gap-2.5 text-sm text-zinc-200">
                  <span
                    aria-hidden="true"
                    className="mt-2 w-1.5 h-1.5 rounded-full bg-fuchsia-400 shrink-0"
                  />
                  {milestone}
                </li>
              ))}
            </ol>
            <p className="text-xs text-zinc-600 mt-4">
              Milestone incluse nel tuo piano {requiredPlan}.
            </p>
          </>
        )}
      </div>
    </section>
  );
}