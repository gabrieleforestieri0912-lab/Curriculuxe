"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code, Server, Layers, Smartphone, Cloud, Database, Brain, Palette,
  Briefcase, Bug, GraduationCap, Sprout, Award, Shuffle, Compass,
  Rocket, TrendingUp, Globe, Laptop, ArrowLeft, ArrowRight, Check,
  Plus, X, Sparkles, Target, Route as RouteIcon, FileText, MessagesSquare, Map,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { OnboardingPlan } from "@/lib/ai";

interface RoleDef {
  id: string;
  label: string;
  icon: typeof Code;
  skills: string[];
}

const ROLES: RoleDef[] = [
  { id: "frontend", label: "Frontend Developer", icon: Code, skills: ["React", "TypeScript", "Next.js", "Tailwind", "JavaScript", "Testing", "Accessibility", "Redux"] },
  { id: "backend", label: "Backend Developer", icon: Server, skills: ["Node.js", "Python", "SQL", "PostgreSQL", "Docker", "AWS", "REST API", "Redis"] },
  { id: "fullstack", label: "Full Stack Developer", icon: Layers, skills: ["React", "Node.js", "TypeScript", "SQL", "Docker", "AWS", "CI/CD", "GraphQL"] },
  { id: "mobile", label: "Mobile Developer", icon: Smartphone, skills: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase", "TypeScript"] },
  { id: "devops", label: "DevOps / Cloud Engineer", icon: Cloud, skills: ["Kubernetes", "Docker", "Terraform", "AWS", "CI/CD", "Linux", "Monitoring", "Ansible"] },
  { id: "data", label: "Data Scientist / Analyst", icon: Database, skills: ["Python", "SQL", "Pandas", "Machine Learning", "Power BI", "Statistics", "ETL", "Excel"] },
  { id: "ai", label: "AI Engineer", icon: Brain, skills: ["Python", "PyTorch", "LLMs", "RAG", "Hugging Face", "SQL", "MLOps", "Statistics"] },
  { id: "ux", label: "UX/UI Designer", icon: Palette, skills: ["Figma", "Design System", "Prototyping", "User Research", "Wireframing", "Miro"] },
  { id: "pm", label: "Product Manager", icon: Briefcase, skills: ["Agile", "Scrum", "Roadmap", "Jira", "Stakeholder", "Metrics", "Discovery", "SQL"] },
  { id: "qa", label: "QA Engineer", icon: Bug, skills: ["Playwright", "Cypress", "API Testing", "SQL", "CI/CD", "TestRail"] },
];

const SITUATION_ICONS: Record<string, typeof Code> = {
  student: GraduationCap,
  junior: Sprout,
  mid: Code,
  senior: Award,
  switcher: Shuffle,
  seeking: Compass,
};

const GOAL_ICONS: Record<string, typeof Code> = {
  "first-job": Rocket,
  "raise": TrendingUp,
  "bigtech": Globe,
  "freelance": Laptop,
  "promo": Award,
};

const STEPS = ["situation", "role", "goal", "skills", "experience", "constraints", "review"] as const;

const PHASE_STYLES = [
  {
    badge: "from-fuchsia-500 to-pink-600",
    card: "border-fuchsia-500/30",
    text: "text-fuchsia-300",
    bar: "from-fuchsia-300 via-fuchsia-500 to-pink-600",
    glow: "shadow-[0_2px_12px_rgba(232,121,249,0.45)]",
  },
  {
    badge: "from-indigo-500 to-blue-600",
    card: "border-indigo-500/30",
    text: "text-indigo-300",
    bar: "from-indigo-300 via-indigo-500 to-blue-600",
    glow: "shadow-[0_2px_12px_rgba(129,140,248,0.45)]",
  },
  {
    badge: "from-emerald-500 to-teal-600",
    card: "border-emerald-500/30",
    text: "text-emerald-300",
    bar: "from-emerald-300 via-emerald-500 to-teal-600",
    glow: "shadow-[0_2px_12px_rgba(52,211,153,0.45)]",
  },
  {
    badge: "from-amber-500 to-orange-600",
    card: "border-amber-500/30",
    text: "text-amber-300",
    bar: "from-amber-300 via-amber-500 to-orange-600",
    glow: "shadow-[0_2px_12px_rgba(251,191,36,0.45)]",
  },
  {
    badge: "from-sky-500 to-cyan-600",
    card: "border-sky-500/30",
    text: "text-sky-300",
    bar: "from-sky-300 via-sky-500 to-cyan-600",
    glow: "shadow-[0_2px_12px_rgba(56,189,248,0.45)]",
  },
];

interface Answers {
  situation: string;
  situationLabel: string;
  role: string;
  roleLabel: string;
  goal: string;
  goalLabel: string;
  skills: string[];
  years: string;
  story: string;
  study: string;
  market: string;
  marketLabel: string;
  availability: string;
  availabilityLabel: string;
  ral: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const ob = t.onboarding as Record<string, unknown>;
  const T = (k: string) => ob[k] as string;

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Answers>({
    situation: "", situationLabel: "", role: "", roleLabel: "",
    goal: "", goalLabel: "", skills: [], years: "", story: "", study: "",
    market: "", marketLabel: "", availability: "", availabilityLabel: "", ral: "",
  });
  const [customSkill, setCustomSkill] = useState("");
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState<OnboardingPlan | null>(null);
  const [noCredits, setNoCredits] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [doneActions, setDoneActions] = useState<Record<string, boolean>>({});

  const progressStorageKey = (uid: string | null, headline: string) =>
    `curriculuxe:plan-progress:${uid || "anon"}:${headline.slice(0, 40)}`;

  // Carica i check salvati quando arriva (o cambia) il piano.
  useEffect(() => {
    if (!plan) return;
    try {
      const raw = localStorage.getItem(progressStorageKey(userId, plan.headline));
      setDoneActions(raw ? JSON.parse(raw) : {});
    } catch {
      setDoneActions({});
    }
  }, [plan, userId]);

  const toggleAction = (key: string) => {
    setDoneActions((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        if (plan) localStorage.setItem(progressStorageKey(userId, plan.headline), JSON.stringify(next));
      } catch { /* ignore */ }
      return next;
    });
  };

  const situations = (ob.situations as Array<{ id: string; label: string }>) || [];
  const goals = (ob.goals as Array<{ id: string; label: string }>) || [];
  const yearsList = (ob.years as string[]) || [];
  const markets = (ob.markets as Array<{ id: string; label: string }>) || [];
  const availabilities = (ob.availabilities as Array<{ id: string; label: string }>) || [];
  const selectedRole = ROLES.find((r) => r.id === answers.role);
  const needsStudy = answers.situation === "student" || answers.situation === "switcher";

  // Se l'onboarding è già completato, torna alla dashboard.
  useEffect(() => {
    const check = async () => {
      try {
        const cached = localStorage.getItem("user");
        const me = cached ? JSON.parse(cached) : null;
        if (me?.id) {
          setUserId(String(me.id));
          const raw = localStorage.getItem(`curriculuxe:onboarding:${me.id}`);
          if (raw && JSON.parse(raw).completed) {
            router.replace("/dashboard");
            return;
          }
        }
      } catch { /* ignore */ }
      try {
        const res = await fetch("/api/onboarding/status");
        if (res.ok) {
          const data = await res.json();
          if (data.completed) router.replace("/dashboard");
        }
      } catch { /* offline: si prosegue col wizard */ }
    };
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = async (completed: boolean, finalPlan: OnboardingPlan | null, finalAnswers: Answers) => {
    const payload = { answers: finalAnswers, plan: finalPlan, completed };
    try {
      if (userId) localStorage.setItem(`curriculuxe:onboarding:${userId}`, JSON.stringify(payload));
    } catch { /* ignore */ }
    try {
      await fetch("/api/onboarding/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch { /* il locale resta fonte di verità */ }
  };

  const go = (delta: number) => {
    setError("");
    setDirection(delta);
    setStep((s) => Math.min(STEPS.length - 1, Math.max(0, s + delta)));
  };

  const validateStep = (): boolean => {
    const kind = STEPS[step];
    if (kind === "situation" && !answers.situation) return false;
    if (kind === "role" && !answers.role) return false;
    if (kind === "goal" && !answers.goal) return false;
    if (kind === "skills" && answers.skills.length === 0) return false;
    if (kind === "experience" && (!answers.years || answers.story.trim().length < 20)) return false;
    if (kind === "constraints" && (!answers.market || !answers.availability)) return false;
    return true;
  };

  const next = () => {
    if (!validateStep()) {
      setError(T("errorEmpty"));
      return;
    }
    if (step === STEPS.length - 1) {
      generate();
      return;
    }
    go(1);
  };

  const toggleSkill = (skill: string) => {
    setAnswers((a) => ({
      ...a,
      skills: a.skills.includes(skill) ? a.skills.filter((s) => s !== skill) : [...a.skills, skill].slice(0, 14),
    }));
  };

  const addCustomSkill = () => {
    const v = customSkill.trim();
    if (!v) return;
    toggleSkill(v);
    setCustomSkill("");
  };

  const generate = async () => {
    setGenerating(true);
    setError("");
    setNoCredits(false);
    try {
      const skillGapHints = (selectedRole?.skills || []).filter((s) => !answers.skills.includes(s)).slice(0, 5);
      const res = await fetch("/api/onboarding/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: { ...answers, skillGapHints }, lang }),
      });
      const data = await res.json();
      if (!res.ok || !data.plan) throw new Error(data.error || T("errorServer"));
      setPlan(data.plan as OnboardingPlan);
      setNoCredits(!!data.noCredits);
      await persist(true, data.plan as OnboardingPlan, answers);
    } catch (err) {
      setError((err as Error).message || T("errorServer"));
    } finally {
      setGenerating(false);
    }
  };

  const skip = async () => {
    await persist(true, null, answers);
    router.push("/dashboard");
  };

  const regenerate = async () => {
    setPlan(null);
    await generate();
  };

  if (generating) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">{T("generating")}</h2>
          <p className="text-zinc-400">{T("generatingDesc")}</p>
        </div>
      </div>
    );
  }

  if (plan) {
    return (
      <div className="min-h-screen px-4 sm:px-6 py-28">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-fuchsia-400 mb-3 px-3 py-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10">
              {T("planBadge")}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">{plan.headline}</h1>
            <p className="text-zinc-400 mt-3 max-w-2xl mx-auto">{plan.profileSummary}</p>
            {noCredits && (
              <p className="mt-4 text-sm text-amber-300 bg-amber-500/10 border border-amber-500/25 rounded-xl px-4 py-3">
                {T("noCreditsPlan")}
              </p>
            )}
          </motion.div>

          <div className="space-y-6">
            <section className="glass-card rounded-2xl p-6 border border-white/10">
              <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                <Target className="w-5 h-5 text-fuchsia-400" />
                {T("planSkillGap")}
              </h2>
              <div className="space-y-3">
                {(plan.skillGap || []).map((g) => (
                  <div key={g.skill} className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <p className="text-white font-semibold text-sm">{g.skill}</p>
                    <p className="text-zinc-400 text-sm mt-1">{g.action}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="glass-card rounded-2xl p-6 border border-white/10">
              <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-5">
                <RouteIcon className="w-5 h-5 text-indigo-400" />
                {T("planRoadmap")}
              </h2>
              <div className="space-y-5">
                {(plan.roadmap || []).map((phase, i) => {
                  const st = PHASE_STYLES[i % PHASE_STYLES.length];
                  const total = (phase.actions || []).length;
                  const done = (phase.actions || []).filter((_, j) => doneActions[`${i}:${j}`]).length;
                  const pct = total ? Math.round((done / total) * 100) : 0;
                  return (
                    <div key={i} className={`rounded-2xl border ${st.card} bg-white/[0.03] p-5`}>
                      <div className="flex items-center gap-3 mb-1.5">
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${st.badge} flex items-center justify-center shrink-0 shadow-lg`}>
                          <span className="text-sm font-bold text-white">{i + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold leading-tight">{phase.phase}</p>
                          <p className="text-xs text-zinc-500">
                            {phase.weeks} {T("planWeeks")}
                          </p>
                        </div>
                        <span className={`text-sm font-bold tabular-nums ${st.text}`}>{pct}%</span>
                      </div>
                      <p className="text-zinc-400 text-sm mb-3">{phase.goal}</p>
                      <div className="h-3 rounded-full bg-black/50 border border-white/10 overflow-hidden shadow-[inset_0_2px_6px_rgba(0,0,0,0.7)] mb-4">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                          className={`h-full rounded-full bg-gradient-to-b ${st.bar} ${st.glow} relative overflow-hidden`}
                        >
                          <div className="absolute inset-x-0 top-0 h-1/2 rounded-full bg-gradient-to-b from-white/50 to-white/0" />
                        </motion.div>
                      </div>
                      <ul className="space-y-2">
                        {(phase.actions || []).map((a, j) => {
                          const key = `${i}:${j}`;
                          const checked = !!doneActions[key];
                          return (
                            <li key={key}>
                              <button
                                onClick={() => toggleAction(key)}
                                aria-pressed={checked}
                                className={`w-full flex items-start gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm transition-all ${
                                  checked
                                    ? `${st.card} bg-white/[0.06]`
                                    : "border-white/10 bg-white/[0.02] hover:border-white/25"
                                }`}
                              >
                                <span
                                  className={`mt-0.5 flex w-5 h-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                                    checked ? `bg-gradient-to-br ${st.badge} border-transparent` : "border-white/25 bg-black/30"
                                  }`}
                                >
                                  {checked && <Check className="w-3.5 h-3.5 text-white" />}
                                </span>
                                <span className={checked ? "text-zinc-500 line-through" : "text-zinc-200"}>{a}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="grid sm:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl p-6 border border-white/10">
                <h2 className="flex items-center gap-2 font-bold text-white mb-3">
                  <FileText className="w-5 h-5 text-sky-400" />
                  {T("planCvTips")}
                </h2>
                <ul className="space-y-2 text-sm text-zinc-300">
                  {(plan.cvTips || []).map((tip) => <li key={tip} className="flex gap-2"><span className="text-sky-400">•</span>{tip}</li>)}
                </ul>
              </div>
              <div className="glass-card rounded-2xl p-6 border border-white/10">
                <h2 className="flex items-center gap-2 font-bold text-white mb-3">
                  <MessagesSquare className="w-5 h-5 text-amber-400" />
                  {T("planInterview")}
                </h2>
                <ul className="space-y-2 text-sm text-zinc-300">
                  {(plan.interviewPrep || []).map((tip) => <li key={tip} className="flex gap-2"><span className="text-amber-400">•</span>{tip}</li>)}
                </ul>
              </div>
            </section>

            {plan.salaryBenchmark && (
              <section className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.07] p-6">
                <h2 className="font-bold text-white mb-1">{T("planSalary")}</h2>
                <p className="text-zinc-300 text-sm">{plan.salaryBenchmark}</p>
              </section>
            )}

            <section className="glass-card rounded-2xl p-6 border border-white/10">
              <h2 className="font-bold text-white mb-4">{T("planNext")}</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {(plan.nextActions || []).map((a) => (
                  <button
                    key={a.href + a.label}
                    onClick={() => router.push(a.href)}
                    className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm font-semibold text-white hover:border-fuchsia-500/40 hover:bg-white/10 transition-all text-left"
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </section>

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => router.push("/dashboard")} className="btn-primary flex-1 text-white py-3.5 rounded-full font-bold">
                {T("goDashboard")}
              </button>
              <button onClick={regenerate} className="btn-secondary flex-1 text-white py-3.5 rounded-full font-semibold">
                {T("regenerate")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stepKind = STEPS[step];

  return (
    <div className="min-h-screen px-4 sm:px-6 py-28">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-fuchsia-400 mb-3 px-3 py-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10">
            {T("badge")}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{T("title")}</h1>
          <p className="text-zinc-400 max-w-xl mx-auto">{T("subtitle")}</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
            <span>{T("stepOf")} {step + 1} {T("of")} {STEPS.length}</span>
            <span>{Math.round(((step + 1) / STEPS.length) * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
            />
          </div>
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: 40 * direction }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 * direction }}
            transition={{ duration: 0.3 }}
            className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 min-h-[380px]"
          >
            {stepKind === "situation" && (
              <StepSituation ob={ob} answers={answers} setAnswers={setAnswers} situations={situations} />
            )}
            {stepKind === "role" && (
              <StepRole ob={ob} answers={answers} setAnswers={setAnswers} />
            )}
            {stepKind === "goal" && (
              <StepGoal ob={ob} answers={answers} setAnswers={setAnswers} goals={goals} />
            )}
            {stepKind === "skills" && (
              <StepSkills ob={ob} answers={answers} setAnswers={setAnswers} selectedRole={selectedRole} customSkill={customSkill} setCustomSkill={setCustomSkill} addCustomSkill={addCustomSkill} toggleSkill={toggleSkill} T={T} />
            )}
            {stepKind === "experience" && (
              <StepExperience ob={ob} answers={answers} setAnswers={setAnswers} yearsList={yearsList} needsStudy={needsStudy} T={T} />
            )}
            {stepKind === "constraints" && (
              <StepConstraints ob={ob} answers={answers} setAnswers={setAnswers} markets={markets} availabilities={availabilities} T={T} />
            )}
            {stepKind === "review" && (
              <StepReview ob={ob} answers={answers} setStep={setStep} setDirection={setDirection} T={T} />
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <p role="alert" className="text-red-400 text-sm text-center mt-4">{error}</p>
        )}

        <div className="flex items-center justify-between gap-3 mt-6">
          <button
            onClick={() => (step === 0 ? skip() : go(-1))}
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 0 ? T("skip") : T("back")}
          </button>
          <button
            onClick={next}
            className="btn-primary inline-flex items-center gap-2 text-white px-8 py-3 rounded-full font-bold"
          >
            {step === STEPS.length - 1 ? T("generatePlan") : T("next")}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <p className="text-zinc-400 text-sm mt-1">{subtitle}</p>
    </div>
  );
}

function OptionCard({ selected, onClick, icon: Icon, label }: { selected: boolean; onClick: () => void; icon: typeof Code; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all w-full ${
        selected
          ? "bg-fuchsia-500/15 border-fuchsia-500/50 text-white"
          : "bg-white/5 border-white/10 text-zinc-300 hover:border-white/25 hover:text-white"
      }`}
    >
      <Icon className={`w-5 h-5 shrink-0 ${selected ? "text-fuchsia-300" : "text-zinc-500"}`} />
      <span className="text-sm font-semibold flex-1">{label}</span>
      {selected && <Check className="w-4 h-4 text-fuchsia-300 shrink-0" />}
    </button>
  );
}

function StepSituation({ ob, answers, setAnswers, situations }: {
  ob: Record<string, unknown>;
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  situations: Array<{ id: string; label: string }>;
}) {
  return (
    <div>
      <StepHeader title={ob.situationTitle as string} subtitle={ob.situationSubtitle as string} />
      <div className="grid sm:grid-cols-2 gap-3">
        {situations.map((s) => {
          const Icon = SITUATION_ICONS[s.id] || Compass;
          return (
            <OptionCard
              key={s.id}
              selected={answers.situation === s.id}
              onClick={() => setAnswers((a) => ({ ...a, situation: s.id, situationLabel: s.label }))}
              icon={Icon}
              label={s.label}
            />
          );
        })}
      </div>
    </div>
  );
}

function StepRole({ ob, answers, setAnswers }: {
  ob: Record<string, unknown>;
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
}) {
  return (
    <div>
      <StepHeader title={ob.roleTitle as string} subtitle={ob.roleSubtitle as string} />
      <div className="grid sm:grid-cols-2 gap-3">
        {ROLES.map((r) => (
          <OptionCard
            key={r.id}
            selected={answers.role === r.id}
            onClick={() => setAnswers((a) => ({ ...a, role: r.id, roleLabel: r.label }))}
            icon={r.icon}
            label={r.label}
          />
        ))}
      </div>
    </div>
  );
}

function StepGoal({ ob, answers, setAnswers, goals }: {
  ob: Record<string, unknown>;
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  goals: Array<{ id: string; label: string }>;
}) {
  return (
    <div>
      <StepHeader title={ob.goalTitle as string} subtitle={ob.goalSubtitle as string} />
      <div className="grid sm:grid-cols-2 gap-3">
        {goals.map((g) => {
          const Icon = GOAL_ICONS[g.id] || Target;
          return (
            <OptionCard
              key={g.id}
              selected={answers.goal === g.id}
              onClick={() => setAnswers((a) => ({ ...a, goal: g.id, goalLabel: g.label }))}
              icon={Icon}
              label={g.label}
            />
          );
        })}
      </div>
    </div>
  );
}

function StepSkills({ ob, answers, setAnswers, selectedRole, customSkill, setCustomSkill, addCustomSkill, toggleSkill, T }: {
  ob: Record<string, unknown>;
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  selectedRole: RoleDef | undefined;
  customSkill: string;
  setCustomSkill: (v: string) => void;
  addCustomSkill: () => void;
  toggleSkill: (s: string) => void;
  T: (k: string) => string;
}) {
  return (
    <div>
      <StepHeader
        title={ob.skillsTitle as string}
        subtitle={`${ob.skillsSubtitle as string}${selectedRole ? ` · ${selectedRole.label}` : ""}`}
      />
      <div className="flex flex-wrap gap-2">
        {(selectedRole?.skills || []).map((s) => {
          const active = answers.skills.includes(s);
          return (
            <button
              key={s}
              onClick={() => toggleSkill(s)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                active
                  ? "bg-indigo-500/25 border-indigo-400/60 text-white"
                  : "bg-white/5 border-white/10 text-zinc-300 hover:border-white/25 hover:text-white"
              }`}
            >
              {s}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2 mt-4">
        <input
          value={customSkill}
          onChange={(e) => setCustomSkill(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomSkill(); } }}
          placeholder={ob.skillsAddedPlaceholder as string}
          className="flex-1 bg-black/25 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-indigo-400 placeholder:text-zinc-600"
        />
        <button onClick={addCustomSkill} className="btn-secondary px-4 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          {T("skillsAdded")}
        </button>
      </div>
      {answers.skills.filter((s) => !(selectedRole?.skills || []).includes(s)).length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {answers.skills.filter((s) => !(selectedRole?.skills || []).includes(s)).map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/40 text-emerald-200">
              {s}
              <button onClick={() => toggleSkill(s)} aria-label={`Rimuovi ${s}`} className="hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
      <p className="text-xs text-zinc-500 mt-4">
        {answers.skills.length} {T("skillsSelected")}
      </p>
    </div>
  );
}

function StepExperience({ ob, answers, setAnswers, yearsList, needsStudy, T }: {
  ob: Record<string, unknown>;
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  yearsList: string[];
  needsStudy: boolean;
  T: (k: string) => string;
}) {
  void T;
  return (
    <div>
      <StepHeader title={ob.experienceTitle as string} subtitle={ob.experienceSubtitle as string} />
      <label className="block text-sm font-medium text-zinc-300 mb-2">{ob.yearsLabel as string}</label>
      <div className="flex flex-wrap gap-2 mb-5">
        {yearsList.map((y) => (
          <button
            key={y}
            onClick={() => setAnswers((a) => ({ ...a, years: y }))}
            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
              answers.years === y
                ? "bg-indigo-500/25 border-indigo-400/60 text-white"
                : "bg-white/5 border-white/10 text-zinc-300 hover:border-white/25 hover:text-white"
            }`}
          >
            {y}
          </button>
        ))}
      </div>
      {needsStudy && (
        <div className="mb-5">
          <label className="block text-sm font-medium text-zinc-300 mb-2">{ob.studyLabel as string}</label>
          <input
            value={answers.study}
            onChange={(e) => setAnswers((a) => ({ ...a, study: e.target.value }))}
            placeholder={ob.studyPlaceholder as string}
            className="w-full bg-black/25 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-400 placeholder:text-zinc-600"
          />
        </div>
      )}
      <label className="block text-sm font-medium text-zinc-300 mb-2">{ob.storyLabel as string}</label>
      <textarea
        value={answers.story}
        onChange={(e) => setAnswers((a) => ({ ...a, story: e.target.value }))}
        placeholder={ob.storyPlaceholder as string}
        rows={4}
        className="w-full bg-black/25 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-indigo-400 resize-none placeholder:text-zinc-600"
      />
    </div>
  );
}

function StepConstraints({ ob, answers, setAnswers, markets, availabilities, T }: {
  ob: Record<string, unknown>;
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  markets: Array<{ id: string; label: string }>;
  availabilities: Array<{ id: string; label: string }>;
  T: (k: string) => string;
}) {
  void T;
  return (
    <div>
      <StepHeader title={ob.constraintsTitle as string} subtitle={ob.constraintsSubtitle as string} />
      <label className="block text-sm font-medium text-zinc-300 mb-2">{ob.marketLabel as string}</label>
      <div className="flex flex-wrap gap-2 mb-5">
        {markets.map((m) => (
          <button
            key={m.id}
            onClick={() => setAnswers((a) => ({ ...a, market: m.id, marketLabel: m.label }))}
            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
              answers.market === m.id
                ? "bg-indigo-500/25 border-indigo-400/60 text-white"
                : "bg-white/5 border-white/10 text-zinc-300 hover:border-white/25 hover:text-white"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <label className="block text-sm font-medium text-zinc-300 mb-2">{ob.availabilityLabel as string}</label>
      <div className="flex flex-wrap gap-2 mb-5">
        {availabilities.map((a) => (
          <button
            key={a.id}
            onClick={() => setAnswers((an) => ({ ...an, availability: a.id, availabilityLabel: a.label }))}
            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
              answers.availability === a.id
                ? "bg-indigo-500/25 border-indigo-400/60 text-white"
                : "bg-white/5 border-white/10 text-zinc-300 hover:border-white/25 hover:text-white"
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>
      <label className="block text-sm font-medium text-zinc-300 mb-2">{ob.ralLabel as string}</label>
      <input
        value={answers.ral}
        onChange={(e) => setAnswers((a) => ({ ...a, ral: e.target.value }))}
        placeholder={ob.ralPlaceholder as string}
        className="w-full sm:max-w-xs bg-black/25 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-indigo-400 placeholder:text-zinc-600"
      />
    </div>
  );
}

function StepReview({ ob, answers, setStep, setDirection, T }: {
  ob: Record<string, unknown>;
  answers: Answers;
  setStep: (n: number) => void;
  setDirection: (n: number) => void;
  T: (k: string) => string;
}) {
  const rows: Array<{ label: string; value: string; step: number }> = [
    { label: ob.situationTitle as string, value: answers.situationLabel, step: 0 },
    { label: ob.roleTitle as string, value: answers.roleLabel, step: 1 },
    { label: ob.goalTitle as string, value: answers.goalLabel, step: 2 },
    { label: ob.skillsTitle as string, value: answers.skills.join(", "), step: 3 },
    { label: ob.yearsLabel as string, value: answers.years, step: 4 },
    { label: ob.marketLabel as string, value: `${answers.marketLabel}${answers.availabilityLabel ? ` · ${answers.availabilityLabel}` : ""}${answers.ral ? ` · ${answers.ral}` : ""}`, step: 5 },
  ];
  return (
    <div>
      <StepHeader title={T("reviewTitle")} subtitle={T("reviewDesc")} />
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="flex items-start justify-between gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
            <div className="min-w-0">
              <p className="text-xs text-zinc-500">{r.label}</p>
              <p className="text-sm text-white font-medium truncate">{r.value || "—"}</p>
            </div>
            <button
              onClick={() => { setDirection(-1); setStep(r.step); }}
              className="text-xs font-semibold text-indigo-300 hover:text-indigo-200 shrink-0 mt-0.5"
            >
              {T("edit")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
