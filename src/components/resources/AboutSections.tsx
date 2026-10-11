import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { about } from "@/content/about";
import type { SiteLang } from "@/lib/seo";

/**
 * Contenuto della pagina Chi siamo, condiviso fra le due lingue.
 * Server component: il testo e' renderizzato nell'HTML, quindi indicizzabile.
 */
export default function AboutSections({ lang }: { lang: SiteLang }) {
  const content = about[lang];

  return (
    <div className="max-w-3xl mx-auto space-y-14">
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">{content.missionTitle}</h2>
        <div className="space-y-4">
          {content.missionBody.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="text-zinc-300 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-2">{content.loopTitle}</h2>
        <p className="text-zinc-400 mb-6">{content.loopIntro}</p>

        <ol className="relative pl-8 space-y-6">
          <span
            aria-hidden="true"
            className="absolute left-3 top-3 bottom-3 w-px bg-gradient-to-b from-indigo-400/50 via-fuchsia-500/40 to-transparent"
          />
          {content.loop.map((step, position) => (
            <li key={step.key} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-8 top-0.5 w-6 h-6 rounded-full border-2 border-fuchsia-500/50 bg-[#0b0b14] flex items-center justify-center text-[11px] font-bold text-fuchsia-300"
              >
                {position + 1}
              </span>
              <h3 className="text-white font-bold">{step.title}</h3>
              <p className="text-zinc-400 text-sm mt-1.5 leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-5">{content.principlesTitle}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {content.principles.map((principle) => (
            <div
              key={principle.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <h3 className="text-white font-bold flex items-start gap-2">
                <CheckCircle2
                  className="w-4 h-4 text-emerald-400 mt-1 shrink-0"
                  aria-hidden="true"
                />
                {principle.title}
              </h3>
              <p className="text-zinc-400 text-sm mt-2 leading-relaxed">{principle.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">{content.privacyTitle}</h2>
        <div className="space-y-4">
          {content.privacyBody.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="text-zinc-300 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">{content.marketTitle}</h2>
        <div className="space-y-4 mb-5">
          {content.marketBody.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="text-zinc-300 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
        <ul className="space-y-2">
          {content.marketChecks.map((check) => (
            <li key={check} className="flex items-start gap-2.5 text-sm text-zinc-300">
              <span
                aria-hidden="true"
                className="mt-2 w-1.5 h-1.5 rounded-full bg-fuchsia-400/80 shrink-0"
              />
              {check}
            </li>
          ))}
        </ul>
        <Link
          href="/career-market"
          className="mt-4 inline-block text-sm font-semibold text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
        >
          {lang === "en" ? "See the verified postings" : "Vedi gli annunci verificati"}
        </Link>
      </section>

      <section className="rounded-2xl border border-fuchsia-500/25 bg-fuchsia-500/[0.06] p-6">
        <h2 className="text-white font-bold text-lg">{content.contactTitle}</h2>
        <p className="text-zinc-300 text-sm mt-2">{content.contactBody}</p>
        <Link
          href="/contatti"
          className="mt-4 inline-block btn-primary px-5 py-2.5 rounded-full text-sm font-bold text-white"
        >
          {lang === "en" ? "Contact us" : "Contattaci"}
        </Link>
      </section>
    </div>
  );
}