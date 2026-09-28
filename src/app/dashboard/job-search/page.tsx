"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface EmailTemplate {
  subject: string;
  body: string;
}

interface EmailTemplates {
  [key: string]: {
    [key: string]: EmailTemplate;
  };
}

const emailTemplates: EmailTemplates = {
  it: {
    acceptance: {
      subject: "Accettazione Offerta - [Ruolo]",
      body: `Oggetto: Accettazione Offerta - [Ruolo]\n\nGentile [Nome Hiring Manager],\n\nLa ringrazio per l'offerta per il ruolo di [Ruolo] presso [Azienda].\n\nSono entusiasta di accettare e non vedo l'ora di iniziare il [Data Inizio].\n\nConfermo il pacchetto retributivo concordato:\n- RAL: [Importo]\n- Bonus: [Dettaglio]\n- Benefit: [Dettaglio]\n\nResto a disposizione per qualsiasi chiarimento.\n\nCordiali saluti,\n[Tuo Nome]`,
    },
    rejection: {
      subject: "Rifiuto Offerta - [Ruolo]",
      body: `Oggetto: Rifiuto Offerta - [Ruolo]\n\nGentile [Nome Hiring Manager],\n\nLa ringrazio per l'offerta ricevuta per il ruolo di [Ruolo] presso [Azienda] e per il tempo dedicatomi durante il processo di selezione.\n\nDopo attenta valutazione, ho deciso di declinare l'offerta in quanto ho accettato un'altra opportunit\u00e0 pi\u00f9 in linea con i miei obiettivi di carriera.\n\nLe auguro tutto il meglio.\n\nCordiali saluti,\n[Tuo Nome]`,
    },
    negotiation: {
      subject: "Negoziazione Offerta - [Ruolo]",
      body: `Oggetto: Negoziazione Offerta - [Ruolo]\n\nGentile [Nome Hiring Manager],\n\nLa ringrazio per l'offerta per il ruolo di [Ruolo] presso [Azienda]. Sono molto interessato e vorrei discutere alcuni aspetti del pacchetto retributivo.\n\nBasandomi sulle mie competenze ed esperienze, e considerando i benchmark di mercato per posizioni simili, proporrei:\n\n- RAL: [Importo Proposto]\n- [Altri punti da negoziare]\n\nSono certo che possiamo trovare un accordo che soddisfi entrambi. Resto a disposizione per approfondire.\n\nCordiali saluti,\n[Tuo Nome]`,
    },
  },
  en: {
    acceptance: {
      subject: "Offer Acceptance - [Role]",
      body: `Subject: Offer Acceptance - [Role]\n\nDear [Hiring Manager Name],\n\nThank you for the offer for the [Role] position at [Company].\n\nI am excited to accept and look forward to starting on [Start Date].\n\nI confirm the agreed compensation package:\n- Salary: [Amount]\n- Bonus: [Detail]\n- Benefits: [Detail]\n\nPlease let me know if you need any further information.\n\nBest regards,\n[Your Name]`,
    },
    rejection: {
      subject: "Offer Decline - [Role]",
      body: `Subject: Offer Decline - [Role]\n\nDear [Hiring Manager Name],\n\nThank you for the offer for the [Role] position at [Company] and for your time during the interview process.\n\nAfter careful consideration, I have decided to decline the offer as I have accepted another opportunity that better aligns with my career goals.\n\nI wish you all the best.\n\nBest regards,\n[Your Name]`,
    },
    negotiation: {
      subject: "Offer Negotiation - [Role]",
      body: `Subject: Offer Negotiation - [Role]\n\nDear [Hiring Manager Name],\n\nThank you for the offer for the [Role] position at [Company]. I am very interested and would like to discuss some aspects of the compensation package.\n\nBased on my skills and experience, and considering market benchmarks for similar roles, I would propose:\n\n- Salary: [Proposed Amount]\n- [Other negotiation points]\n\nI am confident we can reach a mutually beneficial agreement.\n\nBest regards,\n[Your Name]`,
    },
  },
};

