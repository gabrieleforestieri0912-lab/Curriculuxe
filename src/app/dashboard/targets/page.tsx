"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ArrowLeft, Building2, BadgeCheck, AlertTriangle, ExternalLink, Sparkles, Target } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { listCatalogCompanies, getCompanyContext, TARGET_LIMITS } from "@/lib/companies";

interface TargetRow {
  id: string;
  company: string;
  role: string;
  questions: Array<{ q: string; area: string }>;
  answers: string[];
  plan: {
    fitSummary: string;
    fitScore: number;
    gaps?: Array<{ area: string; why: string; action: string }>;
    prepPlan?: Array<{ week: string; focus: string; actions: string[] }>;
    interviewProcess?: string[];
    expectedQuestions?: string[];
    resources?: Array<{ label: string; href: string }>;
  } | null;
  status: string;
  updatedAt?: string;
}

const WEEK_COLORS = [
  { badge: "from-fuchsia-500 to-pink-600", text: "text-fuchsia-300", border: "border-fuchsia-500/30" },
  { badge: "from-indigo-500 to-blue-600", text: "text-indigo-300", border: "border-indigo-500/30" },
  { badge: "from-emerald-500 to-teal-600", text: "text-emerald-300", border: "border-emerald-500/30" },
  { badge: "from-amber-500 to-orange-600", text: "text-amber-300", border: "border-amber-500/30" },
];

