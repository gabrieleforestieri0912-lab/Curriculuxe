import type { ReactNode } from "react";
import { Check, Circle } from "lucide-react";

export interface ChecklistItem {
  id: string;
  label: string;
  hint?: string;
  children?: ReactNode;
}

interface ChecklistProps {
  items: ChecklistItem[];
  done: Record<string, boolean>;
  onToggle: (id: string) => void;
  legend: string;
  progressLabel: string;
  renderExtra?: ReactNode;
}

/**
 * Checklist con progresso. Lo stato vive in ProgressProvider (server se
 * l'utente e' loggato, localStorage altrimenti), questa e' solo la vista.
 */
export default function Checklist({
  items,
  done,
  onToggle,
  legend,
  progressLabel,
  renderExtra,
}: ChecklistProps) {
  const completed = items.filter((item) => done[item.id]).length;
  const percent = Math.round((completed / items.length) * 100);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
        <h2 className="text-white font-bold">{legend}</h2>
        <span className="text-xs text-zinc-500">
          {completed} di {items.length} · {percent}%
        </span>
      </div>

      <div
        className="h-1.5 rounded-full bg-white/[0.06] border border-white/10 overflow-hidden mb-5"
        role="progressbar"
        aria-label={progressLabel}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-gradient-to-r from-indigo-400 to-fuchsia-500 transition-[width] duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ul className="space-y-1">
        {items.map((item) => {
          const isDone = Boolean(done[item.id]);
          return (
            <li key={item.id}>
              <label className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => onToggle(item.id)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`mt-0.5 w-5 h-5 shrink-0 rounded-md border flex items-center justify-center transition-colors ${
                    isDone
                      ? "border-fuchsia-500/60 bg-fuchsia-500/25 text-fuchsia-200"
                      : "border-white/20 bg-white/[0.04] text-transparent"
                  }`}
                >
                  {isDone ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Circle className="w-2 h-2 fill-white/30 text-white/30" />
                  )}
                </span>
                <span className="min-w-0">
                  <span
                    className={`block text-sm ${isDone ? "text-zinc-500 line-through" : "text-zinc-200"}`}
                  >
                    {item.label}
                  </span>
                  {item.hint && <span className="block text-xs text-zinc-600 mt-0.5">{item.hint}</span>}
                  {item.children}
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      {renderExtra && <div className="mt-5">{renderExtra}</div>}
    </section>
  );
}