import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobById, formatSalary } from "@/lib/jobs";
import ShellSwitch from "@/components/ShellSwitch";
import { absUrl, breadcrumbSchema, buildMetadata, jsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  const { jobCatalog } = await import("@/lib/jobs");
  return jobCatalog.map((j) => ({ id: j.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const job = getJobById(id);
  if (!job) return { title: "Offerta non trovata", robots: { index: false, follow: false } };
  return buildMetadata({
    lang: "it",
    title: `${job.role} ${job.company} - offerta di lavoro ${job.location}`,
    description: `${job.role} in ${job.company}, ${job.location}. ${job.description
      .replace(/\s+/g, " ")
      .slice(0, 130)}. Candidati con CV ottimizzato per ATS.`,
    path: `/career-market/${job.id}`,
    keywords: [
      `lavoro ${job.role}`,
      `offerta ${job.company}`,
      `${job.role} ${job.location}`,
      "offerte di lavoro tech",
      job.seniority,
    ],
    noindex: !job.postedAt,
  });
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = getJobById(id);
  if (!job) notFound();

  const jobUrl = absUrl(`/career-market/${job.id}`);

  return (
    <ShellSwitch>
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
            __html: jsonLd({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "JobPosting",
                  "@id": `${jobUrl}#jobposting`,
                  title: job.role,
                  description: job.description,
                  datePosted: job.postedAt,
                  employmentType: job.remote ? "FULL_TIME" : "FULL_TIME",
                  hiringOrganization: {
                    "@type": "Organization",
                    name: job.company,
                  },
                  jobLocationType: job.remote ? "TELECOMMUTE" : undefined,
                  jobLocation: {
                    "@type": "Place",
                    address: {
                      "@type": "PostalAddress",
                      addressLocality: job.location,
                      addressCountry: job.location.includes("USA") ? "US" : "IT",
                    },
                  },
                  industry: "Technology",
                  occupationalCategory: job.role,
                  ...(job.requiredSkills.length
                    ? {
                        skills: job.requiredSkills,
                        qualifications: job.requiredSkills.join(", "),
                      }
                    : {}),
                  baseSalary: {
                    "@type": "MonetaryAmount",
                    currency: "EUR",
                    value: {
                      "@type": "QuantitativeValue",
                      minValue: job.salaryMin,
                      maxValue: job.salaryMax,
                      unitText: "YEAR",
                    },
                  },
                  directApply: false,
                  url: jobUrl,
                },
                breadcrumbSchema("it", `/career-market/${job.id}`, [
                  { name: "Home", path: "/" },
                  { name: "Career Market", path: "/career-market" },
                  { name: job.role, path: `/career-market/${job.id}` },
                ]),
              ],
            }),
          }}
        />
      </div>
    </ShellSwitch>
  );
}
