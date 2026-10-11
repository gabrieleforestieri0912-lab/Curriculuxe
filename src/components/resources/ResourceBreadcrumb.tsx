import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

export default function ResourceBreadcrumb({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Percorso di navigazione" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-500">
        {trail.map((crumb, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="w-3 h-3 text-zinc-700" aria-hidden="true" />}
              {crumb.href && !isLast ? (
                <Link href={crumb.href} className="hover:text-zinc-300 transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className={isLast ? "text-zinc-300" : undefined}>
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}