import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobById, formatSalary } from "@/lib/jobs";

export async function generateStaticParams() {
  const { jobCatalog } = await import("@/lib/jobs");
  return jobCatalog.map((j) => ({ id: j.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const job = getJobById(id);
  if (!job) return {};
  return {
    title: `${job.role} @ ${job.company} — ${job.location} | Curriculuxe Career Market`,
    description: job.description.slice(0, 155),
    alternates: { canonical: `/career-market/${job.id}` },
  };
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = getJobById(id);
  if (!job) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://curriculuxe.vercel.app";

  return (
    <div className="pt-20 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/career-market" className="text-sm text-zinc-500 hover:text-white">← Torna al Career Market</Link>
        <h1 className="text-3xl font-bold text-white mt-4">{job.role}</h1>
        <div className="text-zinc-400 mt-2">{job.company} · {job.location} · {job.companySize} · {job.seniority}</div>
        <div className="text-emerald-300 font-semibold mt-2">{formatSalary(job.salaryMin, job.salaryMax)}</div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-white font-bold">Descrizione</h2>
          <p className="text-zinc-300 mt-2 leading-relaxed">{job.description}</p>
          <h3 className="text-white font-semibold mt-6">Skill richieste</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {job.requiredSkills.map((s) => (
              <span key={s} className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300">{s}</span>
            ))}
          </div>
          <h3 className="text-white font-semibold mt-6">Keyword</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {job.keywords.map((k) => (
              <span key={k} className="px-2 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-xs text-fuchsia-300">{k}</span>
            ))}
          </div>
          <div className="text-xs text-zinc-600 mt-6">Pubblicato {job.postedAt} · Fonte employer diretta · Mai sponsorizzato</div>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 gap-3">
          <Link href={`/dashboard/discover`} className="btn-primary px-5 py-3 rounded-xl text-center text-sm font-bold text-white">
            Valuta il fit con Atlas →
          </Link>
          <Link href={`/analyze`} className="px-5 py-3 rounded-xl text-center text-sm font-bold border border-white/10 bg-white/5 text-white hover:bg-white/10">
            Adatta il CV per questa offerta
          </Link>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "JobPosting",
              title: job.role,
              hiringOrganization: { "@type": "Organization", name: job.company },
              jobLocation: { "@type": "Place", address: job.location },
              datePosted: job.postedAt,
              description: job.description,
              employmentType: job.remote ? "REMOTE" : "FULL_TIME",
              baseSalary: {
                "@type": "MonetaryAmount",
                currency: "EUR",
                value: { "@type": "QuantitativeValue", minValue: job.salaryMin, maxValue: job.salaryMax, unitText: "YEAR" },
              },
              url: `${baseUrl}/career-market/${job.id}`,
            }),
          }}
        />
      </div>
    </div>
  );
}
