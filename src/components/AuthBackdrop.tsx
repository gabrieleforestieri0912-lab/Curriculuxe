"use client";

import { motion } from "framer-motion";

interface MiniCVJob {
  role: string;
  company: string;
  period: string;
  bullets: [string, string];
}

interface MiniCVConfig {
  id: string;
  className: string;
  rotate: number;
  duration: number;
  delay: number;
  opacity: string;
  name: string;
  initials: string;
  title: string;
  contact: string;
  score: string;
  jobs: [MiniCVJob, MiniCVJob];
  skills: string[];
  education: string;
}

const CARDS: MiniCVConfig[] = [
  {
    id: "cv-1",
    className: "left-[3%] top-[10%] w-48 sm:w-60",
    rotate: -8,
    duration: 7,
    delay: 0,
    opacity: "opacity-90",
    name: "Mario Rossi",
    initials: "MR",
    title: "Senior Frontend Developer",
    contact: "m.rossi@email.com · +39 340 123 4567 · Milano",
    score: "92",
    jobs: [
      {
        role: "Senior Frontend Developer",
        company: "TechCorp S.p.A. · 2022–oggi",
        period: "",
        bullets: [
          "Piattaforma SaaS per 50.000 utenti in React e TypeScript.",
          "Tempi di risposta ridotti del 40% con caching e code-splitting.",
        ],
      },
      {
        role: "Frontend Developer",
        company: "WebStudio · 2019–2022",
        period: "",
        bullets: [
          "Refactoring UI legacy e design system condiviso.",
          "Conversioni landing +18% con test A/B continui.",
        ],
      },
    ],
    skills: ["React", "TypeScript", "Next.js", "Tailwind", "Node.js"],
    education: "Laurea Informatica · Politecnico di Milano · 2019",
  },
  {
    id: "cv-2",
    className: "right-[4%] top-[14%] w-48 sm:w-60 hidden md:block",
    rotate: 7,
    duration: 8,
    delay: 0.8,
    opacity: "opacity-90",
    name: "Laura Bianchi",
    initials: "LB",
    title: "UX/UI Designer",
    contact: "l.bianchi@email.com · +39 333 987 6543 · Roma",
    score: "88",
    jobs: [
      {
        role: "Product Designer",
        company: "Fintech Lab · 2021–oggi",
        period: "",
        bullets: [
          "Design system per app bancaria da 200.000 utenti.",
          "Onboarding ridisegnato: drop-off -25% in 3 mesi.",
        ],
      },
      {
        role: "UI Designer",
        company: "Creative Agency · 2018–2021",
        period: "",
        bullets: [
          "Interfacce e-commerce e prototipi ad alta fedeltà.",
          "User test con 40+ partecipanti e report mensili.",
        ],
      },
    ],
    skills: ["Figma", "Design System", "Prototyping", "User Research", "Miro"],
    education: "Laurea Design · Sapienza Roma · 2018",
  },
  {
    id: "cv-3",
    className: "left-[7%] bottom-[9%] w-48 sm:w-60 hidden md:block",
    rotate: 6,
    duration: 9,
    delay: 0.4,
    opacity: "opacity-80",
    name: "Giuseppe Verdi",
    initials: "GV",
    title: "Backend Engineer",
    contact: "g.verdi@email.com · +39 347 555 0132 · Torino",
    score: "95",
    jobs: [
      {
        role: "Backend Engineer",
        company: "CloudSystems · 2020–oggi",
        period: "",
        bullets: [
          "Microservizi Node.js e PostgreSQL su AWS EKS.",
          "Throughput API +3x con code e cache Redis.",
        ],
      },
      {
        role: "Software Developer",
        company: "DataFactory · 2017–2020",
        period: "",
        bullets: [
          "ETL giornaliere per 10M+ record con Python.",
          "Monitoraggio e alerting con Grafana e PagerDuty.",
        ],
      },
    ],
    skills: ["Node.js", "Python", "PostgreSQL", "AWS", "Docker"],
    education: "Laurea Ingegneria · Politecnico di Torino · 2017",
  },
  {
    id: "cv-4",
    className: "right-[8%] bottom-[12%] w-48 sm:w-60 hidden md:block",
    rotate: -6,
    duration: 7.5,
    delay: 1.1,
    opacity: "opacity-80",
    name: "Anna Neri",
    initials: "AN",
    title: "Data Analyst",
    contact: "a.neri@email.com · +39 349 222 8899 · Bologna",
    score: "81",
    jobs: [
      {
        role: "Data Analyst",
        company: "Retail Group · 2022–oggi",
        period: "",
        bullets: [
          "Dashboard vendite in Power BI per 30 store.",
          "Forecast domanda con errore medio sotto il 7%.",
        ],
      },
      {
        role: "Junior Analyst",
        company: "Marketing Hub · 2020–2022",
        period: "",
        bullets: [
          "Report campagne e KPI settimanali in SQL.",
          "Automazione report: -6 ore manuali a settimana.",
        ],
      },
    ],
    skills: ["SQL", "Power BI", "Python", "Excel", "GA4"],
    education: "Laurea Statistica · Università di Bologna · 2020",
  },
  {
    id: "cv-5",
    className: "left-[40%] top-[3%] w-44 hidden lg:block",
    rotate: -3,
    duration: 10,
    delay: 0.2,
    opacity: "opacity-60",
    name: "Marco Gialli",
    initials: "MG",
    title: "DevOps Engineer",
    contact: "m.gialli@email.com · Napoli",
    score: "90",
    jobs: [
      {
        role: "DevOps Engineer",
        company: "InfraTech · 2021–oggi",
        period: "",
        bullets: [
          "Pipeline CI/CD e cluster Kubernetes gestiti.",
          "Deploy passati da settimanali a giornalieri.",
        ],
      },
      {
        role: "SysAdmin",
        company: "HostingPro · 2018–2021",
        period: "",
        bullets: [
          "200+ server Linux e automazione Ansible.",
          "Uptime garantito al 99,9% su tre anni.",
        ],
      },
    ],
    skills: ["Kubernetes", "Terraform", "CI/CD", "Linux", "AWS"],
    education: "Diploma + certificazione CKA · 2021",
  },
  {
    id: "cv-6",
    className: "right-[36%] bottom-[4%] w-44 hidden lg:block",
    rotate: 4,
    duration: 9.5,
    delay: 1.4,
    opacity: "opacity-60",
    name: "Sara Blu",
    initials: "SB",
    title: "Project Manager",
    contact: "s.blu@email.com · Firenze",
    score: "87",
    jobs: [
      {
        role: "Project Manager",
        company: "Digital Agency · 2020–oggi",
        period: "",
        bullets: [
          "12 progetti web con team fino a 8 persone.",
          "Consegne puntuali al 96% con metodo Agile.",
        ],
      },
      {
        role: "Junior PM",
        company: "Startup Lab · 2018–2020",
        period: "",
        bullets: [
          "Backlog, sprint e reporting al management.",
          "Budget progetti fino a 150.000 euro.",
        ],
      },
    ],
    skills: ["Agile", "Scrum", "Jira", "Budget", "Stakeholder"],
    education: "Laurea Economia · Firenze · 2018",
  },
];

