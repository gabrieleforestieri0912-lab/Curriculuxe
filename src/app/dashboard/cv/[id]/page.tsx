"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";

interface CVData {
  _id?: string;
  id?: string;
  template?: string;
  personalInfo?: { name?: string; email?: string; phone?: string; city?: string };
  summary?: string;
  experience?: Array<{ role?: string; company?: string; startDate?: string; endDate?: string; description?: string }>;
  education?: Array<{ degree?: string; school?: string; year?: string }>;
  skills?: string;
  score?: number;
  atsScore?: number;
  createdAt?: string;
  applicationVersions?: Array<Record<string, unknown>>;
}

interface Version {
  id?: string;
  role?: string;
  company?: string;
  matchScore?: number;
  missingKeywords?: string[];
  rewrittenBullets?: string[];
  suggestedSkills?: string[];
  marketGuidance?: string[];
  market?: string;
  coverLetter?: string;
  applicationEmail?: string;
}

export default function CVPage() {
  const router = useRouter();
  const params = useParams();
  const [cv, setCv] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [targetCompany, setTargetCompany] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [targetMarket, setTargetMarket] = useState("italia");
  const [versionLoading, setVersionLoading] = useState(false);
  const [versionError, setVersionError] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const userData = localStorage.getItem("user");
      if (userData) return;

      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
      } catch {
        router.push("/login");
        return;
      }
    };

    checkAuth();

    async function fetchCV() {
      try {
        const res = await fetch(`/api/cv/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setCv(data);
        } else {
          router.push("/dashboard");
        }
      } catch {
        console.error("Error fetching CV:");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchCV();
  }, [params.id, router]);

  const handleAIRevision = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch("/api/cv/revise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv, prompt: aiPrompt }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiResponse(data.suggestions);
      }
    } catch {
      console.error("Error calling AI:");
    } finally {
      setAiLoading(false);
    }
  };

  const handleCreateVersion = async () => {
    if (!jobDescription.trim()) {
      setVersionError("Incolla una job description prima di creare la versione");
      return;
    }

    setVersionLoading(true);
    setVersionError("");

    try {
      const res = await fetch(`/api/cv/${params.id}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: targetCompany,
          role: targetRole,
          jobDescription,
          market: targetMarket,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setVersionError(data.error || "Errore durante la creazione della versione");
        return;
      }

      setCv((current) => ({
        ...(current || {}),
        score: data.analysis.score,
        atsScore: data.analysis.atsScore,
        applicationVersions: [data.version, ...((current as CVData)?.applicationVersions || [])],
      }));
      setTargetCompany("");
      setTargetRole("");
      setJobDescription("");
    } catch {
      console.error("Error creating version:");
      setVersionError("Errore nella comunicazione con il server");
    } finally {
      setVersionLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500/20 border-emerald-500/30";
    if (score >= 60) return "bg-yellow-500/20 border-yellow-500/30";
    return "bg-red-500/20 border-red-500/30";
  };

  if (loading) {
    return (
      <section className="gradient-bg-animated relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
      </section>
    );
  }

  const versions = cv?.applicationVersions as Version[] | undefined;

  return (
    <section className="gradient-bg-animated relative min-h-screen overflow-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="hidden sm:inline text-lg font-bold text-white">Curriculuxe</span>
          </Link>
          <div className="flex items-center gap-3">
            <button className="btn-primary px-3 sm:px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden sm:inline">Download PDF</span><span className="sm:hidden">PDF</span>
            </button>
            <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white px-2 sm:px-4 py-2">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-28 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-2xl p-5 sm:p-8 mb-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
                    <h1 className="text-2xl font-bold text-white">Il tuo Curriculum</h1>
                    <span className="text-sm text-zinc-400 capitalize">{cv?.template}</span>
                  </div>

                  <div className="bg-white text-slate-900 rounded-xl p-5 sm:p-8 shadow-2xl overflow-hidden">
                    <div className="border-b-2 border-slate-900 pb-4 mb-4">
                      <h2 className="text-2xl font-bold">{cv?.personalInfo?.name || "Nome Cognome"}</h2>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600">
                        <span>{cv?.personalInfo?.email}</span>
                        <span>•</span>
                        <span>{cv?.personalInfo?.phone}</span>
                        <span>•</span>
                        <span>{cv?.personalInfo?.city}</span>
                      </div>
                    </div>

                    {cv?.summary && (
                      <div className="mb-4">
                        <h3 className="text-sm font-bold uppercase text-slate-500 mb-2">Profilo Professionale</h3>
                        <p className="text-sm">{cv.summary}</p>
                      </div>
                    )}

                    {cv?.experience && cv.experience.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-sm font-bold uppercase text-slate-500 mb-2">Esperienza Lavorativa</h3>
                        {cv.experience.map((exp, i) => (
                          <div key={i} className="mb-3">
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                              <span className="font-semibold">{exp.role}</span>
                              <span className="text-sm text-slate-500">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <p className="text-sm text-slate-600">{exp.company}</p>
                            <p className="text-sm mt-1">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {cv?.education && cv.education.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-sm font-bold uppercase text-slate-500 mb-2">Istruzione</h3>
                        {cv.education.map((edu, i) => (
                          <div key={i} className="mb-3">
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                              <span className="font-semibold">{edu.degree}</span>
                              <span className="text-sm text-slate-500">{edu.year}</span>
                            </div>
                            <p className="text-sm text-slate-600">{edu.school}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {cv?.skills && (
                      <div className="mb-4">
                        <h3 className="text-sm font-bold uppercase text-slate-500 mb-2">Skills</h3>
                        <p className="text-sm">{cv.skills}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              <div className="lg:w-1/3 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`glass-card rounded-2xl p-6 border ${getScoreBg(cv?.score || 0)}`}
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Score CV</h3>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                        <motion.circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray="351"
                          initial={{ strokeDashoffset: 351 }}
                          animate={{ strokeDashoffset: 351 - (351 * (cv?.score || 0)) / 100 }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className={getScoreColor(cv?.score || 0)}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-3xl font-bold ${getScoreColor(cv?.score || 0)}`}>
                          {cv?.score || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-zinc-400 text-sm">
                    {cv?.score && cv.score >= 80 ? "Ottimo profilo!" : cv?.score && cv.score >= 60 ? "Buon profilo, migliorabile" : "Profilo da migliorare"}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Revisione AI</h3>
                  <p className="text-zinc-400 text-sm mb-4">
                    Chiedi all&apos;AI di migliorare o modificare il tuo curriculum
                  </p>
                  <textarea
                    value={aiPrompt}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAiPrompt(e.target.value)}
                    placeholder="Es: Migliora la descrizione del profilo professionale, rendila più accattivante..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-indigo-500 focus:outline-none h-28 resize-none"
                  />
                  <button
                    onClick={handleAIRevision}
                    disabled={aiLoading || !aiPrompt.trim()}
                    className="btn-primary w-full text-white py-3 rounded-full font-semibold text-sm mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {aiLoading ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Generazione...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Richiedi Revisione
                      </>
                    )}
                  </button>

                  {aiResponse && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl"
                    >
                      <h4 className="text-indigo-300 font-medium text-sm mb-2">Suggerimenti AI</h4>
                      <p className="text-white text-sm whitespace-pre-wrap">{aiResponse}</p>
                    </motion.div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Versione per candidatura</h3>
                  <p className="text-zinc-400 text-sm mb-4">
                    Crea una versione mirata del CV partendo dall&apos;offerta di lavoro.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <input
                      value={targetCompany}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTargetCompany(e.target.value)}
                      placeholder="Azienda"
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-indigo-500 focus:outline-none"
                    />
                    <input
                      value={targetRole}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTargetRole(e.target.value)}
                      placeholder="Ruolo"
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { id: "italia", label: "Italia" },
                      { id: "europa", label: "Europa" },
                      { id: "usa", label: "USA" },
                    ].map((market) => (
                      <button
                        key={market.id}
                        type="button"
                        onClick={() => setTargetMarket(market.id)}
                        className={`rounded-xl px-3 py-2 text-sm transition-all ${
                          targetMarket === market.id
                            ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                            : "bg-white/5 text-zinc-400 border border-white/10 hover:text-white"
                        }`}
                      >
                        {market.label}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={jobDescription}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJobDescription(e.target.value)}
                    placeholder="Incolla la job description: responsabilità, requisiti, tecnologie, seniority..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-indigo-500 focus:outline-none h-32 resize-none"
                  />
                  {versionError && <p className="text-red-400 text-sm mt-2">{versionError}</p>}
                  <button
                    onClick={handleCreateVersion}
                    disabled={versionLoading || !jobDescription.trim()}
                    className="btn-primary w-full text-white py-3 rounded-full font-semibold text-sm mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {versionLoading ? "Creo versione..." : "Crea versione mirata"}
                  </button>
                </motion.div>

                {versions && versions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28 }}
                    className="glass-card rounded-2xl p-6"
                  >
                    <h3 className="text-lg font-semibold text-white mb-4">Candidature salvate</h3>
                    <div className="space-y-4">
                      {versions.slice(0, 4).map((version) => (
                        <div key={version.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div>
                              <p className="text-white font-medium">{version.role}</p>
                              <p className="text-zinc-500 text-sm">{version.company}</p>
                            </div>
                            <span className="px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs">
                              Match {version.matchScore ?? "--"}/100
                            </span>
                          </div>
                          {version.missingKeywords && version.missingKeywords.length > 0 && (
                            <>
                              <p className="text-zinc-500 text-xs mb-2">Keyword mancanti</p>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {version.missingKeywords.slice(0, 8).map((keyword) => (
                                  <span key={keyword} className="px-2 py-1 rounded-full bg-red-500/15 text-red-300 text-xs">
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </>
                          )}
                          {version.rewrittenBullets && version.rewrittenBullets.length > 0 && (
                            <p className="text-zinc-400 text-xs">
                              Primo bullet suggerito: {version.rewrittenBullets[0]}
                            </p>
                          )}
                          {version.suggestedSkills && version.suggestedSkills.length > 0 && (
                            <div className="mt-3">
                              <p className="text-zinc-500 text-xs mb-2">Skill da valutare</p>
                              <div className="flex flex-wrap gap-2">
                                {version.suggestedSkills.slice(0, 8).map((skill) => (
                                  <span key={skill} className="px-2 py-1 rounded-full bg-indigo-500/15 text-indigo-300 text-xs">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {version.marketGuidance && version.marketGuidance.length > 0 && (
                            <div className="mt-3 rounded-lg bg-white/5 p-3">
                              <p className="text-zinc-500 text-xs mb-2">Regole mercato {version.market}</p>
                              <ul className="space-y-1">
                                {version.marketGuidance.map((tip) => (
                                  <li key={tip} className="text-zinc-400 text-xs">- {tip}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {(version.coverLetter || version.applicationEmail) && (
                            <details className="mt-3">
                              <summary className="cursor-pointer text-indigo-300 text-sm">Cover letter ed email</summary>
                              {version.coverLetter && (
                                <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-black/30 p-3 text-xs text-zinc-300">
                                  {version.coverLetter}
                                </pre>
                              )}
                              {version.applicationEmail && (
                                <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-black/30 p-3 text-xs text-zinc-300">
                                  {version.applicationEmail}
                                </pre>
                              )}
                            </details>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Dettagli CV</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <span className="text-zinc-400">Template</span>
                      <span className="text-white capitalize">{cv?.template}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <span className="text-zinc-400">Creato</span>
                      <span className="text-white">
                        {cv?.createdAt ? new Date(cv.createdAt).toLocaleDateString("it-IT") : "---"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <span className="text-zinc-400">Sezioni compilate</span>
                      <span className="text-white">
                        {[cv?.personalInfo?.name, cv?.summary, cv?.experience?.length, cv?.education?.length, cv?.skills]
                          .filter(Boolean).length}/5
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
