"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { 
  CheckCircle, 
  Lightbulb, 
  Sparkles, 
  Cpu, 
  TrendingUp, 
  ThumbsUp, 
  ArrowRight,
  FileText
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ProductShowcase() {
  const { t } = useLanguage();
  const tProductShowcase = t.productShowcase as Record<string, string>;
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);

  return (
    <section className="py-24 px-6 gradient-bg">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-fuchsia-400 mb-3 px-3 py-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10">
            L&apos;Esperienza Reale
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
            L&apos;analisi <span className="text-gradient">interattiva</span> sul tuo CV
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Passa il mouse sopra i badge dell&apos;AI per vedere in tempo reale quali parti del tuo curriculum vengono analizzate, valutate e migliorate.
          </p>
        </motion.div>

        {/* Core Showcase Container */}
        <div className="relative flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-0 lg:min-h-[920px] lg:py-10">
          
          {/* ──── LEFT CARDS ──── */}
          <div className="w-full lg:w-auto flex flex-col gap-6 z-20 lg:absolute lg:left-0 lg:top-[5%] xl:left-[2%]">
            
            {/* Card 1: Strengths & Suggestions */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              onMouseEnter={() => setActiveHighlight("general")}
              onMouseLeave={() => setActiveHighlight(null)}
              className={`glass-card rounded-2xl p-6 border transition-all duration-300 w-full lg:w-[320px] xl:w-[350px] cursor-pointer ${
                activeHighlight === "general"
                  ? "border-fuchsia-500 bg-fuchsia-950/20 shadow-[0_0_30px_rgba(217,70,239,0.15)] scale-[1.03]"
                  : "border-white/10 hover:border-white/20 bg-white/5"
              }`}
            >
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-400">{tProductShowcase.strengths as string}</h4>
                    <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                      Strong technical skills and quantified experience bullets with business impact.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-3 border-t border-white/5">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-400">{tProductShowcase.improvements as string}</h4>
                    <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                      Emphasize technical leadership and add production-level projects.
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5">
                  <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Score Breakdown</p>
                  <div className="flex gap-1.5 items-center">
                    <div className="h-1.5 w-10 bg-violet-500 rounded-full" />
                    <div className="h-1.5 w-10 bg-indigo-500 rounded-full" />
                    <div className="h-1.5 w-10 bg-emerald-500 rounded-full" />
                    <div className="h-1.5 w-10 bg-zinc-700 rounded-full" />
                    <span className="text-[10px] text-zinc-400 font-semibold ml-2">91% of maximum</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Strong Bullet & How to Improve */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              onMouseEnter={() => setActiveHighlight("redis")}
              onMouseLeave={() => setActiveHighlight(null)}
              className={`glass-card rounded-2xl p-6 border transition-all duration-300 w-full lg:w-[340px] xl:w-[370px] cursor-pointer ${
                activeHighlight === "redis"
                  ? "border-emerald-500 bg-emerald-950/20 shadow-[0_0_30px_rgba(16,185,129,0.15)] scale-[1.03]"
                  : "border-white/10 hover:border-white/20 bg-white/5"
              }`}
            >
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-400">Strong Bullet</h4>
                    <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed bg-black/40 p-2.5 rounded-lg border border-white/5 italic">
                      &ldquo;Optimized a Redis-backed caching layer, increasing cache hit rate from 38% to 91%, resulting in a 58% reduction in p95 latency and saving $11K in monthly infrastructure costs.&rdquo;
                    </p>
                    <p className="text-[10px] text-emerald-400 font-medium italic mt-1.5">
                      Highly quantified, business impact, technical depth.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-3 border-t border-white/5">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-400">How to Improve</h4>
                    <div className="space-y-2 mt-2">
                      <div className="text-xs p-2 rounded bg-red-500/10 border border-red-500/20 text-red-300">
                        <span className="font-bold text-[9px] uppercase tracking-wider block text-red-400">Weak</span>
                        &ldquo;Developed a Spring Boot app with Docker on AWS EC2.&rdquo;
                      </div>
                      <div className="text-xs p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                        <span className="font-bold text-[9px] uppercase tracking-wider block text-emerald-400">Better</span>
                        &ldquo;Reduced deployment overhead by 40% through containerizing Spring Boot apps with Docker.&rdquo;
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* ──── CENTER REAL CV ──── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full max-w-xl xl:max-w-2xl bg-white text-slate-800 p-8 sm:p-10 shadow-2xl rounded-xl border border-slate-200 text-left font-serif select-none z-10 transition-all duration-300"
          >
            {/* Header */}
            <div className="text-center border-b border-slate-300 pb-4 mb-4">
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">{tProductShowcase.name as string}</h3>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-1 font-sans">{tProductShowcase.role as string}</p>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-1 font-sans flex flex-wrap items-center justify-center gap-1.5">
                <span>{tProductShowcase.phone as string}</span>
                <span>•</span>
                <span className="underline">{tProductShowcase.email as string}</span>
                <span>•</span>
                <span>{tProductShowcase.location as string}</span>
              </p>
            </div>

            <div className="mb-4">
              <p className="text-[11px] text-slate-700 leading-relaxed">{tProductShowcase.summary as string}</p>
            </div>

            <div className="mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2 font-sans">{tProductShowcase.education as string}</h4>
              <div className="flex justify-between items-baseline text-xs">
                <div>
                  <span className="font-bold text-slate-900">Politecnico di Milano</span>
                  <span className="text-slate-500 italic block">Laurea Magistrale in Ingegneria Informatica</span>
                </div>
                <div className="text-right text-[11px] text-slate-500 shrink-0 font-sans">
                  <span>2015 - 2020</span>
                  <span className="block font-bold">110 / 110</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2 font-sans">{tProductShowcase.experience as string}</h4>
              
              <div className="mb-4">
                <div className="flex justify-between items-baseline text-xs mb-1">
                  <div>
                    <span className="font-bold text-slate-900">TechCorp S.p.A.</span>
                    <span className="text-slate-500 italic ml-2">Senior Full Stack Developer</span>
                  </div>
                  <span className="text-[11px] text-slate-500 shrink-0 font-sans">2022 - Presente</span>
                </div>
                <ul className="list-disc pl-4 text-[11px] leading-relaxed text-slate-700 space-y-1">
                  <li>Guidato lo sviluppo di una piattaforma SaaS utilizzata da oltre 50.000 utenti, architettando il sistema di microservizi con <strong className="text-slate-900 font-sans">React</strong>, <strong className="text-slate-900 font-sans">Node.js</strong> e <strong className="text-slate-900 font-sans">AWS</strong>.</li>
                  <li>Ridotto i tempi di deployment del 60% implementando pipeline CI/CD automatizzate con GitHub Actions e Docker.</li>
                  <li>Mentoring di 4 sviluppatori junior e revisione del codice per garantire standard di qualità elevati.</li>
                </ul>
              </div>

              <div className="mb-4 relative">
                {activeHighlight === "redis" && (
                  <motion.div
                    layoutId="cvHighlight"
                    className="absolute -inset-x-2 -inset-y-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20 pointer-events-none z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}

                <div className="flex justify-between items-baseline text-xs mb-1 relative z-10">
                  <div>
                    <span className="font-bold text-slate-900">InnovateTech Srl</span>
                    <span className="text-slate-500 italic ml-2">Full Stack Developer</span>
                  </div>
                  <span className="text-[11px] text-slate-500 shrink-0 font-sans relative z-10">2020 - 2022</span>
                </div>
                
                <ul className="list-disc pl-4 text-[11px] leading-relaxed text-slate-700 space-y-1 relative z-10">
                  <li>Sviluppato e mantenuto applicazioni web enterprise utilizzando <strong className="text-slate-900 font-sans">React</strong>, <strong className="text-slate-900 font-sans">TypeScript</strong> e <strong className="text-slate-900 font-sans">Spring Boot</strong>.</li>
                  <li className={`transition-all duration-300 rounded p-0.5 ${activeHighlight === "redis" ? "bg-emerald-100/90 text-emerald-950 font-medium" : ""}`}>
                    Implementato un sistema di caching con <strong className="text-slate-900 font-sans">Redis</strong>, migliorando le performance del 40% e riducendo i costi di infrastruttura del 25%.
                  </li>
                  <li>Coordinato la migrazione dal monolite all&apos;architettura a microservizi, riducendo il downtime del 90%.</li>
                </ul>
              </div>

              <div className="mb-4 relative">
                {activeHighlight === "spring-weak" && (
                  <motion.div
                    layoutId="cvHighlight"
                    className="absolute -inset-x-2 -inset-y-1 bg-amber-500/10 rounded-lg border border-amber-500/20 pointer-events-none z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}

                <div className="flex justify-between items-baseline text-xs mb-1 relative z-10">
                  <div>
                    <span className="font-bold text-slate-900">WebStudio Agency</span>
                    <span className="text-slate-500 italic ml-2">Junior Developer</span>
                  </div>
                  <span className="text-[11px] text-slate-500 shrink-0 font-sans relative z-10">2018 - 2020</span>
                </div>
                <ul className="list-disc pl-4 text-[11px] leading-relaxed text-slate-700 space-y-1 relative z-10">
                  <li>Realizzato siti web e applicazioni web per clienti enterprise utilizzando <strong className="text-slate-900 font-sans">React</strong> e <strong className="text-slate-900 font-sans">Node.js</strong>.</li>
                  <li className={`transition-all duration-300 rounded p-0.5 ${activeHighlight === "spring-weak" ? "bg-amber-100/90 text-amber-950 font-medium" : ""}`}>
                    Sviluppata un&apos;app Spring Boot con Docker su AWS EC2, servendo oltre 30 stakeholder. <span className="text-[9px] font-bold text-amber-600 block sm:inline font-sans ml-1">(Rilevato: Migliorabile)</span>
                  </li>
                </ul>
              </div>

            </div>
          </motion.div>

          {/* ──── RIGHT CARDS ──── */}
          <div className="w-full lg:w-auto flex flex-col gap-6 z-20 lg:absolute lg:right-0 lg:top-[8%] xl:right-[2%]">
            
            {/* Card 3: Circular Score & Breakdown */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              onMouseEnter={() => setActiveHighlight("score")}
              onMouseLeave={() => setActiveHighlight(null)}
              className={`glass-card rounded-2xl p-6 border transition-all duration-300 w-full lg:w-[300px] xl:w-[330px] cursor-pointer ${
                activeHighlight === "score"
                  ? "border-emerald-500 bg-emerald-950/20 shadow-[0_0_30px_rgba(16,185,129,0.15)] scale-[1.03]"
                  : "border-white/10 hover:border-white/20 bg-white/5"
              }`}
            >
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-28 h-28 flex items-center justify-center mb-3">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="100" strokeDashoffset="7" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-white">93</span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">/ 100</span>
                  </div>
                </div>
                <h4 className="text-emerald-400 font-extrabold text-lg">Excellent Resume!</h4>
              </div>

              <div className="space-y-3.5">
                <div className="flex justify-between items-center text-xs text-zinc-400">
                  <span className="font-medium">Category Breakdown</span>
                </div>
                {[
                  { label: "ATS Compatibility", score: 25, max: 25, color: "bg-emerald-500" },
                  { label: "Content Optimization", score: 32, max: 35, color: "bg-emerald-500" },
                  { label: "Writing Style", score: 9, max: 10, color: "bg-emerald-500" },
                  { label: "Job Description Match", score: 20, max: 25, color: "bg-amber-500" },
                  { label: "Format Readiness", score: 5, max: 5, color: "bg-emerald-500" },
                ].map((crit, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-zinc-300">
                      <span>{crit.label}</span>
                      <span>{crit.score}/{crit.max}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${crit.color} rounded-full`}
                        style={{ width: `${(crit.score / crit.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Card 4: AI Content Writer */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              onMouseEnter={() => setActiveHighlight("spring-weak")}
              onMouseLeave={() => setActiveHighlight(null)}
              className={`glass-card rounded-2xl p-6 border transition-all duration-300 w-full lg:w-[320px] xl:w-[350px] cursor-pointer ${
                activeHighlight === "spring-weak"
                  ? "border-fuchsia-500 bg-fuchsia-950/20 shadow-[0_0_30px_rgba(217,70,239,0.15)] scale-[1.03]"
                  : "border-white/10 hover:border-white/20 bg-white/5"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-fuchsia-400">
                  <Sparkles className="w-4 h-4 text-fuchsia-400 animate-pulse" />
                  <h4 className="text-sm font-bold">{tProductShowcase.aiContentWriter as string}</h4>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {tProductShowcase.aiWritingDesc as string}
                </p>

                <button 
                  onClick={() => setActiveHighlight(activeHighlight === "spring-weak" ? null : "spring-weak")}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-fuchsia-500/20 hover:shadow-fuchsia-500/30 transition-all hover:scale-[1.02]"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  Generate Bullet
                </button>
              </div>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}