export default function JobSearchPage() {
  const { t, lang } = useLanguage();
  const tJobSearch = t.jobSearch as Record<string, string>;
  const [activeTab, setActiveTab] = useState("strategy");
  const [templateType, setTemplateType] = useState("acceptance");
  const [copied, setCopied] = useState(false);
  const [negCompany, setNegCompany] = useState("");
  const [negRole, setNegRole] = useState("");
  const [negSalary, setNegSalary] = useState("");
  const [negPoints, setNegPoints] = useState("");
  const [negMarket, setNegMarket] = useState("italia");
  const [negLoading, setNegLoading] = useState(false);
  const [negResult, setNegResult] = useState<Record<string, unknown> | null>(null);
  const [negError, setNegError] = useState("");

  const runNegotiation = async () => {
    if (!negRole.trim()) return;
    setNegLoading(true);
    setNegError("");
    setNegResult(null);
    try {
      const res = await fetch("/api/jobs/negotiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: negCompany,
          role: negRole,
          salary: negSalary,
          points: negPoints,
          market: negMarket,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNegError(data.error || "Errore durante la generazione della negoziazione");
        return;
      }
      setNegResult(data);
    } catch {
      setNegError("Errore di rete. Riprova.");
    } finally {
      setNegLoading(false);
    }
  };

  const templates = emailTemplates[lang] || emailTemplates.it;
  const currentTemplate = templates[templateType];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: "strategy", label: tJobSearch.strategy, icon: "M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 6.75h-4.5m4.5 0L1.5 3M9 3.75h4.5" },
    { id: "networking", label: tJobSearch.networking, icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" },
    { id: "templates", label: tJobSearch.emailTemplate, icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" },
    { id: "negotiation", label: tJobSearch.negotiation, icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="relative z-10 pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">{tJobSearch.title}</h1>
            <p className="text-zinc-400">{tJobSearch.subtitle}</p>
          </motion.div>

          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-white/5 text-zinc-400 border border-white/10 hover:text-white hover:bg-white/10"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "strategy" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-8 border border-white/10"
            >
              <h2 className="text-xl font-bold text-white mb-6">{tJobSearch.strategy}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: "LinkedIn Optimization", desc: "Profilo completo, banner personalizzato, recommendations strategiche. Posta contenuti di valore per attrarre recruiters." },
                  { title: "Target Company List", desc: "Crea una lista di 20-30 aziende target. Seguile, interagisci e monitora le aperture di posizioni." },
                  { title: "Application Tracker", desc: "Tieni traccia di ogni candidatura: data, contatti, stato, follow-up programmati. Organizzati con un sistema." },
                  { title: "Personal Branding", desc: "Portfolio, GitHub o sito personale. I recruiters cercano candidate che dimostrano competenza attiva." },
                ].map((item, i) => (
                  <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-5">
                    <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "networking" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-8 border border-white/10"
            >
              <h2 className="text-xl font-bold text-white mb-6">{tJobSearch.networking}</h2>
              <div className="space-y-4">
                {[
                  { title: "Connect Message", desc: '"Ciao [Nome], ho apprezzato il tuo lavoro su [progetto/articolo]. Sono un [ruolo] e mi piacerebbe connettermi per seguire i tuoi contenuti."' },
                  { title: "Info Interview Request", desc: '"Ciao [Nome], sono in fase di transizione di carriera e il tuo percorso in [Azienda] mi ispira. Ti andrebbe un caffè virtuale di 15 minuti?"' },
                  { title: "Referral Request", desc: '"Ciao [Nome], ho visto che [Azienda] sta cercando un [ruolo]. Ho [X anni] di esperienza in [campo]. Se vedi fit, apprezzerei una referral."' },
                  { title: "Follow-up Template", desc: '"Ciao [Nome], volevo ringraziarti per il tempo dedicato. Ho seguito il tuo consiglio su [tema] e ho trovato [risultato]. Teniamoci in contatto!"' },
                ].map((item, i) => (
                  <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-5">
                    <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                    <p className="text-zinc-400 text-sm italic leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "templates" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-8 border border-white/10"
            >
              <h2 className="text-xl font-bold text-white mb-6">{tJobSearch.emailTemplate}</h2>

              <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                {[
                  { id: "acceptance", label: "Accettazione" },
                  { id: "rejection", label: "Rifiuto" },
                  { id: "negotiation", label: "Negoziazione" },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => { setTemplateType(type.id); setCopied(false); }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                      templateType === type.id
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-white/5 text-zinc-400 border border-white/10 hover:text-white"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">{tJobSearch.emailSubject}</label>
                  <div className="w-full bg-black/25 border border-white/10 rounded-xl px-4 py-3 text-white">
                    {currentTemplate.subject}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">{tJobSearch.emailBody}</label>
                  <textarea
                    readOnly
                    rows={12}
                    value={currentTemplate.body}
                    className="w-full bg-black/25 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm leading-relaxed resize-y"
                  />
                </div>
                <button
                  onClick={() => copyToClipboard(currentTemplate.body)}
                  className="btn-secondary px-6 py-3 rounded-xl font-semibold"
                >
                  {copied ? "Copied!" : tJobSearch.useTemplate}
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "negotiation" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="glass-card rounded-2xl p-8 border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Negoziatore AI</h2>
                    <p className="text-zinc-400 text-sm">Inserisci i dati dell&apos;offerta: Atlas genera email, talking points e controproposta basati su benchmark di mercato.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Azienda</label>
                    <input
                      type="text"
                      value={negCompany}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNegCompany(e.target.value)}
                      placeholder="Es. Facile.it"
                      className="w-full bg-black/25 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Ruolo *</label>
                    <input
                      type="text"
                      value={negRole}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNegRole(e.target.value)}
                      placeholder="Es. Senior Frontend Engineer"
                      className="w-full bg-black/25 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Compenso offerto</label>
                    <input
                      type="text"
                      value={negSalary}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNegSalary(e.target.value)}
                      placeholder="Es. 55.000€ RAL + bonus"
                      className="w-full bg-black/25 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Mercato</label>
                    <div className="flex gap-2">
                      {[
                        { id: "italia", label: "Italia" },
                        { id: "europa", label: "Europa" },
                        { id: "usa", label: "USA" },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setNegMarket(m.id)}
                          className={`flex-1 rounded-xl px-3 py-3 text-sm transition-all ${
                            negMarket === m.id
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-white/5 text-zinc-400 border border-white/10 hover:text-white"
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Punti da negoziare (opzionale)</label>
                  <input
                    type="text"
                    value={negPoints}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNegPoints(e.target.value)}
                    placeholder="Es. RAL, stock options, ferie extra, budget formazione"
                    className="w-full bg-black/25 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  onClick={runNegotiation}
                  disabled={negLoading || !negRole.trim()}
                  className="w-full btn-primary py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {negLoading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Generazione in corso...
                    </>
                  ) : (
                    "Genera strategia di negoziazione con AI"
                  )}
                </button>

                {negError && <p className="text-red-400 text-sm mt-3">{negError}</p>}

                {negResult && (
                  <div className="mt-6 space-y-4">
                    <div className="rounded-xl bg-white/5 border border-white/10 p-5">
                      <p className="text-emerald-300 font-semibold mb-2">Oggetto email</p>
                      <p className="text-zinc-300 text-sm">{negResult.emailSubject as string}</p>
                    </div>
                    <div className="rounded-xl bg-white/5 border border-white/10 p-5">
                      <p className="text-emerald-300 font-semibold mb-2">Email di negoziazione</p>
                      <pre className="whitespace-pre-wrap text-zinc-300 text-sm leading-relaxed font-mono">{negResult.emailBody as string}</pre>
                      <button
                        onClick={() => copyToClipboard(negResult.emailBody as string)}
                        className="mt-3 btn-secondary px-4 py-2 rounded-lg text-sm font-semibold"
                      >
                        {copied ? "Copied!" : "Copia email"}
                      </button>
                    </div>
                    {Array.isArray(negResult.talkingPoints) && (negResult.talkingPoints as string[]).length > 0 && (
                      <div className="rounded-xl bg-white/5 border border-white/10 p-5">
                        <p className="text-emerald-300 font-semibold mb-3">Talking points per la call</p>
                        <ul className="space-y-2">
                          {(negResult.talkingPoints as string[]).map((point, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                              <span className="text-emerald-400 mt-0.5">{"\u2022"}</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {negResult.counterProposal && (
                      <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-5">
                        <p className="text-emerald-300 font-semibold mb-2">Controproposta</p>
                        <p className="text-zinc-300 text-sm">{negResult.counterProposal as string}</p>
                      </div>
                    )}
                    {Array.isArray(negResult.benchmarks) && (negResult.benchmarks as string[]).length > 0 && (
                      <div className="rounded-xl bg-white/5 border border-white/10 p-5">
                        <p className="text-emerald-300 font-semibold mb-3">Benchmark da citare</p>
                        <ul className="space-y-2">
                          {(negResult.benchmarks as string[]).map((b, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                              <span className="text-emerald-400 mt-0.5">{"\u2022"}</span>
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="glass-card rounded-2xl p-8 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-6">{tJobSearch.negotiation}</h2>
                <p className="text-zinc-400 mb-6">{tJobSearch.negotiationDesc}</p>

                <div className="space-y-4">
                  {[
                    { title: "1. Preparation", desc: "Ricerca benchmark di mercato su Glassdoor, LinkedIn Salary, Levels.fyi. Conosci la fascia RAL per ruolo, seniority e citt\u00e0." },
                    { title: "2. Timing", desc: "Non negoziare mai al primo contatto. Aspetta l'offerta formale. Fai capire che stai valutando multiple opzioni." },
                    { title: "3. Total Compensation", desc: "Oltre alla RAL considera: bonus annuale, stock options/equity, assicurazione sanitaria, ferie extra, budget formazione, remote work allowance." },
                    { title: "4. Negotiation Script", desc: '"Apprezzo molto l\'offerta. Basandomi sulle mie competenze e sui benchmark di mercato, mi aspettavo una RAL pi\u00f9 vicina a [X]. Possiamo incontrarci su questo punto?"' },
                    { title: "5. Closing", desc: "Una volta raggiunto l'accordo, chiedi la lettera d'offerta formale per iscritto. Non dare le dimissioni finch\u00e9 non hai firmato." },
                  ].map((item, i) => (
                    <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-5">
                      <h3 className="text-emerald-300 font-semibold mb-2">{item.title}</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-8 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-6">{tJobSearch.negotiationTips}</h2>
                <ul className="space-y-3">
                  {[
                    tJobSearch.tip1,
                    tJobSearch.tip2,
                    tJobSearch.tip3,
                    tJobSearch.tip4,
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-400">
                      <svg className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
