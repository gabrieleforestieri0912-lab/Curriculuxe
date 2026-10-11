import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, Clock3, MapPin } from "lucide-react";
import { getRoadmap, roadmaps } from "@/content/roadmaps";
import { getGuide } from "@/content/guides";
import { getProject } from "@/content/projects";
import { jobCatalog, formatSalary } from "@/lib/jobs";
import ResourceShell from "@/components/ResourceShell";
import ResourceBreadcrumb from "@/components/resources/ResourceBreadcrumb";
import RoadmapStops from "@/components/resources/RoadmapStops";
import { absUrl, breadcrumbSchema, buildMetadata, jsonLd, siteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return roadmaps.map((roadmap) => ({ slug: roadmap.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const roadmap = getRoadmap(slug);
  if (!roadmap) {
    return { title: "Roadmap non trovata", robots: { index: false, follow: false } };
  }
  return buildMetadata({
    lang: "it",
    title: roadmap.title,
    description: roadmap.metaDescription,
    path: `/roadmaps/${roadmap.slug}`,
    keywords: [
      `roadmap ${roadmap.role.toLowerCase()}`,
      roadmap.levelLabel,
      "carriera tech",
      "skill da imparare",
    ],
  });
}

export default async function RoadmapPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const roadmap = getRoadmap(slug);
  if (!roadmap) notFound();

  const index = roadmaps.findIndex((item) => item.slug === slug);
  const prev = roadmaps[index - 1];
  const next = roadmaps[index + 1];

  const relatedGuides = roadmap.relatedGuides
    .map((guideSlug) => getGuide(guideSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const relatedProjects = Array.from(new Set(roadmap.stops.flatMap((stop) => stop.projects)))
    .map((projectSlug) => getProject(projectSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const matchingJobs = jobCatalog
    .filter((job) =>
      [job.role, ...job.keywords].some((value) =>
        roadmap.jobKeywords.some(
          (keyword) => value.toLowerCase().includes(keyword.toLowerCase())
        )
      )
    )
    .sort((a, b) => b.salaryMax - a.salaryMax)
    .slice(0, 6);

  const roadmapUrl = absUrl(`/roadmaps/${roadmap.slug}`);

  return (
    <ResourceShell>
      <div className="max-w-4xl mx-auto">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "HowTo",
                  "@id": `${roadmapUrl}#howto`,
                  name: roadmap.title,
                  description: roadmap.metaDescription,
                  inLanguage: "it",
                  totalTime: `P${roadmap.months}M`,
                  supply: [],
                  step: roadmap.stops.map((stop, position) => ({
                    "@type": "HowToStep",
                    position: position + 1,
                    name: stop.title,
                    text: `${stop.goal} Criterio di chiusura: ${stop.doneWhen}`,
                    url: `${roadmapUrl}#${stop.id}`,
                  })),
                },
                breadcrumbSchema("it", `/roadmaps/${roadmap.slug}`, [
                  { name: "Risorse", path: "/roadmaps" },
                  { name: "Roadmap di carriera", path: "/roadmaps" },
                  { name: roadmap.title, path: `/roadmaps/${roadmap.slug}` },
                ]),
              ],
            }),
          }}
        />

        <ResourceBreadcrumb
          trail={[
            { label: "Risorse", href: "/roadmaps" },
            { label: "Roadmap di carriera", href: "/roadmaps" },
            { label: roadmap.title },
          ]}
        />

        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-1 font-semibold text-fuchsia-300">
              {roadmap.role}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-zinc-400">
              {roadmap.levelLabel}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-4">{roadmap.title}</h1>
          <p className="text-zinc-300 text-lg leading-relaxed mt-3">{roadmap.intro}</p>

          <div className="flex flex-wrap items-center gap-5 mt-5 text-sm text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock className="w-4 h-4 text-fuchsia-400" aria-hidden="true" />
              ~{roadmap.months} mesi stimati
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="w-4 h-4 text-fuchsia-400" aria-hidden="true" />
              ~{roadmap.hoursPerWeek} ore a settimana
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-fuchsia-400" aria-hidden="true" />
              {roadmap.stops.length} tappe
            </span>
          </div>
          <p className="text-xs text-zinc-600 mt-2">
            Le stime sono indicative e valgono per chi parte da un livello medio e vi dedica
            le ore indicate ogni settimana.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 mb-8">
          <h2 className="text-white font-bold mb-3">Prima di iniziare serve questo</h2>
          <ul className="space-y-2">
            {roadmap.prerequisites.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-300">
                <span
                  aria-hidden="true"
                  className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-400/80 shrink-0"
                />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <RoadmapStops roadmap={roadmap} />

        {matchingJobs.length > 0 && (
          <section className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.05] p-5 sm:p-6 mb-8">
            <h2 className="text-white font-bold text-lg">Ruoli aperti per questa roadmap</h2>
            <p className="text-zinc-400 text-sm mt-1.5">
              Annunci verificati dal Career Market che richiedono le stesse keyword di questa
              roadmap. Ogni offerta mostra azienda, data di pubblicazione e trattamento dichiarato.
            </p>

            <ul className="mt-4 space-y-2">
              {matchingJobs.map((job) => (
                <li key={job.id}>
                  <Link
                    href={`/career-market/${job.id}`}
                    className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-white/10 bg-black/20 px-4 py-3 hover:border-emerald-500/40 transition-colors"
                  >
                    <span className="text-white text-sm font-semibold">{job.role}</span>
                    <span className="text-zinc-500 text-xs">
                      {job.company} · {job.location}
                    </span>
                    <span className="ml-auto text-emerald-300 text-xs font-semibold">
                      {formatSalary(job.salaryMin, job.salaryMax)}
                    </span>
                    <span className="w-full text-[11px] text-zinc-600">
                      pubblicato il {job.postedAt}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href={`/career-market?q=${encodeURIComponent(roadmap.role)}`}
              className="mt-4 inline-block text-sm font-semibold text-emerald-300 hover:text-emerald-200 transition-colors"
            >
              Vedi tutte le offerte per {roadmap.role.toLowerCase()} →
            </Link>
          </section>
        )}

        <section className="rounded-2xl border border-fuchsia-500/25 bg-fuchsia-500/[0.06] p-5 sm:p-6 mb-8">
          <h2 className="text-white font-bold text-lg">Vedi cosa ti manca davvero</h2>
          <p className="text-zinc-300 text-sm mt-2">
            Il primo passo e&apos; capire quali di queste skill hai gia&apos; nel CV e quali no.
            L&apos;analisi mostra lo score ATS e, per ogni penalita&apos;, il frammento di testo che la
            genera.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link
              href="/resume-score"
              className="btn-primary px-5 py-2.5 rounded-full text-sm font-bold text-white"
            >
              Analizza il tuo CV
            </Link>
            <Link
              href="/projects"
              className="px-5 py-2.5 rounded-full text-sm font-semibold border border-white/15 bg-white/5 hover:bg-white/10 transition-colors"
            >
              Scegli un progetto da costruire
            </Link>
          </div>
          <p className="text-xs text-zinc-500 mt-3">
            L&apos;avanzamento delle tappe resta salvato nel tuo browser anche senza account: con
            l&apos;account lo ritrovi su ogni dispositivo.
          </p>
        </section>

        {relatedProjects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500 mb-4">
              Progetti di questa roadmap
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {relatedProjects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-fuchsia-500/30 hover:bg-white/[0.05] transition-colors"
                >
                  <p className="text-white font-semibold text-sm">{project.title}</p>
                  <p className="text-xs text-zinc-500 mt-1">{project.stack.join(" · ")}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {relatedGuides.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500 mb-4">
              Guide collegate
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {relatedGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-fuchsia-500/30 hover:bg-white/[0.05] transition-colors"
                >
                  <p className="text-white font-semibold text-sm">{guide.title}</p>
                  <p className="text-xs text-zinc-500 mt-1">{guide.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <nav className="grid sm:grid-cols-2 gap-3" aria-label="Roadmap precedente e successiva">
          {prev ? (
            <Link
              href={`/roadmaps/${prev.slug}`}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-white/25 transition-colors"
            >
              <span className="text-xs text-zinc-500">Roadmap precedente</span>
              <p className="text-white text-sm font-semibold mt-1">{prev.title}</p>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/roadmaps/${next.slug}`}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-white/25 transition-colors text-right"
            >
              <span className="text-xs text-zinc-500">Roadmap successiva</span>
              <p className="text-white text-sm font-semibold mt-1">{next.title}</p>
            </Link>
          ) : (
            <span />
          )}
        </nav>

        <p className="text-xs text-zinc-700 mt-10">
          Contenuto a cura di Curriculuxe. Le stime di durata non sono una garanzia di
          risultato: dipendono da cosa sai gia&apos; e da quanto tempo ci dedichi.
        </p>
      </div>
    </ResourceShell>
  );
}