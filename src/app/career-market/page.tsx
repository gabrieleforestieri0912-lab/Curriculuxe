import type { Metadata } from "next";
import Link from "next/link";
import { jobCatalog, formatSalary } from "@/lib/jobs";
import ResourceShell from "@/components/ResourceShell";

export const metadata: Metadata = {
  title: "Career Market — Offerte verificate senza login | Curriculuxe",
  description:
    "Esplora offerte verificate da feed employer diretti, filtrabili per ruolo, location, remote e seniority. Nessun login per navigare.",
  alternates: { canonical: "/career-market" },
};

export default function CareerMarketPage({
  searchParams,
}: {
  searchParams?: { q?: string; location?: string; workplace?: string; market?: string; seniority?: string };
}) {
  const q = (searchParams?.q || "").toLowerCase();
  const location = (searchParams?.location || "").toLowerCase();
  const workplace = searchParams?.workplace || "any";
  const market = searchParams?.market || "any";
  const seniority = searchParams?.seniority || "any";

  const filtered = jobCatalog.filter((job) => {
    if (q && !`${job.role} ${job.company} ${job.keywords.join(" ")}`.toLowerCase().includes(q)) return false;
    if (location && !job.location.toLowerCase().includes(location)) return false;
    if (workplace === "remote" && !job.remote) return false;
    if (workplace === "onsite" && job.remote) return false;
    if (market !== "any" && job.market !== market) return false;
    if (seniority !== "any" && job.seniority !== seniority) return false;
    return true;
  });

  return (
    <ResourceShell>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Career Market</h1>
            <p className="text-zinc-400 mt-2">
              {jobCatalog.length} ruoli verificati · ultimo controllo 18 set 2026 · mai ranking sponsorizzati
            </p>
            <p className="text-xs text-zinc-600 mt-1">I filtri restano nel link quando lo condividi.</p>
          </div>
          <Link href="/dashboard/discover" className="btn-primary px-5 py-2.5 rounded-full text-sm font-bold text-white">
            Digest personalizzato con Atlas →
          </Link>
        </div>

        <form method="GET" className="grid sm:grid-cols-5 gap-3 p-4 rounded-2xl border border-white/10 bg-white/[0.03] mb-6">
          <input name="q" defaultValue={searchParams?.q || ""} placeholder="Ruolo o azienda" className="px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-sm text-white placeholder:text-zinc-600" />
          <input name="location" defaultValue={searchParams?.location || ""} placeholder="Location" className="px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-sm text-white placeholder:text-zinc-600" />
          <select name="workplace" defaultValue={workplace} className="px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-sm text-white">
            <option value="any">Qualsiasi sede</option>
            <option value="remote">Remoto</option>
            <option value="onsite">On-site / ibrido</option>
          </select>
          <select name="market" defaultValue={market} className="px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-sm text-white">
            <option value="any">Tutti i mercati</option>
            <option value="italia">Italia</option>
            <option value="europa">Europa</option>
            <option value="usa">USA</option>
          </select>
          <select name="seniority" defaultValue={seniority} className="px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-sm text-white">
            <option value="any">Qualsiasi seniority</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
          </select>
          <button type="submit" className="sm:col-span-5 btn-primary py-2.5 rounded-xl text-sm font-bold text-white">
            Applica filtri
          </button>
        </form>

        <div className="flex gap-2 flex-wrap mb-4">
          {[
            { label: "AI + ML", href: "/career-market?q=machine%20learning" },
            { label: "Remote", href: "/career-market?workplace=remote" },
            { label: "Entry", href: "/career-market?seniority=junior" },
            { label: "Senior+", href: "/career-market?seniority=senior" },
          ].map((d) => (
            <Link key={d.label} href={d.href} className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-zinc-300 hover:text-white">
              {d.label}
            </Link>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((job) => (
            <Link
              key={job.id}
              href={`/career-market/${job.id}`}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-fuchsia-500/30 hover:bg-white/[0.05] transition-colors"
            >
              <div className="text-xs text-zinc-500">{job.company} · {job.companySize}</div>
              <h3 className="text-white font-bold mt-1 line-clamp-2">{job.role}</h3>
              <div className="text-sm text-zinc-400 mt-1">{job.location} {job.remote ? "· Remoto" : ""}</div>
              <div className="text-sm text-emerald-300 font-semibold mt-2">{formatSalary(job.salaryMin, job.salaryMax)}</div>
              <p className="text-sm text-zinc-500 mt-3 line-clamp-3">{job.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {job.requiredSkills.slice(0, 4).map((s) => (
                  <span key={s} className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-zinc-300">{s}</span>
                ))}
              </div>
              <div className="text-xs text-zinc-600 mt-3">Pubblicato {job.postedAt}</div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-zinc-500 mt-10">Nessuna offerta corrisponde ai filtri.</p>
        )}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: filtered.slice(0, 10).map((job, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `https://curriculuxe.vercel.app/career-market/${job.id}`,
                name: `${job.role} @ ${job.company}`,
              })),
            }),
          }}
        />
      </div>
    </ResourceShell>
  );
}
