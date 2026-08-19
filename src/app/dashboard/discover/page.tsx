"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface ScoredJob {
  id: string;
  company: string;
  role: string;
  location: string;
  remote: boolean;
  market: string;
  seniority: string;
  salaryMin: number;
  salaryMax: number;
  description: string;
  requiredSkills: string[];
  keywords: string[];
  postedAt: string;
  companySize: string;
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  reasons: string[];
  highlight: "alta" | "buona" | "media";
}

interface DigestResponse {
  digest: ScoredJob[];
  count: number;
  profileSource: "provided" | "latest-cv" | "default";
  generatedAt: string;
}

const MARKETS = [
  { id: "", label: "all" },
  { id: "italia", label: "italia" },
  { id: "europa", label: "europa" },
  { id: "usa", label: "usa" },
];

const SENIORITY_LABELS: Record<string, string> = {
  junior: "Junior",
  mid: "Mid",
  senior: "Senior",
};

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 70 ? "text-emerald-400" : score >= 45 ? "text-amber-400" : "text-rose-400";
  const circumference = 2 * Math.PI * 30;
  return (
    <div className="relative w-20 h-20 shrink-0">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="6" />
        <motion.circle
          cx="40"
          cy="40"
          r="30"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (circumference * score) / 100 }}
          transition={{ duration: 1 }}
          className={color}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-lg font-bold ${color}`}>{score}</span>
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  const { t, lang } = useLanguage();
  const tDiscover = t.discover as Record<string, string>;
  const router = useRouter();

  const [profile, setProfile] = useState("");
  const [market, setMarket] = useState("");
  const [digest, setDigest] = useState<ScoredJob[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profileSource, setProfileSource] = useState("latest-cv");
  const [generatedAt, setGeneratedAt] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const loadDigest = useCallback(
    async (profileText: string, marketValue: string) => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/jobs/discover", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileText: profileText.trim() || undefined, market: marketValue || undefined }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Errore");
          return;
        }
        setDigest(data.digest);
        setProfileSource(data.profileSource);
        setGeneratedAt(data.generatedAt);
      } catch {
        setError("Errore di rete. Riprova.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadDigest("", "");
  }, [loadDigest]);

  const handleRefresh = () => {
    setSelected(null);
    loadDigest(profile, market);
  };

  const handleMarketChange = (id: string) => {
    setMarket(id);
    setSelected(null);
    loadDigest(profile, id);
  };

  const tailorForJob = (job: ScoredJob) => {
    const tailorJob = {
      company: job.company,
      role: job.role,
      jobDescription: `${job.role} - ${job.company}\nSede: ${job.location}${job.remote ? " (remoto)" : ""}\nSeniority: ${SENIORITY_LABELS[job.seniority]}\n\n${job.description}\n\nRequisiti:\n${job.requiredSkills.join(", ")}`,
      market: job.market,
    };
    try {
      sessionStorage.setItem("curriculuxe:tailorJob", JSON.stringify(tailorJob));
    } catch {
      // sessionStorage potrebbe non essere disponibile; fallback al solo navigate.
    }
    router.push("/dashboard/cvs");
  };

  const sourceLabel =
    profileSource === "provided"
      ? tDiscover.profileProvided
      : profileSource === "default"
      ? tDiscover.profileDefault
      : tDiscover.profileAuto;

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 subtle-grid opacity-35" />
      <div className="relative z-10 pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-fuchsia-400 mb-3 px-3 py-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10">
              {tDiscover.eyebrow}
            </span>
            <h1 className="text-3xl font-bold text-white mb-2">{tDiscover.title}</h1>
            <p className="text-zinc-400">{tDiscover.subtitle}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-card rounded-2xl p-6 border border-white/10 mb-8"
          >
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  {tDiscover.profileLabel}
                </label>
                <textarea
                  value={profile}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setProfile(e.target.value)}
                  placeholder={tDiscover.profilePlaceholder}
                  className="w-full bg-black/25 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-fuchsia-500 focus:outline-none h-32 resize-none"
                />
                <p className="text-xs text-zinc-500 mt-2">{sourceLabel}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  {tDiscover.marketLabel}
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {MARKETS.map((m) => (
                    <button
                      key={m.id || "all"}
                      onClick={() => handleMarketChange(m.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        market === m.id
                          ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30"
                          : "bg-white/5 text-zinc-400 border border-white/10 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {tDiscover[`market${m.label.charAt(0).toUpperCase() + m.label.slice(1)}`] as string}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="w-full btn-primary py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      {tDiscover.refreshing}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                      </svg>
                      {tDiscover.refresh}
                    </>
                  )}
                </button>
                {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
              </div>
            </div>
          </motion.div>

          {loading && digest === null && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-8 h-8 border-2 border-fuchsia-500 border-t-transparent rounded-full"></div>
            </div>
          )}

          {!loading && digest && digest.length === 0 && (
            <div className="glass-card rounded-2xl p-10 text-center border border-white/10">
              <p className="text-zinc-400">{tDiscover.noResults}</p>
            </div>
          )}

          <div className="space-y-4">
            <AnimatePresence>
              {digest?.map((job, i) => {
                const open = selected === job.id;
                const highlightColor =
                  job.highlight === "alta"
                    ? "border-emerald-500/30"
                    : job.highlight === "buona"
                    ? "border-amber-500/20"
                    : "border-white/10";
                return (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`glass-card rounded-2xl border ${highlightColor} overflow-hidden`}
                  >
                    <button
                      onClick={() => setSelected(open ? null : job.id)}
                      className="w-full text-left p-6 flex flex-col sm:flex-row sm:items-center gap-5"
                    >
                      <ScoreRing score={job.score} />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-white font-bold">{job.role}</h3>
                          {job.remote && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs">
                              {tDiscover.remote}
                            </span>
                          )}
                        </div>
                        <p className="text-zinc-400 text-sm mb-2">
                          {job.company} · {job.location}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 rounded-full bg-white/5 text-zinc-300 text-xs border border-white/10">
                            {tDiscover.salary}: {new Intl.NumberFormat(lang === "en" ? "en-US" : "it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(job.salaryMin)} – {new Intl.NumberFormat(lang === "en" ? "en-US" : "it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(job.salaryMax)}
                          </span>
                          <span className="px-2 py-1 rounded-full bg-white/5 text-zinc-300 text-xs border border-white/10">
                            {tDiscover.seniority}: {SENIORITY_LABELS[job.seniority]}
                          </span>
                          <span className="px-2 py-1 rounded-full bg-white/5 text-zinc-300 text-xs border border-white/10">
                            {job.companySize}
                          </span>
                        </div>
                      </div>
                      <svg
                        className={`w-5 h-5 text-zinc-500 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <AnimatePresence>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 border-t border-white/10 pt-5">
                            <p className="text-zinc-300 text-sm leading-relaxed mb-5">{job.description}</p>

                            {job.reasons.length > 0 && (
                              <div className="mb-4">
                                <p className="text-zinc-500 text-xs font-medium mb-2">{tDiscover.matchReasons}</p>
                                <ul className="space-y-1">
                                  {job.reasons.map((reason) => (
                                    <li key={reason} className="flex items-start gap-2 text-sm text-zinc-400">
                                      <svg className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                      {reason}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {job.matchedKeywords.length > 0 && (
                              <div className="mb-4">
                                <p className="text-zinc-500 text-xs font-medium mb-2">Keyword in match</p>
                                <div className="flex flex-wrap gap-2">
                                  {job.matchedKeywords.map((kw) => (
                                    <span key={kw} className="px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs">
                                      {kw}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {job.missingKeywords.length > 0 && (
                              <div className="mb-5">
                                <p className="text-zinc-500 text-xs font-medium mb-2">{tDiscover.missingKeywords}</p>
                                <div className="flex flex-wrap gap-2">
                                  {job.missingKeywords.slice(0, 10).map((kw) => (
                                    <span key={kw} className="px-2 py-1 rounded-full bg-rose-500/15 text-rose-300 text-xs">
                                      {kw}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            <button
                              onClick={() => tailorForJob(job)}
                              className="w-full sm:w-auto btn-primary px-6 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              {tDiscover.tailor}
                            </button>
                            <p className="text-xs text-zinc-500 mt-2">{tDiscover.tailorHint}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {generatedAt && (
            <p className="text-center text-xs text-zinc-600 mt-8">
              {tDiscover.generatedAt}: {new Date(generatedAt).toLocaleString(lang === "en" ? "en-US" : "it-IT")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}