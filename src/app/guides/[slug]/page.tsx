import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardList } from "lucide-react";
import { guides, getGuide } from "@/lib/guides";
import ResourceShell from "@/components/ResourceShell";

const baseUrl = process.env.NEXT_PUBLIC_URL || "https://curriculuxe.vercel.app";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: "Guida non trovata | Curriculuxe" };
  return {
    title: `${guide.title} | Curriculuxe`,
    description: guide.excerpt,
    alternates: { canonical: `/guides/${guide.slug}` },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const index = guides.findIndex((g) => g.slug === slug);
  const prev = guides[index - 1];
  const next = guides[index + 1];

  return (
    <ResourceShell>
      <div className="max-w-3xl mx-auto">
        <Link href="/guides" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Tutte le guide
        </Link>

        <span className="inline-block text-xs font-bold uppercase tracking-widest text-fuchsia-400 mb-3 px-3 py-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10">
          Guida · {guide.readMin} min
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{guide.title}</h1>
        <p className="text-zinc-400 text-lg leading-relaxed mb-10">{guide.intro}</p>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: guide.title,
              description: guide.excerpt,
              url: `${baseUrl}/guides/${guide.slug}`,
              author: { "@type": "Organization", name: "Curriculuxe" },
            }),
          }}
        />

        <div className="space-y-10">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">{section.heading}</h2>
              <div className="space-y-3">
                {section.paragraphs.map((p, i) => (
                  <p key={i} className="text-zinc-300 leading-relaxed">{p}</p>
                ))}
              </div>
            </section>
          ))}

          <section className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.07] p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
              <ClipboardList className="w-5 h-5 text-emerald-300" />
              Checklist
            </h2>
            <ul className="space-y-2.5">
              {guide.checklist.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-black/40 p-6">
            <h2 className="text-lg font-bold text-white mb-3">{guide.templateTitle}</h2>
            <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-300 leading-relaxed">{guide.templateText}</pre>
          </section>
        </div>

        <div className="mt-12 rounded-2xl border border-fuchsia-500/25 bg-fuchsia-500/[0.07] p-6 sm:p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Metti in pratica sul tuo CV</h2>
          <p className="text-zinc-400 text-sm mb-5">Analizza il tuo curriculum gratis e applica subito questa guida.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/analyze" className="btn-primary text-white px-6 py-3 rounded-full font-semibold text-sm">
              Analizza il tuo CV
            </Link>
            <Link href="/register" className="btn-secondary text-white px-6 py-3 rounded-full font-medium text-sm">
              Inizia gratis
            </Link>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between gap-4">
          {prev ? (
            <Link href={`/guides/${prev.slug}`} className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{prev.title}</span>
              <span className="sm:hidden">Precedente</span>
            </Link>
          ) : <span />}
          {next && (
            <Link href={`/guides/${next.slug}`} className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
              <span className="hidden sm:inline">{next.title}</span>
              <span className="sm:hidden">Successiva</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </ResourceShell>
  );
}