function MiniCV({ card }: { card: MiniCVConfig }) {
  return (
    <motion.div
      initial={{ y: 0, rotate: card.rotate, opacity: 0 }}
      animate={{ y: [0, -16, 0], rotate: card.rotate, opacity: 1 }}
      transition={{ y: { duration: card.duration, repeat: Infinity, ease: "easeInOut", delay: card.delay }, opacity: { duration: 1, delay: card.delay } }}
      className={`absolute ${card.className} ${card.opacity}`}
    >
      <div className="rounded-md bg-[#f8f7f4] text-zinc-800 shadow-2xl shadow-black/60 select-none overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-indigo-500" />
        <div className="p-3.5">
          <div className="flex items-start gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-600 text-[9px] font-bold text-white">
              {card.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold leading-tight text-zinc-900">{card.name}</p>
              <p className="text-[7.5px] font-semibold leading-tight text-indigo-700">{card.title}</p>
              <p className="text-[6px] leading-tight text-zinc-500 truncate">{card.contact}</p>
            </div>
            <div className="shrink-0 rounded bg-emerald-600 px-1.5 py-0.5 text-[8px] font-bold text-white leading-none">
              ATS {card.score}
            </div>
          </div>

          <p className="mt-2.5 text-[6.5px] font-bold tracking-[0.14em] text-zinc-400">ESPERIENZA</p>
          <div className="mt-1 space-y-1.5">
            {card.jobs.map((job) => (
              <div key={job.role}>
                <p className="text-[7.5px] font-bold leading-tight text-zinc-900">
                  {job.role} <span className="font-normal text-zinc-500">· {job.company}</span>
                </p>
                {job.bullets.map((b) => (
                  <p key={b} className="text-[6.5px] leading-snug text-zinc-600">
                    <span className="mr-1 text-indigo-600">•</span>{b}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <p className="mt-2 text-[6.5px] font-bold tracking-[0.14em] text-zinc-400">SKILLS</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {card.skills.map((s) => (
              <span key={s} className="rounded-full bg-indigo-100 px-1.5 py-px text-[6px] font-semibold text-indigo-800">
                {s}
              </span>
            ))}
          </div>

          <p className="mt-2 text-[6.5px] font-bold tracking-[0.14em] text-zinc-400">FORMAZIONE</p>
          <p className="mt-0.5 text-[6.5px] leading-snug text-zinc-600">{card.education}</p>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Sfondo animato per le pagine di accesso: veri mini-CV cartacei
 * fluttuanti su base scura con aloni viola. Non interattivo.
 */
export default function AuthBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(168,85,247,0.22),transparent_40%),radial-gradient(circle_at_85%_80%,rgba(232,121,249,0.14),transparent_40%),radial-gradient(circle_at_60%_50%,rgba(99,102,241,0.10),transparent_45%)]" />
      {CARDS.map((card) => (
        <MiniCV key={card.id} card={card} />
      ))}
    </div>
  );
}
