"use client";

import type { ContentType } from "@/content/types";
import { useResourceProgress } from "@/lib/useResourceProgress";
import Checklist, { type ChecklistItem } from "./Checklist";

/**
 * Collega la checklist al progresso persistente: Supabase se l'utente e'
 * loggato, localStorage altrimenti. Vedi useResourceProgress.
 */
export default function ChecklistProgress({
  contentType,
  contentSlug,
  items,
  legend,
  progressLabel,
  children,
}: {
  contentType: ContentType;
  contentSlug: string;
  items: ChecklistItem[];
  legend: string;
  progressLabel: string;
  children?: React.ReactNode;
}) {
  const { items: done, toggle, reset, synced } = useResourceProgress(contentType, contentSlug);

  return (
    <>
      {!synced && (
        <p className="text-xs text-zinc-600 mb-3" role="status">
          Caricamento del tuo progresso...
        </p>
      )}
      <Checklist
        items={items}
        done={done}
        onToggle={toggle}
        legend={legend}
        progressLabel={progressLabel}
        renderExtra={
          <>
            {children}
            <button
              type="button"
              onClick={reset}
              className="mt-4 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Azzera il progresso
            </button>
          </>
        }
      />
    </>
  );
}