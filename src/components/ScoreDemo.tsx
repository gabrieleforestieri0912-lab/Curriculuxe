"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Upload, Brain, BarChart3, Download, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const CRITERIA_PHASES = [
  [58, 40, 45, 30, 50],
  [72, 65, 60, 52, 68],
  [80, 70, 78, 62, 74],
  [85, 72, 90, 65, 80],
];

export default function ScoreDemo() {
  const { t } = useLanguage();
  const tScoreDemo = t.scoreDemo as Record<string, string>;
  const tHowItWorks = t.howItWorks as Record<string, string>;

  const phases = [
    {
      label: tScoreDemo.uploadPhase as string,
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      desc: tScoreDemo.uploadPhaseDesc as string,
    },
    {
      label: tScoreDemo.analyzePhase as string,
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
      desc: tScoreDemo.analyzePhaseDesc as string,
    },
    {
      label: tScoreDemo.resultsPhase as string,
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      desc: tScoreDemo.resultsPhaseDesc as string,
    },
    {
      label: tScoreDemo.exportPhase as string,
      icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.241-.652 3.42 3.42 0 014.618 3.383 3.42 3.42 0 00-.652 1.241 3.42 3.42 0 01-3.383 3.618 3.42 3.42 0 01-1.241-.652 3.42 3.42 0 01-3.383-3.618 3.42 3.42 0 00.652-1.241 3.42 3.42 0 013.383-3.383z",
      desc: tScoreDemo.exportPhaseDesc as string,
    },
  ];

  const criteria = [
    { label: tScoreDemo.scoreLabel as string, color: "from-violet-500 to-fuchsia-500" },
    { label: tScoreDemo.atsLabel as string, color: "from-indigo-500 to-blue-500" },
    { label: tScoreDemo.jobMatchLabel as string, color: "from-emerald-500 to-teal-500" },
    { label: tScoreDemo.strengths as string, color: "from-orange-500 to-amber-500" },
    { label: tScoreDemo.improvements as string, color: "from-pink-500 to-rose-500" },
  ];

  const steps = [
    {
      icon: Upload,
      title: tScoreDemo.uploadPhase as string,
      desc: tScoreDemo.uploadPhaseDesc as string,
      color: "from-violet-500 to-purple-600",
      glow: "rgba(139,92,246,0.25)",
    },
    {
      icon: Brain,
      title: tScoreDemo.analyzePhase as string,
      desc: tScoreDemo.analyzePhaseDesc as string,
      color: "from-fuchsia-500 to-pink-600",
      glow: "rgba(217,70,239,0.25)",
    },
    {
      icon: BarChart3,
      title: tScoreDemo.resultsPhase as string,
      desc: tScoreDemo.resultsPhaseDesc as string,
      color: "from-indigo-500 to-blue-600",
      glow: "rgba(99,102,241,0.25)",
    },
    {
      icon: Download,
      title: tScoreDemo.exportPhase as string,
      desc: tScoreDemo.exportPhaseDesc as string,
      color: "from-emerald-500 to-teal-600",
      glow: "rgba(16,185,129,0.25)",
    },
  ];

  const [score, setScore] = useState<number>(0);
  const [phase, setPhase] = useState<number>(0);
  const [criteriaScores, setCriteriaScores] = useState<number[]>([0, 0, 0, 0, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((prev) => (prev + 1) % 4);
      setScore(0);
      setCriteriaScores([0, 0, 0, 0, 0]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const target = phase === 3 ? 87 : 30 + phase * 15;
    const scoreInterval = setInterval(() => {
      setScore((prev) => {
        if (prev < target) return Math.min(prev + 1, target);
        return prev;
      });
    }, 40);
    return () => clearInterval(scoreInterval);
  }, [phase]);

  useEffect(() => {
    const targets = CRITERIA_PHASES[phase];
    const barInterval = setInterval(() => {
      setCriteriaScores((prev) =>
        prev.map((val, i) => (val < targets[i] ? Math.min(val + 1, targets[i]) : val))
      );
    }, 25);
    return () => clearInterval(barInterval);
  }, [phase]);

  return (
    <>
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-fuchsia-400 mb-3 px-3 py-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10">
              {tHowItWorks.title as string}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {tScoreDemo.stepsTitle as string}{" "}
              <span className="text-gradient">{tScoreDemo.stepsTitleHighlight as string}</span>
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              {tScoreDemo.stepsSubtitle as string}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative glass-card rounded-2xl p-6 border border-white/10 flex flex-col gap-4"
              >
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-6 h-px bg-white/10 z-10" />
                )}

                <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">
                  0{i + 1}
                </span>

                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center`}
                  style={{ boxShadow: `0 0 20px ${step.glow}` } as React.CSSProperties}
                >
                  <step.icon className="w-6 h-6 text-white" />
                </div>

                <div>
                  <h3 className="text-white font-bold text-lg mb-1">{step.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {tScoreDemo.analyzeTitle as string} <span className="text-gradient">{tScoreDemo.analyzeTitleHighlight as string}</span> {tScoreDemo.analyzeTitleRest as string}
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              {tScoreDemo.analyzeSubtitle as string}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-2xl p-8 border border-white/10"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-semibold text-white">{tScoreDemo.analyzing as string}</h3>
                <motion.div
                  key={phase}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-2 text-indigo-400"
                >
                  <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={phases[phase].icon} />
                  </svg>
                  <span className="text-sm font-medium">{phases[phase].label}</span>
                </motion.div>
              </div>

              <div className="flex items-center gap-6 mb-8">
                <div className="relative w-24 h-24 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    {/* Traccia a solco */}
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="url(#scoreTrackGrad)" strokeWidth="4" />
                    {/* Alone luminoso (glow) */}
                    <motion.circle
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="none"
                      stroke="url(#scoreGrad)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray="100"
                      initial={{ strokeDashoffset: 100 }}
                      animate={{ strokeDashoffset: 100 - score }}
                      transition={{ type: "spring", stiffness: 70, damping: 20, mass: 1 }}
                      style={{ filter: "blur(2.5px)" }}
                      opacity={0.35}
                    />
                    {/* Anello 3D */}
                    <motion.circle
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="none"
                      stroke="url(#scoreGrad)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray="100"
                      initial={{ strokeDashoffset: 100 }}
                      animate={{ strokeDashoffset: 100 - score }}
                      transition={{ type: "spring", stiffness: 70, damping: 20, mass: 1 }}
                    />
                    <defs>
                      <linearGradient id="scoreTrackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.03)" />
                      </linearGradient>
                      <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="45%" stopColor="#c4b5fd" />
                        <stop offset="100%" stopColor="#e879f9" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{score}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">{tScoreDemo.overallScore as string}</p>
                  <p className="text-white font-semibold mt-1">{phases[phase].label}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{phases[phase].desc}</p>
                </div>
              </div>

              <div className="space-y-4">
                {criteria.map((item, i) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <span className="text-zinc-400 text-sm w-24 shrink-0">{item.label}</span>
                    <div className="flex-1 h-3 rounded-full bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 shadow-[inset_0_1px_4px_rgba(0,0,0,0.55)] overflow-hidden">
                      <motion.div
                        className="relative h-full rounded-full overflow-hidden"
                        animate={{ width: `${criteriaScores[i]}%` }}
                        transition={{ type: "spring", stiffness: 70, damping: 20, mass: 1 }}
                      >
                        {/* Colore del criterio */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${item.color}`} />
                        {/* Ombreggiatura cilindrica 3D */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/5 to-black/40" />
                        {/* Riflesso scorrevole */}
                        <motion.div
                          className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                          animate={{ x: ["-100%", "300%"] }}
                          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 0.9, ease: "easeInOut" }}
                        />
                      </motion.div>
                    </div>
                    <span className="text-white text-sm w-8 text-right">{criteriaScores[i]}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-white mb-6">{tScoreDemo.analyzingTitle as string}</h3>
              {phases.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-4 p-5 rounded-2xl transition-all border ${
                    i <= phase
                      ? "bg-indigo-500/10 border-indigo-500/30"
                      : "glass-card border-white/8"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    i <= phase ? "bg-indigo-500/20" : "bg-white/5"
                  }`}>
                    {i <= phase ? (
                      <CheckCircle className="w-5 h-5 text-indigo-400" />
                    ) : (
                      <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={p.icon} />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className={`font-semibold ${i <= phase ? "text-white" : "text-zinc-500"}`}>
                      {p.label}
                    </p>
                    <p className="text-zinc-500 text-sm mt-0.5">{p.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Esempio reale precompilato, subito sotto la demo interattiva */}
      <section id="demo-reale" className="py-24 px-6 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-300 mb-3 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10">
              <Sparkles className="w-3.5 h-3.5" />
              Esempio reale già compilato
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ecco cosa ricevi con <span className="text-gradient">un&apos;analisi vera</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Elena Bianchi, Product Marketing Specialist, ha analizzato il suo CV per una posizione
              da Junior Product Marketing Manager a Milano. Questo è il risultato, senza dover caricare nulla.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6 items-start">
            {/* Colonna sinistra: input reale */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="rounded-2xl bg-white text-slate-900 p-5 sm:p-6 shadow-2xl">
                <div className="flex items-start justify-between gap-3 border-b-2 border-slate-900 pb-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold">Elena Bianchi</h3>
                    <p className="text-sm text-slate-500">Product Marketing Specialist · Milano</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 text-emerald-700 px-2.5 py-1 text-xs font-semibold shrink-0">
                    Score 87/100
                  </span>
                </div>
                <p className="text-xs font-bold uppercase text-slate-400 mb-1.5">Profilo</p>
                <p className="text-sm mb-4">
                  Specialist con 4 anni di esperienza in SaaS B2B: lanci prodotto, contenuti sales-enablement
                  e campagne lifecycle che hanno aumentato l&apos;attivazione del 22%.
                </p>
                <p className="text-xs font-bold uppercase text-slate-400 mb-1.5">Esperienza — prima dell&apos;ottimizzazione</p>
                <p className="text-sm mb-3 rounded-lg bg-red-50 border border-red-200 p-3">
                  &ldquo;Mi sono occupata del lancio di nuove funzionalità e della creazione di contenuti.&rdquo;
                </p>
                <p className="text-xs font-bold uppercase text-slate-400 mb-1.5">Esperienza 2 — prima dell&apos;ottimizzazione</p>
                <p className="text-sm mb-4 rounded-lg bg-red-50 border border-red-200 p-3">
                  &ldquo;Ho seguito le campagne email e i social aziendali, con buoni risultati.&rdquo;
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Posizionamento", "Sales enablement", "HubSpot", "GA4", "SEO", "Copywriting", "Lifecycle"].map((skill) => (
                    <span key={skill} className="rounded-full bg-indigo-50 text-indigo-700 px-2.5 py-1 text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-xs font-bold uppercase text-slate-400 mt-4 mb-1">Formazione</p>
                <p className="text-sm">
                  Laurea in Comunicazione d&apos;impresa · Università degli Studi di Milano · 2020
                </p>
              </div>

              <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
                  Offerta target
                </p>
                <p className="text-white font-semibold text-sm mb-1">
                  Junior Product Marketing Manager · Fintech · Milano (ibrido)
                </p>
                <blockquote className="text-zinc-400 text-sm leading-relaxed border-l-2 border-fuchsia-500/50 pl-3 italic">
                  &ldquo;Cerchiamo una figura con esperienza in lanci SaaS, A/B test, messaggistica per
                  buyer persona e collaborazione con sales e product. Plus: pricing, packaging e win/loss analysis.&rdquo;
                </blockquote>
              </div>
            </motion.div>

            {/* Colonna destra: output reale */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="glass-card rounded-2xl p-5 sm:p-8 border border-white/10"
            >
              <div className="flex items-center gap-5 mb-7">
                <div className="relative w-24 h-24 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="none"
                      stroke="url(#realScoreGrad)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray="100"
                      strokeDashoffset={13}
                    />
                    <defs>
                      <linearGradient id="realScoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#e879f9" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">87</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 flex-1">
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                    <p className="text-zinc-500 text-[11px] uppercase tracking-wide">ATS</p>
                    <p className="text-emerald-300 text-xl font-bold">92</p>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                    <p className="text-zinc-500 text-[11px] uppercase tracking-wide">Job match</p>
                    <p className="text-indigo-300 text-xl font-bold">84</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: "Contenuti", value: "82", tone: "text-sky-300" },
                  { label: "Scrittura", value: "79", tone: "text-amber-300" },
                  { label: "Readiness", value: "85", tone: "text-fuchsia-300" },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-white/5 border border-white/10 p-2.5 text-center">
                    <p className="text-zinc-500 text-[10px] uppercase tracking-wide">{m.label}</p>
                    <p className={`${m.tone} text-lg font-bold`}>{m.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/25 p-4">
                  <p className="text-emerald-300 text-xs font-bold uppercase tracking-wide mb-2">Punti di forza</p>
                  <ul className="space-y-1.5 text-sm text-zinc-200">
                    <li>· Lanci SaaS con metriche (+22% attivazione)</li>
                    <li>· Formato ATS-compatibile, zero tabelle</li>
                    <li>· Skill core già allineate (SEO, HubSpot)</li>
                    <li>· 4 anni di esperienza nel SaaS B2B</li>
                  </ul>
                </div>
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/25 p-4">
                  <p className="text-amber-300 text-xs font-bold uppercase tracking-wide mb-2">Da migliorare</p>
                  <ul className="space-y-1.5 text-sm text-zinc-200">
                    <li>· Bullet generici senza numeri</li>
                    <li>· Mancano: pricing, win/loss, A/B test</li>
                    <li>· Profilo prolisso: tagliare il superfluo</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-xl bg-black/30 border border-white/10 p-4 mb-6">
                <p className="text-xs font-bold uppercase tracking-wide text-fuchsia-300 mb-2">
                  Riscrittura AI del bullet
                </p>
                <p className="text-zinc-500 text-sm line-through mb-1.5">
                  Mi sono occupata del lancio di nuove funzionalità e della creazione di contenuti.
                </p>
                <p className="text-white text-sm leading-relaxed">
                  Guidato il lancio di 3 funzionalità SaaS con messaggistica per 2 buyer persona e kit
                  sales-enablement, aumentando l&apos;attivazione del 22% su 12.000 utenti.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-zinc-500 text-xs mr-1">Keyword da aggiungere:</span>
                {["A/B test", "Pricing", "Win/loss"].map((keyword) => (
                  <span key={keyword} className="rounded-full bg-red-500/15 text-red-300 px-2.5 py-1 text-xs font-medium">
                    {keyword}
                  </span>
                ))}
              </div>

              <div className="rounded-xl bg-indigo-500/10 border border-indigo-500/25 p-4 mb-7">
                <p className="text-xs font-bold uppercase tracking-wide text-indigo-300 mb-2">
                  Cover letter generata
                </p>
                <p className="text-zinc-300 text-sm leading-relaxed italic">
                  &ldquo;Gentile team, in 4 anni nel SaaS B2B ho lanciato 3 funzionalità che hanno
                  alzato l&apos;attivazione del 22% su 12.000 utenti. Porto messaggistica per buyer
                  persona e kit sales-enablement: esattamente ciò che cercate per questo ruolo.&rdquo;
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/analyze"
                  className="btn-primary text-white px-6 py-3.5 rounded-full font-semibold text-sm text-center flex-1 inline-flex items-center justify-center gap-2"
                >
                  Prova con il tuo CV
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/register"
                  className="btn-secondary text-white px-6 py-3.5 rounded-full font-medium text-sm text-center flex-1"
                >
                  Crea il tuo da zero
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