export default function TargetsPage() {
  const { t, lang } = useLanguage();
  const tT = t.targets as Record<string, string>;
  const T = (k: string) => tT[k] as string;

  const [targets, setTargets] = useState<TargetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [customCompany, setCustomCompany] = useState("");
  const [role, setRole] = useState("");
  const [adding, setAdding] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [error, setError] = useState("");
  const [planName, setPlanName] = useState("free");

  const companies = listCatalogCompanies();
  const filtered = search.trim()
    ? companies.filter((c) => c.toLowerCase().includes(search.trim().toLowerCase())).slice(0, 12)
    : companies.slice(0, 12);
  const pickedCompany = customCompany.trim() || "";
  const selected = targets.find((x) => x.id === selectedId) || null;
  const limit = TARGET_LIMITS[planName] ?? TARGET_LIMITS.free;

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/targets");
      if (res.ok) {
        const data = await res.json();
        setTargets((data.targets || []) as TargetRow[]);
      }
      try {
        const cached = localStorage.getItem("user");
        if (cached) setPlanName(JSON.parse(cached).plan || "free");
      } catch { /* ignore */ }
    } catch {
      setError(T("errorServer"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selected) {
      const init: Record<number, string> = {};
      (selected.answers || []).forEach((a, i) => { init[i] = a; });
      setAnswers(init);
      setError("");
    }
  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  const addTarget = async (company: string) => {
    setError("");
    if (!company.trim() || !role.trim()) {
      setError(T("errorEmpty"));
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("/api/targets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: company.trim(), role: role.trim(), lang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || T("errorServer"));
      setTargets((prev) => [data.target as TargetRow, ...prev]);
      setSelectedId((data.target as TargetRow).id);
      setSearch("");
      setCustomCompany("");
      if (data.noCredits) setError(T("noCredits"));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setAdding(false);
    }
  };

  const generatePlan = async () => {
    if (!selected) return;
    setError("");
    const list = (selected.questions || []).map((_, i) => (answers[i] || "").trim());
    if (list.some((a) => !a)) {
      setError(T("errorEmpty"));
      return;
    }
    setGeneratingPlan(true);
    try {
      const res = await fetch(`/api/targets/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: list, lang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || T("errorServer"));
      setTargets((prev) => prev.map((x) => (x.id === selected.id ? (data.target as TargetRow) : x)));
      if (data.noCredits) setError(T("noCredits"));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setGeneratingPlan(false);
    }
  };

  const removeTarget = async (id: string) => {
    if (!window.confirm(T("confirmDelete"))) return;
    try {
      await fetch(`/api/targets/${id}`, { method: "DELETE" });
      setTargets((prev) => prev.filter((x) => x.id !== id));
      if (selectedId === id) setSelectedId(null);
    } catch {
      setError(T("errorServer"));
    }
  };

  const areaLabel = (area: string) =>
    area === "code" ? T("areaCode") : area === "experience" ? T("areaExperience") : T("areaSkills");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 py-28">
      <div className="max-w-5xl mx-auto">
        {!selected ? (
          <>
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-fuchsia-400 mb-3 px-3 py-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10">
                <Target className="w-3.5 h-3.5" />
                {planName} · {targets.length}/{limit} {T("limitOf")}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{T("title")}</h1>
              <p className="text-zinc-400 max-w-2xl mx-auto">{T("subtitle")}</p>
            </div>

            {targets.length >= limit && (
              <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200 flex items-center justify-between gap-3">
                <span>{T("limitReached")} ({limit}).</span>
                <Link href="/#pricing" className="font-semibold underline underline-offset-2 shrink-0">
                  {T("upgrade")}
                </Link>
              </div>
            )}

            <div className="glass-card rounded-2xl p-6 border border-white/10 mb-8">
              <div className="grid sm:grid-cols-2 gap-3 mb-3">
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCustomCompany(""); }}
                  placeholder={T("searchPlaceholder")}
                  className="bg-black/25 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-indigo-400 placeholder:text-zinc-600"
                />
                <input
                  value={customCompany}
                  onChange={(e) => { setCustomCompany(e.target.value); setSearch(""); }}
                  placeholder={T("customPlaceholder")}
                  className="bg-black/25 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-indigo-400 placeholder:text-zinc-600"
                />
              </div>
              {!customCompany && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {filtered.map((c) => (
                    <button
                      key={c}
                      onClick={() => addTarget(c)}
                      disabled={adding || targets.length >= limit}
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-zinc-300 hover:border-fuchsia-500/40 hover:text-white transition-all disabled:opacity-40"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder={T("rolePlaceholder")}
                  className="flex-1 bg-black/25 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-indigo-400 placeholder:text-zinc-600"
                />
                <button
                  onClick={() => addTarget(pickedCompany || filtered[0] || "")}
                  disabled={adding || targets.length >= limit}
                  className="btn-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  {T("add")}
                </button>
              </div>
              {error && <p role="alert" className="text-red-400 text-sm mt-3">{error}</p>}
            </div>

            {targets.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <p className="text-white font-semibold">{T("empty")}</p>
                <p className="text-zinc-500 text-sm mt-1">{T("emptyDesc")}</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {targets.map((x) => {
                  const ctx = getCompanyContext(x.company, lang);
                  return (
                    <div
                      key={x.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-fuchsia-500/30 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-white font-bold">{x.company}</h3>
                          <p className="text-zinc-400 text-sm">{x.role}</p>
                        </div>
                        <button
                          onClick={() => removeTarget(x.id)}
                          aria-label={T("delete")}
                          className="text-zinc-600 hover:text-red-400 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${x.status === "planned" ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300" : "bg-indigo-500/15 border-indigo-500/30 text-indigo-300"}`}>
                          {x.status === "planned" ? "✓" : "•"} {x.status}
                        </span>
                        {ctx.verified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
                            <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                            {T("verified")}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                            AI
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedId(x.id)}
                        className="mt-4 w-full rounded-xl bg-white/5 border border-white/10 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-all"
                      >
                        {x.status === "planned" ? T("planFit") : T("questionsTitle")} →
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <TargetDetail
            target={selected}
            lang={lang}
            T={T}
            answers={answers}
            setAnswers={setAnswers}
            areaLabel={areaLabel}
            generatingPlan={generatingPlan}
            generatePlan={generatePlan}
            error={error}
            onBack={() => setSelectedId(null)}
          />
        )}
      </div>
    </div>
  );
}

function TargetDetail({ target, lang, T, answers, setAnswers, areaLabel, generatingPlan, generatePlan, error, onBack }: {
  target: TargetRow;
  lang: string;
  T: (k: string) => string;
  answers: Record<number, string>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  areaLabel: (a: string) => string;
  generatingPlan: boolean;
  generatePlan: () => void;
  error: string;
  onBack: () => void;
}) {
  const ctx = getCompanyContext(target.company, lang);
  const plan = target.plan;

  return (
    <div>
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        {T("backToList")}
      </button>

      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{target.company}</h1>
            <p className="text-zinc-400 mt-1">{target.role}{ctx.hq ? ` · ${ctx.hq}` : ""}</p>
          </div>
          {ctx.verified ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-3 py-1.5">
              <BadgeCheck className="w-4 h-4" />
              {T("verified")}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/25 rounded-full px-3 py-1.5">
              <AlertTriangle className="w-4 h-4" />
              {T("unverified")}
            </span>
          )}
        </div>
        {(ctx.topSkills.length > 0 || ctx.salaryRange) && (
          <div className="flex flex-wrap gap-2 mt-4">
            {ctx.topSkills.slice(0, 6).map((s) => (
              <span key={s} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300">{s}</span>
            ))}
            {ctx.salaryRange && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-semibold text-emerald-300">
                {ctx.salaryRange}
              </span>
            )}
          </div>
        )}
        <a
          href={ctx.careersUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-indigo-300 hover:text-indigo-200"
        >
          {T("verifyCareers")}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {!plan ? (
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-1">{T("questionsTitle")}</h2>
          <p className="text-zinc-400 text-sm mb-6">{T("questionsDesc")}</p>
          <div className="space-y-5">
            {(target.questions || []).map((q, i) => (
              <div key={i}>
                <p className="text-sm text-white font-medium mb-2">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 rounded-full px-2 py-0.5 mr-2 align-middle">
                    {areaLabel(q.area)}
                  </span>
                  {q.q}
                </p>
                <textarea
                  value={answers[i] || ""}
                  onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))}
                  placeholder={T("answerPlaceholder")}
                  rows={3}
                  className="w-full bg-black/25 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-400 resize-none placeholder:text-zinc-600"
                />
              </div>
            ))}
          </div>
          {error && <p role="alert" className="text-red-400 text-sm mt-4">{error}</p>}
          <button
            onClick={generatePlan}
            disabled={generatingPlan}
            className="btn-primary w-full mt-6 text-white py-3.5 rounded-full font-bold inline-flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {generatingPlan ? T("generating") : T("generatePlan")}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10">
            <div className="flex items-center gap-5">
              <div className="relative w-24 h-24 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none" stroke="url(#targetFitGrad)"
                    strokeWidth="4" strokeLinecap="round" strokeDasharray="100"
                    strokeDashoffset={100 - Math.max(0, Math.min(100, plan.fitScore || 0))}
                  />
                  <defs>
                    <linearGradient id="targetFitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#e879f9" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">{plan.fitScore ?? "—"}</span>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white mb-1">{T("planFit")}</h2>
                <p className="text-zinc-300 text-sm leading-relaxed">{plan.fitSummary}</p>
              </div>
            </div>
          </div>

          {(plan.gaps || []).length > 0 && (
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <h2 className="font-bold text-white mb-4">{T("planGaps")}</h2>
              <div className="space-y-3">
                {plan.gaps!.map((g) => (
                  <div key={g.area} className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <p className="text-white font-semibold text-sm">{g.area}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">{g.why}</p>
                    <p className="text-zinc-300 text-sm mt-1.5">→ {g.action}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(plan.prepPlan || []).length > 0 && (
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <h2 className="font-bold text-white mb-4">{T("planPrep")}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {plan.prepPlan!.map((w, i) => {
                  const st = WEEK_COLORS[i % WEEK_COLORS.length];
                  return (
                    <div key={i} className={`rounded-2xl border ${st.border} bg-white/[0.03] p-5`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r ${st.badge} text-white`}>
                          {T("week")} {w.week}
                        </span>
                      </div>
                      <p className="text-white font-bold text-sm">{w.focus}</p>
                      <ul className="mt-2 space-y-1.5">
                        {(w.actions || []).map((a) => (
                          <li key={a} className="text-xs text-zinc-300 flex gap-1.5">
                            <span className={st.text}>•</span>
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {(plan.interviewProcess || []).length > 0 && (
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <h2 className="font-bold text-white mb-4">{T("planProcess")}</h2>
              <ol className="space-y-2.5">
                {(plan.interviewProcess || []).map((s, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-zinc-400 shrink-0">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {(plan.expectedQuestions || []).length > 0 && (
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <h2 className="font-bold text-white mb-4">{T("planQuestions")}</h2>
              <ul className="space-y-2">
                {(plan.expectedQuestions || []).map((q) => (
                  <li key={q} className="rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-sm text-zinc-200">
                    “{q}”
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(plan.resources || []).length > 0 && (
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <h2 className="font-bold text-white mb-4">{T("planLinks")}</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {(plan.resources || []).map((r) => (
                  <Link
                    key={r.href + r.label}
                    href={r.href}
                    className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm font-semibold text-white hover:border-fuchsia-500/40 hover:bg-white/10 transition-all"
                  >
                    {r.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}
        </div>
      )}

      <AnimatePresence>
        {generatingPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm px-6"
          >
            <div className="text-center">
              <div className="animate-spin w-10 h-10 mx-auto mb-4 border-2 border-fuchsia-500 border-t-transparent rounded-full" />
              <p className="text-white font-semibold">{T("generating")}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
