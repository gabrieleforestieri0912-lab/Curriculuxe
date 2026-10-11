import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, CheckCircle2, Clock3, Layers, Target } from "lucide-react";
import { getProject, projects, projectPlanLabels } from "@/content/projects";
import { getRoadmap } from "@/content/roadmaps";
import { getGuide } from "@/content/guides";
import ResourceShell from "@/components/ResourceShell";
import ResourceBreadcrumb from "@/components/resources/ResourceBreadcrumb";
import ProjectMilestones from "@/components/resources/ProjectMilestones";
import { absUrl, breadcrumbSchema, buildMetadata, jsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) {
    return { title: "Progetto non trovato", robots: { index: false, follow: false } };
  }
  return buildMetadata({
    lang: "it",
    title: `${project.title} - progetto da portfolio`,
    description: `${project.goal} Stack: ${project.stack.join(", ")}. Tempo stimato ${project.hours} ore, difficolta' ${project.difficulty}.`,
    path: `/projects/${project.slug}`,
    keywords: [
      ...project.stack,
      ...project.skills,
      "progetto portfolio",
      "progetto da mettere nel CV",
    ],
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((item) => item.slug === slug);
  const prev = projects[index - 1];
  const next = projects[index + 1];
  const roadmap = project.roadmapSlug ? getRoadmap(project.roadmapSlug) : undefined;
  const guide = project.guideSlug ? getGuide(project.guideSlug) : undefined;
  const projectUrl = absUrl(`/projects/${project.slug}`);

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
                  "@type": "TechArticle",
                  "@id": `${projectUrl}#article`,
                  headline: project.title,
                  description: project.goal,
                  inLanguage: "it",
                  url: projectUrl,
                  datePublished: "2026-10-01",
                  proficiencyLevel: project.difficulty,
                  dependencies: project.stack.join(", "),
                  author: { "@id": "https://curriculuxe.vercel.app/#organization" },
                  publisher: { "@id": "https://curriculuxe.vercel.app/#organization" },
                },
                breadcrumbSchema("it", `/projects/${project.slug}`, [
                  { name: "Risorse", path: "/projects" },
                  { name: "Progetti da portfolio", path: "/projects" },
                  { name: project.title, path: `/projects/${project.slug}` },
                ]),
              ],
            }),
          }}
        />

        <ResourceBreadcrumb
          trail={[
            { label: "Home", href: "/" },
            { label: "Progetti da portfolio", href: "/projects" },
            { label: project.title },
          ]}
        />

        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3 py-1 font-semibold text-indigo-200">
              {project.difficulty}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-zinc-400">
              {project.roles.join(" · ")}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-4">{project.title}</h1>
          <p className="text-zinc-300 text-lg leading-relaxed mt-3">{project.goal}</p>

          <div className="flex flex-wrap items-center gap-5 mt-5 text-sm text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="w-4 h-4 text-fuchsia-400" aria-hidden="true" />
              ~{project.hours} ore stimate
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-fuchsia-400" aria-hidden="true" />
              {project.stack.join(" · ")}
            </span>
          </div>
        </header>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 mb-8">
          <h2 className="flex items-center gap-2 text-white font-bold text-lg mb-3">
            <Target className="w-5 h-5 text-fuchsia-400" aria-hidden="true" />
            Nel CV scrivi cosi&apos;
          </h2>
          <p className="text-zinc-200 leading-relaxed">{project.cvBullet}</p>
          <p className="text-xs text-zinc-600 mt-3">
            Formato Azione + Strumento + Risultato: la stessa struttura che rende leggibile un
            bullet reale.
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 mb-8">
          <h2 className="flex items-center gap-2 text-white font-bold text-lg mb-3">
            <Layers className="w-5 h-5 text-fuchsia-400" aria-hidden="true" />
            Architettura
          </h2>
          <ul className="space-y-2">
            {project.architecture.map((item) => (
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

        <ProjectMilestones project={project} />

        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          <section className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] p-5">
            <h2 className="flex items-center gap-2 text-white font-bold mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-400" aria-hidden="true" />
              Errori comuni
            </h2>
            <ul className="space-y-2">
              {project.commonMistakes.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-zinc-300">
                  <span aria-hidden="true" className="mt-2 w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] p-5">
            <h2 className="flex items-center gap-2 text-white font-bold mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              Quando e&apos; finito
            </h2>
            <ul className="space-y-2">
              {project.qualityCriteria.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-zinc-300">
                  <span
                    aria-hidden="true"
                    className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="rounded-2xl border border-fuchsia-500/25 bg-fuchsia-500/[0.06] p-5 sm:p-6 mt-8">
          <h2 className="text-white font-bold text-lg">Rifinisci il CV con questo progetto</h2>
          <p className="text-zinc-300 text-sm mt-2">
            Quando il progetto e&apos; finito, il bullet qui sopra e&apos; gia&apos; pronto. Ti resta da
            verificare che il CV lo supporti e che l&apos;analisi ATS non trovi nulla da sistemare.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link
              href="/resume-score"
              className="btn-primary px-5 py-2.5 rounded-full text-sm font-bold text-white"
            >
              Analizza il tuo CV
            </Link>
            {roadmap && (
              <Link
                href={`/roadmaps/${roadmap.slug}`}
                className="px-5 py-2.5 rounded-full text-sm font-semibold border border-white/15 bg-white/5 hover:bg-white/10 transition-colors"
              >
                Roadmap {roadmap.role}
              </Link>
            )}
            {guide && (
              <Link
                href={`/guides/${guide.slug}`}
                className="px-5 py-2.5 rounded-full text-sm font-semibold border border-white/15 bg-white/5 hover:bg-white/10 transition-colors"
              >
                {guide.title}
              </Link>
            )}
          </div>
        </section>

        <nav className="grid sm:grid-cols-2 gap-3 mt-10" aria-label="Progetto precedente e successivo">
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-white/25 transition-colors"
            >
              <span className="text-xs text-zinc-500">Progetto precedente</span>
              <p className="text-white text-sm font-semibold mt-1">{prev.title}</p>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-white/25 transition-colors text-right"
            >
              <span className="text-xs text-zinc-500">Progetto successivo</span>
              <p className="text-white text-sm font-semibold mt-1">{next.title}</p>
            </Link>
          ) : (
            <span />
          )}
        </nav>

        <p className="text-xs text-zinc-700 mt-10">
          Le stime di tempo sono indicative per chi lavora nel tempo libero. La parte completa
          del progetto e&apos; inclusa dal piano {projectPlanLabels[project.minPlan]}.
        </p>
      </div>
    </ResourceShell>
  );
}