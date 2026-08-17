"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { cvTemplates, getTemplateById } from "@/lib/templates/cvTemplates";
import { getTemplateAdvice } from "@/lib/careerKit";
import TemplatePreview from "@/components/TemplatePreview";

const promptSuggestions = [
  { id: "1", icon: "💻", label: "Sviluppatore Frontend", prompt: "Sviluppatore Frontend con 3 anni di esperienza in React, Next.js e TypeScript. Esperienza in UI/UX design, responsive design e integrazione API REST. Laurea in Informatica." },
  { id: "2", icon: "⚙️", label: "Backend Engineer", prompt: "Backend Engineer con 5 anni di esperienza in Node.js e Python. Competenze in microservizi, API RESTful, database SQL/NoSQL e cloud AWS." },
  { id: "3", icon: "📱", label: "Mobile Developer", prompt: "Mobile Developer con esperienza in React Native e Flutter. Ho pubblicato 3 app su App Store e Google Play con oltre 50k download." },
  { id: "4", icon: "🎨", label: "UX/UI Designer", prompt: "UX/UI Designer con 4 anni di esperienza in progettazione di interfacce utente. Competenze in Figma, Adobe XD, design system e user research." },
  { id: "5", icon: "📊", label: "Data Scientist", prompt: "Data Scientist con esperienza in machine learning, Python, SQL e visualizzazione dati. Ho sviluppato modelli predittivi per il settore finanziario." },
  { id: "6", icon: "☁️", label: "DevOps Engineer", prompt: "DevOps Engineer con esperienza in Docker, Kubernetes, CI/CD, AWS/Azure e infrastruttura come codice con Terraform." },
];

const initialFormData = {
  personalInfo: { name: "", email: "", phone: "", city: "", linkedin: "", portfolio: "" },
  summary: "",
  experience: [] as Array<{ company: string; role: string; period: string; description: string }>,
  education: [] as Array<{ institution: string; degree: string; year: string }>,
  skills: "",
  languages: "",
  certifications: "",
};

export default function CreateCVPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    }>
      <CreateCVContent />
    </Suspense>
  );
}

function CreateCVContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<string | null>(null);
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");

  const [prompt, setPrompt] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("moderno");
  const [generating, setGenerating] = useState(false);
  const [creditsError, setCreditsError] = useState(false);

  const [formData, setFormData] = useState(initialFormData);
  const [currentSection, setCurrentSection] = useState("personal");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) { router.push("/login"); return; }
    try { setUser(JSON.parse(userData)); } catch { router.push("/login"); }
  }, [router]);

  useEffect(() => {
    const m = searchParams.get("mode");
    if (m === "ai") setMode("ai");
    else if (m === "manual") setMode("manual");
  }, [searchParams]);

  const handleSelectSuggestion = (s: { prompt: string }) => setPrompt(s.prompt);

  const updateField = (section: string, field: string | null, value: string) => {
    if (["skills", "languages", "certifications", "summary"].includes(section)) {
      setFormData((prev) => ({ ...prev, [section]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [section]: { ...(prev as Record<string, unknown>)[section] as Record<string, string>, [field as string]: value } }));
    }
  };

  const addExperience = () => {
    setFormData((prev) => ({ ...prev, experience: [...prev.experience, { company: "", role: "", period: "", description: "" }] }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const exp = [...prev.experience];
      exp[index] = { ...exp[index], [field]: value };
      return { ...prev, experience: exp };
    });
  };

  const removeExperience = (index: number) => {
    setFormData((prev) => ({ ...prev, experience: prev.experience.filter((_, i) => i !== index) }));
  };

  const addEducation = () => {
    setFormData((prev) => ({ ...prev, education: [...prev.education, { institution: "", degree: "", year: "" }] }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const edu = [...prev.education];
      edu[index] = { ...edu[index], [field]: value };
      return { ...prev, education: edu };
    });
  };

  const removeEducation = (index: number) => {
    setFormData((prev) => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }));
  };

  const handleSaveManual = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const res = await fetch("/api/cv/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, template: selectedTemplate, userId: (user as Record<string, unknown>).id || (user as Record<string, unknown>)._id }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/dashboard/cv/${data.cvId}`);
      }
    } catch (error) {
      console.error("Error saving CV:", error);
    } finally {
      setSaving(false);
    }
  };

  const { t } = useLanguage();
  const _t = t as Record<string, Record<string, string>>;
  const tGen = _t.generate as Record<string, string>;
  const tCreate = _t.create as Record<string, string>;
  const tNav = _t.nav as Record<string, string>;

  const handleGenerateAI = async () => {
    if (!prompt.trim()) { setError(tGen.errorPrompt); return; }
    setError("");
    setCreditsError(false);
    setGenerating(true);
    try {
      const res = await fetch("/api/cv/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: (user as Record<string, unknown>)?.id || (user as Record<string, unknown>)?._id, prompt, template: selectedTemplate, mode: "ai-generated" }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/dashboard/cv/${data.cvId}`);
      } else {
        const errData = await res.json();
        setCreditsError(res.status === 402);
        setError(errData.error || (res.status === 402 ? tGen.noCredits : tGen.errorServer));
      }
    } catch { setError(tGen.errorServer); }
    finally { setGenerating(false); }
  };

  const sections = [
    { id: "personal", label: tCreate.personal, icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { id: "summary", label: tCreate.summary, icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { id: "experience", label: tCreate.experience, icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { id: "education", label: tCreate.education, icon: "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" },
    { id: "skills", label: tCreate.skills, icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
    { id: "languages", label: tCreate.languages, icon: "M3 5h12M9 3v2m1.598 3h12.002M3 9v2m5.666 3h8.668M3 13h14M3 17h10" },
    { id: "certifications", label: tCreate.certifications, icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.241-.652 3.42 3.42 0 014.618 3.383 3.42 3.42 0 00-.652 1.241 3.42 3.42 0 01-3.383 3.618 3.42 3.42 0 01-1.241-.652 3.42 3.42 0 01-3.383-3.618z" },
  ];

  return (
    <section className="gradient-bg relative min-h-screen overflow-hidden">
      {generating && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="text-center">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-32 h-32 mx-auto mb-8 relative">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(129,140,248,0.2)" strokeWidth="6" />
                <motion.circle cx="50" cy="50" r="45" fill="none" stroke="url(#grad)" strokeWidth="6" strokeLinecap="round" strokeDasharray="283" initial={{ strokeDashoffset: 283 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 2, ease: "easeInOut" }} />
                <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#818cf8" /><stop offset="100%" stopColor="#e879f9" /></linearGradient></defs>
              </svg>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5 }} className="absolute inset-0 flex items-center justify-center">
                <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.8, duration: 0.5 }} strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-white mb-2">{tGen.generating}</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-zinc-400">{tGen.generatingDesc}</motion.p>
          </div>
        </motion.div>
      )}

      <nav className="fixed top-0 left-0 right-0 z-50 glass-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-white font-medium">{tNav.backDashboard}</span>
          </Link>
          {mode && (
            <button onClick={() => setMode(null)} className="text-sm text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all">
              {tNav.backDashboard}
            </button>
          )}
        </div>
      </nav>

      <div className="relative z-10 pt-28 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {!mode ? (
            <>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">
                  {tCreate.title} <span className="text-gradient">{tCreate.titleHighlight}</span>
                </h1>
                <p className="text-zinc-400 text-lg">{tCreate.subtitle}</p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setMode("ai")}
                  className="glass-card rounded-2xl p-8 text-left hover:border-indigo-500/40 transition-all group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">{tGen.title} <span className="text-gradient">{tGen.titleHighlight}</span></h2>
                  <p className="text-zinc-400 leading-relaxed">{tGen.subtitle}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {["Prompt testuale", "AI genera contenuti", "Template inclusi"].map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs border border-indigo-500/20">{tag}</span>
                    ))}
                  </div>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setMode("manual")}
                  className="glass-card rounded-2xl p-8 text-left hover:border-fuchsia-500/40 transition-all group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">{tCreate.title} <span className="text-gradient text-fuchsia-400">{tCreate.titleHighlight}</span></h2>
                  <p className="text-zinc-400 leading-relaxed">{tCreate.subtitleManual || "Compila manualmente ogni sezione del tuo curriculum con l'aiuto della nostra interfaccia guidata."}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {["Compilazione guidata", "16 template", "Sezioni personalizzabili"].map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-300 text-xs border border-fuchsia-500/20">{tag}</span>
                    ))}
                  </div>
                </motion.button>
              </div>
            </>
          ) : mode === "ai" ? (
            <>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                <h1 className="text-3xl font-bold text-white mb-4">
                  {tGen.title} <span className="text-gradient">{tGen.titleHighlight}</span>
                </h1>
                <p className="text-zinc-400">{tGen.subtitle}</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6 mb-8">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {tGen.suggestions}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {promptSuggestions.map((s) => (
                    <button key={s.id} onClick={() => handleSelectSuggestion(s)}
                      className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 transition-all text-left"
                    >
                      <span className="text-xl mb-1 block">{s.icon}</span>
                      <span className="text-white text-sm font-medium">{s.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6 mb-8">
                <h2 className="text-xl font-bold text-white mb-4">{tGen.describeProfile}</h2>
                <textarea value={prompt} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)} placeholder={tGen.profilePlaceholder}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 h-32 resize-none"
                />
                {error && (
                  <div className="text-red-400 text-sm mt-2">
                    <p>{error}</p>
                    {creditsError && (
                      <Link href="/#pricing" className="inline-block mt-1 underline font-medium text-indigo-300 hover:text-indigo-200">
                        {tGen.viewPricing}
                      </Link>
                    )}
                  </div>
                )}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-6 mb-8">
                <h2 className="text-xl font-bold text-white mb-4">{tGen.chooseTemplate}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {cvTemplates.map((tpl: { id: string; name: string }) => {
                    const advice = getTemplateAdvice(tpl);
                    return (
                      <button key={tpl.id} onClick={() => setSelectedTemplate(tpl.id)}
                        className={`rounded-xl overflow-hidden transition-all ${selectedTemplate === tpl.id ? "ring-2 ring-indigo-500 shadow-lg shadow-indigo-500/20" : "hover:ring-1 hover:ring-white/20"}`}
                      >
                        <TemplatePreview templateId={tpl.id} size="sm" />
                        <div className="bg-slate-800 p-2 text-center">
                          <p className="text-white text-xs font-medium">{tpl.name}</p>
                          <p className={advice.label === "ATS-safe" ? "text-emerald-300 text-[10px]" : "text-zinc-400 text-[10px]"}>{advice.label}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-center">
                <button onClick={handleGenerateAI} disabled={generating || !prompt.trim()}
                  className="btn-primary text-white px-10 py-4 rounded-full font-semibold glow-border inline-flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {tGen.generateButton}
                </button>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                <h1 className="text-3xl font-bold text-white mb-4">
                  {tCreate.title} <span className="text-gradient">{tCreate.titleHighlight}</span>
                </h1>
                <p className="text-zinc-400">{tCreate.subtitle}</p>
              </motion.div>

              <div className="flex gap-8">
                <aside className="hidden lg:block w-64 shrink-0">
                  <div className="glass-card rounded-2xl p-5 sticky top-28">
                    <p className="text-zinc-500 text-xs uppercase tracking-wider mb-4">{tCreate.sections}</p>
                    <div className="space-y-1">
                      {sections.map((sec) => (
                        <button key={sec.id} onClick={() => setCurrentSection(sec.id)}
                          className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${currentSection === sec.id ? "bg-indigo-500/15 text-indigo-300" : "text-zinc-300 hover:bg-white/5 hover:text-white"}`}
                        >
                          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sec.icon} />
                          </svg>
                          {sec.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </aside>

                <div className="flex-1 space-y-6">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">{tGen.chooseTemplate}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {cvTemplates.map((tpl: { id: string; name: string }) => {
                        const advice = getTemplateAdvice(tpl);
                        return (
                          <button key={tpl.id} onClick={() => setSelectedTemplate(tpl.id)}
                            className={`rounded-xl overflow-hidden transition-all ${selectedTemplate === tpl.id ? "ring-2 ring-indigo-500" : "hover:ring-1 hover:ring-white/20"}`}
                          >
                            <TemplatePreview templateId={tpl.id} size="sm" />
                            <div className="bg-slate-800 p-1.5 text-center">
                              <p className="text-white text-[10px] font-medium truncate">{tpl.name}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>

                  {currentSection === "personal" && (
                    <motion.div key="personal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-2xl p-6">
                      <h2 className="text-xl font-bold text-white mb-6">{tCreate.personal}</h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        {([
                          ["name", tCreate.name], ["email", tCreate.email], ["phone", tCreate.phone],
                          ["city", tCreate.city], ["linkedin", "LinkedIn"], ["portfolio", "Portfolio"],
                        ] as const).map(([field, label]) => (
                          <div key={field}>
                            <label className="block text-sm font-medium text-zinc-300 mb-1.5">{label}</label>
                            <input type={field === "email" ? "email" : "text"} value={(formData.personalInfo as Record<string, string>)[field]}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("personalInfo", field, e.target.value)}
                              className="w-full bg-black/25 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {currentSection === "summary" && (
                    <motion.div key="summary" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-2xl p-6">
                      <h2 className="text-xl font-bold text-white mb-4">{tCreate.summary}</h2>
                      <textarea value={formData.summary} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField("summary", null, e.target.value)}
                        placeholder={tCreate.profileDesc} className="w-full bg-black/25 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 h-32 resize-none"
                      />
                    </motion.div>
                  )}

                  {currentSection === "experience" && (
                    <motion.div key="experience" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">{tCreate.experience}</h2>
                        <button onClick={addExperience} className="btn-secondary px-4 py-2 rounded-lg text-sm font-medium">+ Aggiungi</button>
                      </div>
                      {formData.experience.length === 0 && (
                        <p className="text-zinc-500 text-center py-8">Nessuna esperienza. Clicca &quot;+ Aggiungi&quot; per iniziare.</p>
                      )}
                      <div className="space-y-4">
                        {formData.experience.map((exp, i) => (
                          <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-4">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-sm text-zinc-400">Esperienza #{i + 1}</span>
                              <button onClick={() => removeExperience(i)} className="text-red-400 hover:text-red-300"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-3">
                              <div><label className="block text-xs text-zinc-400 mb-1">{tCreate.company}</label><input value={exp.company} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateExperience(i, "company", e.target.value)} className="w-full bg-black/25 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" /></div>
                              <div><label className="block text-xs text-zinc-400 mb-1">{tCreate.role}</label><input value={exp.role} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateExperience(i, "role", e.target.value)} className="w-full bg-black/25 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" /></div>
                              <div><label className="block text-xs text-zinc-400 mb-1">Periodo</label><input value={exp.period} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateExperience(i, "period", e.target.value)} placeholder="2021 - Presente" className="w-full bg-black/25 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" /></div>
                              <div className="md:col-span-2"><label className="block text-xs text-zinc-400 mb-1">Descrizione</label><textarea value={exp.description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateExperience(i, "description", e.target.value)} rows={2} className="w-full bg-black/25 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none" /></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {currentSection === "education" && (
                    <motion.div key="education" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">{tCreate.education}</h2>
                        <button onClick={addEducation} className="btn-secondary px-4 py-2 rounded-lg text-sm font-medium">+ Aggiungi</button>
                      </div>
                      {formData.education.length === 0 && (
                        <p className="text-zinc-500 text-center py-8">Nessuna formazione. Clicca &quot;+ Aggiungi&quot; per iniziare.</p>
                      )}
                      <div className="space-y-4">
                        {formData.education.map((edu, i) => (
                          <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-4">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-sm text-zinc-400">Formazione #{i + 1}</span>
                              <button onClick={() => removeEducation(i)} className="text-red-400 hover:text-red-300"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                            </div>
                            <div className="grid md:grid-cols-3 gap-3">
                              <div className="md:col-span-2"><label className="block text-xs text-zinc-400 mb-1">{tCreate.institution}</label><input value={edu.institution} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEducation(i, "institution", e.target.value)} className="w-full bg-black/25 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" /></div>
                              <div><label className="block text-xs text-zinc-400 mb-1">{tCreate.degree}</label><input value={edu.degree} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEducation(i, "degree", e.target.value)} className="w-full bg-black/25 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" /></div>
                              <div><label className="block text-xs text-zinc-400 mb-1">Anno</label><input value={edu.year} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateEducation(i, "year", e.target.value)} placeholder="2018" className="w-full bg-black/25 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500" /></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {currentSection === "skills" && (
                    <motion.div key="skills" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-2xl p-6">
                      <h2 className="text-xl font-bold text-white mb-4">{tCreate.skills}</h2>
                      <textarea value={formData.skills} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField("skills", null, e.target.value)}
                        placeholder={tCreate.skillsPlaceholder} rows={4}
                        className="w-full bg-black/25 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 resize-none"
                      />
                    </motion.div>
                  )}

                  {currentSection === "languages" && (
                    <motion.div key="languages" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-2xl p-6">
                      <h2 className="text-xl font-bold text-white mb-4">{tCreate.languages}</h2>
                      <textarea value={formData.languages} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField("languages", null, e.target.value)}
                        placeholder={tCreate.languagesPlaceholder} rows={3}
                        className="w-full bg-black/25 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 resize-none"
                      />
                    </motion.div>
                  )}

                  {currentSection === "certifications" && (
                    <motion.div key="certifications" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-2xl p-6">
                      <h2 className="text-xl font-bold text-white mb-4">{tCreate.certifications}</h2>
                      <textarea value={formData.certifications} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField("certifications", null, e.target.value)}
                        placeholder={tCreate.certPlaceholder} rows={3}
                        className="w-full bg-black/25 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 resize-none"
                      />
                    </motion.div>
                  )}

                  <div className="flex gap-3 justify-end">
                    <button onClick={() => setCurrentSection(sections[Math.max(0, sections.findIndex(s => s.id === currentSection) - 1)].id)}
                      disabled={currentSection === sections[0].id}
                      className="btn-secondary px-6 py-3 rounded-xl font-semibold disabled:opacity-30"
                    >
                      Precedente
                    </button>
                    <button onClick={() => setCurrentSection(sections[Math.min(sections.length - 1, sections.findIndex(s => s.id === currentSection) + 1)].id)}
                      disabled={currentSection === sections[sections.length - 1].id}
                      className="btn-secondary px-6 py-3 rounded-xl font-semibold disabled:opacity-30"
                    >
                      Successivo
                    </button>
                    <button onClick={handleSaveManual} disabled={saving}
                      className="btn-primary px-8 py-3 rounded-xl font-bold disabled:opacity-50"
                    >
                      {saving ? tCreate.generating : tCreate.generateCV}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
