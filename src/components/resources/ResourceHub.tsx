import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ResourceBreadcrumb, { type Crumb } from "./ResourceBreadcrumb";
import ResourceTabs from "./ResourceTabs";

export interface ResourceCta {
  label: string;
  href: string;
  hint: string;
}

interface ResourceHubProps {
  title: string;
  highlight?: string;
  description: string;
  /** Statistiche o note di metodo sotto il titolo. */
  meta?: string;
  eyebrow?: string;
  cta?: ResourceCta;
  trail?: Crumb[];
  children: ReactNode;
}

/**
 * Guscio comune delle pagine Risorse: breadcrumb visibile, titolo,
 * descrizione, CTA contestuale e sotto-navigazione fra le risorse.
 *
 * Tutte e cinque le pagine hub partono da qui, cosi' hanno lo stesso
 * scheletro del resto del prodotto invece di un proprio layout.
 */
export default function ResourceHub({
  title,
  highlight,
  description,
  meta,
  eyebrow = "Risorse",
  cta,
  trail,
  children,
}: ResourceHubProps) {
  return (
    <div className="max-w-7xl mx-auto">
      {trail && <ResourceBreadcrumb trail={trail} />}

      <header className="mb-8">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-fuchsia-400 mb-3 px-3 py-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10">
          {eyebrow}
        </span>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              {title}
              {highlight && (
                <>
                  {" "}
                  <span className="text-gradient">{highlight}</span>
                </>
              )}
            </h1>
            <p className="text-zinc-400 mt-3 text-lg leading-relaxed">{description}</p>
            {meta && <p className="text-xs text-zinc-600 mt-3">{meta}</p>}
          </div>

          {cta && (
            <Link
              href={cta.href}
              className="group inline-flex flex-col gap-1 rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/10 px-5 py-4 hover:border-fuchsia-500/60 hover:bg-fuchsia-500/[0.14] transition-colors max-w-sm"
            >
              <span className="flex items-center gap-2 text-sm font-bold text-white">
                {cta.label}
                <ArrowRight className="w-4 h-4 text-fuchsia-400 transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="text-xs text-zinc-400">{cta.hint}</span>
            </Link>
          )}
        </div>
      </header>

      <ResourceTabs />

      {children}
    </div>
  );
}