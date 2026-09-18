export const templates = [
  { slug: "ats-clean", name: "ATS Clean", tag: "ATS-safe", desc: "Minimal, una colonna, passa tutti i parser ATS." },
  { slug: "modern", name: "Modern Two-Column", tag: "Creativo", desc: "Bilanciato creatività/leggibilità, ideale tech." },
  { slug: "executive", name: "Executive", tag: "ATS-safe", desc: "Elegante per senior/manager." },
  { slug: "academic", name: "Academic", tag: "Accademico", desc: "Pubblicazioni e formazione in evidenza." },
];

export const roadmaps = [
  { slug: "frontend-engineer", title: "Roadmap Frontend Engineer", level: "Mid→Senior", steps: ["React/TS avanzato", "Performance & a11y", "System design frontend"] },
  { slug: "backend-engineer", title: "Roadmap Backend Engineer", level: "Junior→Mid", steps: ["API design", "DB & caching", "Distributed systems"] },
  { slug: "data-scientist", title: "Roadmap Data Scientist", level: "Mid", steps: ["Python/SQL", "ML in produzione", "MLOps"] },
  { slug: "product-manager", title: "Roadmap Product Manager", level: "Mid", steps: ["Discovery", "Roadmap & stakeholder", "Metrics"] },
];

export const guides = [
  { slug: "cv-ats-2026", title: "CV ATS nel 2026: checklist completa", excerpt: "Le 5 verifiche che fanno passare il tuo CV dai filtri ATS.", readMin: 6 },
  { slug: "tailoring-jd", title: "Adattare il CV alla job description senza inventare", excerpt: "Come riscrivere i bullet con evidenze reali.", readMin: 5 },
  { slug: "cover-letter-italia", title: "Cover letter in Italia: struttura e errori comuni", excerpt: "Modello e tono per mercato italiano/europeo.", readMin: 4 },
  { slug: "negoziazione-ral", title: "Negoziare la RAL: script e timing", excerpt: "Quando e come chiedere più del primo numero.", readMin: 7 },
];

export const projects = [
  { slug: "saas-billing", title: "SaaS Billing con Stripe", stack: "Next.js + Stripe", desc: "Abbonamenti, webhook e customer portal." },
  { slug: "ats-parser", title: "ATS Parser per CV", stack: "Python + regex", desc: "Estrae keyword e calcola score ATS." },
  { slug: "realtime-board", title: "Kanban Realtime", stack: "Supabase Realtime", desc: "Pipeline candidature con drag&drop." },
  { slug: "cover-letter-ai", title: "Generatore Cover Letter", stack: "Groq API", desc: "Cover letter ancorate a esperienza reale." },
];

export const salaries = [
  { role: "Frontend Mid — Milano", range: "38–58k", market: "Italia" },
  { role: "Backend Senior — EU Remote", range: "70–105k", market: "Europa" },
  { role: "ML Engineer — Remoto USA", range: "140–190k $", market: "USA" },
  { role: "Product Manager — Milano", range: "45–75k", market: "Italia" },
  { role: "Data Engineer — Berlino", range: "65–85k", market: "Europa" },
];

export const compareRows = [
  { feature: "ATS score con evidenze", curriculuxe: "✓", resumax: "✓", generic: "parziale" },
  { feature: "Tailoring con preview human-in-loop", curriculuxe: "✓", resumax: "✓", generic: "auto" },
  { feature: "Career Market pubblico senza login", curriculuxe: "✓", resumax: "✓", generic: "—" },
  { feature: "MCP — usa l'agente in ChatGPT/Claude", curriculuxe: "✓ (gating per piano)", resumax: "✓", generic: "—" },
  { feature: "No mass auto-apply", curriculuxe: "✓ etico", resumax: "✓", generic: "rischio" },
];
