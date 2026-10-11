import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, ExternalLink } from "lucide-react";
import { guides, getGuide, guideCategoryLabels, guideReadMinutes } from "@/content/guides";
import ShellSwitch from "@/components/ShellSwitch";
import ResourceBreadcrumb from "@/components/resources/ResourceBreadcrumb";
import CopyBox from "@/components/resources/CopyBox";
import ChecklistProgress from "@/components/resources/ChecklistProgress";
import { absUrl, breadcrumbSchema, buildMetadata, faqPageSchema, jsonLd, siteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) {
    return { title: "Guida non trovata", robots: { index: false, follow: false } };
  }
  return buildMetadata({
    lang: "it",
    title: guide.title,
    description: guide.metaDescription,
    path: `/guides/${guide.slug}`,
    type: "article",
    publishedTime: guide.publishedAt,
    modifiedTime: guide.updatedAt,
    keywords: [
      guideCategoryLabels[guide.category].toLowerCase(),
      ...guide.sections.map((section) => section.heading.slice(0, 40).toLowerCase()),
    ],
  });
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const index = guides.findIndex((item) => item.slug === slug);
  const prev = guides[index - 1];
  const next = guides[index + 1];
  const related = guide.related
    .map((relatedSlug) => getGuide(relatedSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const readMinutes = guideReadMinutes(guide);
  const guideUrl = absUrl(`/guides/${guide.slug}`);

  const wordCount = guide.sections.reduce(
    (total, section) =>
      total +
      section.paragraphs.join(" ").split(/\s+/).length +
      (section.example?.after ?? "").split(/\s+/).length,
    0
  );

  return (
    <ShellSwitch>
      <div className="max-w-7xl mx-auto">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Article",
                  "@id": `${guideUrl}#article`,
                  headline: guide.title,
                  description: guide.metaDescription,
                  inLanguage: "it",
                  articleSection: guideCategoryLabels[guide.category],
                  url: guideUrl,
                  mainEntityOfPage: { "@type": "WebPage", "@id": guideUrl },
                  datePublished: guide.publishedAt,
                  dateModified: guide.updatedAt,
                  wordCount,
                  timeRequired: `PT${readMinutes}M`,
                  author: { "@id": `${siteUrl}/#organization` },
                  publisher: { "@id": `${siteUrl}/#organization` },
                  image: [`${siteUrl}/og`],
                  ...(guide.sources.length
                    ? { citation: guide.sources.map((source) => source.href || source.label) }
                    : {}),
                  ...(prev ? { previousArticle: absUrl(`/guides/${prev.slug}`) } : {}),
                  ...(next ? { nextArticle: absUrl(`/guides/${next.slug}`) } : {}),
                },
                breadcrumbSchema("it", `/guides/${guide.slug}`, [
                  { name: "Risorse", path: "/guides" },
                  { name: "Guide", path: "/guides" },
                  { name: guide.title, path: `/guides/${guide.slug}` },
                ]),
                ...(guide.faq.length ? [faqPageSchema(guide.faq)] : []),
              ],
            }),
          }}
        />

        <ResourceBreadcrumb
          trail={[
            { label: "Home", href: "/" },
            { label: "Guide", href: "/guides" },
            { label: guide.title },
          ]}
        />

        <div className="grid lg:grid-cols-[minmax(0,1fr)_260px] gap-10">
          <article className="min-w-0">
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-1 font-semibold text-fuchsia-300">
                  {guideCategoryLabels[guide.category]}
                </span>
                <span className="inline-flex items-center gap-1 text-zinc-500">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  {readMinutes} min di lettura
                </span>
                <span className="inline-flex items-center gap-1 text-zinc-500">
                  <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
                  aggiornata il{" "}
                  {new Date(guide.updatedAt).toLocaleDateString("it-IT", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-white mt-4 leading-tight">
                {guide.title}
              </h1>
              <p className="text-zinc-300 text-lg leading-relaxed mt-4">{guide.intro}</p>
            </header>

            <div className="space-y-10">
              {guide.sections.map((section, sectionIndex) => (
                <section key={section.id} id={section.id} className="scroll-mt-28">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                    {section.heading}
                  </h2>

                  {section.paragraphs.map((paragraph, paragraphIndex) => (
                    <p
                      key={paragraphIndex}
                      className="text-zinc-300 leading-relaxed mt-3 first:mt-0"
                    >
                      {paragraph}
                    </p>
                  ))}

                  {section.bullets && (
                    <ul className="mt-4 space-y-2">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2.5 text-zinc-300">
                          <span
                            aria-hidden="true"
                            className="mt-2 w-1.5 h-1.5 rounded-full bg-fuchsia-400/80 shrink-0"
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.example && (
                    <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 overflow-hidden">
                      <p className="px-4 pt-4 pb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        {section.example.label}
                      </p>
                      {section.example.before && (
                        <div className="px-4 pb-3">
                          <p className="text-xs text-red-300/80 mb-1">Prima</p>
                          <pre className="text-sm text-zinc-400 whitespace-pre-wrap font-sans line-through decoration-red-400/40">
                            {section.example.before}
                          </pre>
                        </div>
                      )}
                      <div className="px-4 pb-3">
                        <p className="text-xs text-emerald-300/80 mb-1">Dopo</p>
                        <pre className="text-sm text-zinc-200 whitespace-pre-wrap font-sans">
                          {section.example.after}
                        </pre>
                      </div>
                      {section.example.note && (
                        <p className="px-4 pb-4 text-xs text-zinc-500 border-t border-white/5 pt-3">
                          {section.example.note}
                        </p>
                      )}
                    </div>
                  )}
                </section>
              ))}
            </div>

            <div className="mt-12 space-y-6">
              <ChecklistProgress
                contentType="guide"
                contentSlug={guide.slug}
                legend="Checklist della guida"
                progressLabel={`Avanzamento della checklist di ${guide.title}`}
                items={guide.checklist.map((label, checklistIndex) => ({
                  id: `check-${checklistIndex}`,
                  label,
                }))}
              />

              <CopyBox
                title="Portati via la checklist"
                content={guide.checklist.map((item) => `[ ] ${item}`).join("\n")}
              />

              <div className="rounded-2xl border border-fuchsia-500/25 bg-fuchsia-500/[0.06] p-5">
                <h2 className="text-white font-bold text-lg">Prova questa guida sul tuo CV</h2>
                <p className="text-zinc-300 text-sm mt-2">
                  Carica il tuo curriculum: il punteggio ATS ti dice quanto sei vicino ai
                  criteri descritti in questa guida, con il frammento di testo che genera ogni
                  penalita&apos;.
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <Link
                    href="/resume-score"
                    className="btn-primary px-5 py-2.5 rounded-full text-sm font-bold text-white"
                  >
                    Analizza il tuo CV
                  </Link>
                  <Link
                    href="/career-market"
                    className="px-5 py-2.5 rounded-full text-sm font-semibold border border-white/15 bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    Vedi le offerte aperte
                  </Link>
                </div>
              </div>
            </div>

            {guide.faq.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-bold text-white mb-4">Domande frequenti</h2>
                <div className="space-y-3">
                  {guide.faq.map((item) => (
                    <details
                      key={item.q}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 group"
                    >
                      <summary className="cursor-pointer text-white font-semibold text-sm list-none flex items-center justify-between gap-3">
                        {item.q}
                        <span
                          aria-hidden="true"
                          className="text-fuchsia-400 transition-transform group-open:rotate-45"
                        >
                          +
                        </span>
                      </summary>
                      <p className="text-zinc-400 text-sm mt-3 leading-relaxed">{item.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {guide.sources.length > 0 && (
              <section className="mt-10">
                <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500 mb-3">
                  Fonti
                </h2>
                <ul className="space-y-1.5">
                  {guide.sources.map((source) => (
                    <li key={source.label} className="text-sm text-zinc-400">
                      {source.href ? (
                        <a
                          href={source.href}
                          className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          {source.label}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        source.label
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {related.length > 0 && (
              <section className="mt-12">
                <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-500 mb-4">
                  Guide collegate
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {related.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/guides/${item.slug}`}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-fuchsia-500/30 hover:bg-white/[0.05] transition-colors"
                    >
                      <p className="text-xs text-fuchsia-400 font-semibold mb-1">
                        {guideCategoryLabels[item.category]}
                      </p>
                      <p className="text-white font-semibold text-sm leading-snug">{item.title}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <nav className="mt-12 grid sm:grid-cols-2 gap-3" aria-label="Guida precedente e successiva">
              {prev ? (
                <Link
                  href={`/guides/${prev.slug}`}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-white/25 transition-colors"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Guida precedente
                  </span>
                  <p className="text-white text-sm font-semibold mt-1.5 leading-snug group-hover:text-fuchsia-300 transition-colors">
                    {prev.title}
                  </p>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  href={`/guides/${next.slug}`}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-white/25 transition-colors text-right"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
                    Guida successiva
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <p className="text-white text-sm font-semibold mt-1.5 leading-snug group-hover:text-fuchsia-300 transition-colors">
                    {next.title}
                  </p>
                </Link>
              ) : (
                <span />
              )}
            </nav>
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-6">
              <nav aria-label="Indice della guida" className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">
                  In questa guida
                </p>
                <ol className="space-y-2">
                  {guide.sections.map((section, position) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="flex gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                      >
                        <span className="text-zinc-600 tabular-nums">{position + 1}.</span>
                        <span>{section.heading.replace(/^\d+\.\s*/, "")}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
                  Temi
                </p>
                <Link
                  href={`/guides?category=${guide.category}`}
                  className="inline-block rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-1 text-xs font-semibold text-fuchsia-300 hover:bg-fuchsia-500/20 transition-colors"
                >
                  {guideCategoryLabels[guide.category]}
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </ShellSwitch>
  );
}