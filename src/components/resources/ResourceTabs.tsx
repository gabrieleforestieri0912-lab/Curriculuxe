"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { resources } from "@/content/resources";

/**
 * Sotto-navigazione delle risorse. Le etichette arrivano da src/content/resources
 * cosi' non possono divergere dal menu e dal footer.
 */
export default function ResourceTabs() {
  const pathname = usePathname();

  return (
    <nav aria-label="Risorse" className="mb-10">
      <ul className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {resources.map((resource) => {
          const isActive = pathname === resource.href;
          return (
            <li key={resource.slug} className="shrink-0">
              <Link
                href={resource.href}
                aria-current={isActive ? "page" : undefined}
                className={`inline-block rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-fuchsia-500/50 bg-fuchsia-500/15 text-white"
                    : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/25 hover:text-white"
                }`}
              >
                {resource.navLabel}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}