import { extractKeywords, normalizeText } from "@/lib/cvAnalysis";
import { detectRole } from "@/lib/careerKit";

export interface Job {
  id: string;
  company: string;
  role: string;
  location: string;
  remote: boolean;
  market: "italia" | "europa" | "usa";
  seniority: "junior" | "mid" | "senior";
  salaryMin: number;
  salaryMax: number;
  description: string;
  requiredSkills: string[];
  keywords: string[];
  postedAt: string;
  companySize: string;
}

export interface ScoredJob extends Job {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  reasons: string[];
  highlight: "alta" | "buona" | "media";
}

const COMPANY_SIZE: Record<string, string> = {
  "Big Tech": "10.000+ dipendenti",
  Scaleup: "500-5.000 dipendenti",
  Startup: "50-500 dipendenti",
  Digital: "1.000-10.000 dipendenti",
  Consulenza: "5.000+ dipendenti",
  "Mid-size": "200-1.000 dipendenti",
};

export const jobCatalog: Job[] = [
  {
    id: "frontend-senior-milan",
    company: "Bending Spoons",
    role: "Senior Frontend Engineer",
    location: "Milano",
    remote: false,
    market: "italia",
    seniority: "senior",
    salaryMin: 65000,
    salaryMax: 90000,
    companySize: COMPANY_SIZE["Scaleup"],
    description:
      "Progettiamo app usate da centinaia di milioni di persone. Cerchiamo un Senior Frontend Engineer con esperienza su React, TypeScript e performance su larga scala per migliorare conversione ed esperienza utente in team cross-functional.",
    requiredSkills: ["React", "TypeScript", "JavaScript", "Performance", "Testing", "Git"],
    keywords: ["react", "typescript", "javascript", "frontend", "performance", "testing", "accessibility", "ux"],
    postedAt: "2026-08-10",
  },
  {
    id: "backend-node-milan",
    company: "Facile.it",
    role: "Backend Engineer Node.js",
    location: "Milano (ibrido)",
    remote: true,
    market: "italia",
    seniority: "mid",
    salaryMin: 45000,
    salaryMax: 62000,
    companySize: COMPANY_SIZE["Mid-size"],
    description:
      "Il comparatore leader in Italia. Cerchiamo un Backend Engineer con esperienza su Node.js, API REST e database SQL per costruire servizi scalabili che gestiscono milioni di preventivi al mese.",
    requiredSkills: ["Node.js", "API design", "SQL", "TypeScript", "Docker", "Testing"],
    keywords: ["node.js", "typescript", "sql", "backend", "api", "docker", "microservizi", "aws"],
    postedAt: "2026-08-12",
  },
  {
    id: "fullstack-remoto-italia",
    company: "Remote.com Italia",
    role: "Full Stack Developer",
    location: "Remoto (Italia)",
    remote: true,
    market: "italia",
    seniority: "mid",
    salaryMin: 48000,
    salaryMax: 65000,
    companySize: COMPANY_SIZE["Digital"],
    description:
      "Piattaforma di payroll globale. Cerchiamo un Full Stack Developer con React e Node.js per sviluppare feature end-to-end: dal frontend in React alla logica di backend, con CI/CD e testing automatico.",
    requiredSkills: ["React", "Node.js", "TypeScript", "PostgreSQL", "REST API", "CI/CD"],
    keywords: ["react", "node.js", "typescript", "full stack", "postgresql", "ci/cd", "aws", "testing"],
    postedAt: "2026-08-14",
  },
  {
    id: "data-scientist-milan",
    company: "EssilorLuxottica",
    role: "Data Scientist",
    location: "Milano",
    remote: false,
    market: "italia",
    seniority: "mid",
    salaryMin: 50000,
    salaryMax: 70000,
    companySize: COMPANY_SIZE["Big Tech"],
    description:
      "Nel centro di data science del gruppo lavori su forecasting, segmentazione clienti e machine learning applicato al retail. Cerchiamo profili con solide basi di Python, SQL e ML in produzione.",
    requiredSkills: ["Python", "SQL", "Machine Learning", "Pandas", "Statistics", "Cloud"],
    keywords: ["python", "sql", "machine learning", "data science", "pandas", "forecasting", "statistics", "etl"],
    postedAt: "2026-08-11",
  },
  {
    id: "devops-sre-turin",
    company: "Reply",
    role: "DevOps / SRE Engineer",
    location: "Torino (ibrido)",
    remote: true,
    market: "italia",
    seniority: "mid",
    salaryMin: 42000,
    salaryMax: 60000,
    companySize: COMPANY_SIZE["Consulenza"],
    description:
      "Unisciti a un team che progetta infrastrutture cloud per clienti enterprise. Cerchiamo profili con esperienza su Kubernetes, Docker, Terraform e pipeline CI/CD su AWS o Azure.",
    requiredSkills: ["Docker", "Kubernetes", "Terraform", "CI/CD", "AWS", "Linux"],
    keywords: ["kubernetes", "docker", "terraform", "aws", "azure", "ci/cd", "devops", "linux"],
    postedAt: "2026-08-09",
  },
  {
    id: "product-manager-remote",
    company: "Docebo",
    role: "Product Manager SaaS",
    location: "Remoto (Italia)",
    remote: true,
    market: "italia",
    seniority: "senior",
    salaryMin: 55000,
    salaryMax: 75000,
    companySize: COMPANY_SIZE["Scaleup"],
    description:
      "La piattaforma LMS quotata in borsa. Cerchiamo un Product Manager con esperienza su prodotti SaaS B2B: roadmap, discovery con clienti enterprise e collaborazione con engineering e sales.",
    requiredSkills: ["Product Management", "Agile", "Roadmap", "B2B SaaS", "Stakeholder Management", "Analytics"],
    keywords: ["product management", "saas", "roadmap", "agile", "b2b", "analytics", "stakeholder", "growth"],
    postedAt: "2026-08-13",
  },
  {
    id: "frontend-react-milan",
    company: "Prima Assicurazioni",
    role: "Frontend Engineer React",
    location: "Milano",
    remote: false,
    market: "italia",
    seniority: "mid",
    salaryMin: 42000,
    salaryMax: 58000,
    companySize: COMPANY_SIZE["Digital"],
    description:
      "Insurtech italiana in forte crescita. Cerchiamo un Frontend Engineer con React e TypeScript per costruire esperienze di acquisto semplici e veloci, con focus su accessibilità e testing.",
    requiredSkills: ["React", "TypeScript", "JavaScript", "Testing", "Accessibility", "REST API"],
    keywords: ["react", "typescript", "javascript", "frontend", "testing", "accessibility", "performance"],
    postedAt: "2026-08-15",
  },
  {
    id: "mobile-ios-remoto",
    company: "Satispay",
    role: "Mobile Engineer iOS",
    location: "Milano (ibrido)",
    remote: true,
    market: "italia",
    seniority: "mid",
    salaryMin: 50000,
    salaryMax: 68000,
    companySize: COMPANY_SIZE["Scaleup"],
    description:
      "La fintech dei pagamenti. Cerchiamo un Mobile Engineer iOS con Swift e SwiftUI per far crescere un'app usata da milioni di utenti, con test automatici e CI/CD robusti.",
    requiredSkills: ["Swift", "SwiftUI", "iOS", "Testing", "Git", "REST API"],
    keywords: ["swift", "swiftui", "ios", "mobile", "fintech", "testing", "ci/cd"],
    postedAt: "2026-08-08",
  },
  {
    id: "security-engineer-rome",
    company: "Leonardo",
    role: "Cybersecurity Engineer",
    location: "Roma",
    remote: false,
    market: "italia",
    seniority: "senior",
    salaryMin: 55000,
    salaryMax: 78000,
    companySize: COMPANY_SIZE["Big Tech"],
    description:
      "Progetti cyber per infrastrutture critiche. Cerchiamo un Cybersecurity Engineer con esperienza su penetration testing, cloud security e risposta agli incidenti in contesti enterprise.",
    requiredSkills: ["Security", "Penetration Testing", "Cloud", "Linux", "Networking", "Incident Response"],
    keywords: ["security", "cybersecurity", "penetration testing", "cloud security", "linux", "networking"],
    postedAt: "2026-08-07",
  },
  {
    id: "marketing-seo-milan",
    company: "Privalia",
    role: "Digital Marketing Specialist",
    location: "Milano (ibrido)",
    remote: true,
    market: "italia",
    seniority: "mid",
    salaryMin: 32000,
    salaryMax: 45000,
    companySize: COMPANY_SIZE["Digital"],
    description:
      "E-commerce di moda. Cerchiamo un Digital Marketing Specialist con competenze su SEO, Google Ads e marketing automation per far crescere traffico e conversioni del sito.",
    requiredSkills: ["SEO", "Google Analytics", "Paid Ads", "Email Marketing", "CRM", "Content Strategy"],
    keywords: ["seo", "google analytics", "google ads", "paid media", "crm", "email marketing", "content"],
    postedAt: "2026-08-12",
  },
  {
    id: "account-executive-milan",
    company: "Salesforce Italia",
    role: "Account Executive B2B",
    location: "Milano",
    remote: false,
    market: "italia",
    seniority: "senior",
    salaryMin: 60000,
    salaryMax: 95000,
    companySize: COMPANY_SIZE["Big Tech"],
    description:
      "Vendita di CRM enterprise a grandi clienti italiani. Cerchiamo un Account Executive con track record in vendite B2B complesse, gestione pipeline e negoziazione di contratti pluriennali.",
    requiredSkills: ["CRM", "Negotiation", "B2B Sales", "Pipeline Management", "Forecasting", "Account Management"],
    keywords: ["sales", "b2b", "crm", "pipeline", "negotiation", "enterprise", "account management"],
    postedAt: "2026-08-10",
  },
  {
    id: "ux-designer-milan",
    company: "iGenius",
    role: "Senior UX/UI Designer",
    location: "Milano",
    remote: false,
    market: "italia",
    seniority: "senior",
    salaryMin: 48000,
    salaryMax: 65000,
    companySize: COMPANY_SIZE["Startup"],
    description:
      "AI italiana di livello internazionale. Cerchiamo un Senior UX/UI Designer con Figma, design system e ricerca utente per prodotti AI enterprise. Portfolio con prodotti shipped.",
    requiredSkills: ["Figma", "UX Research", "Wireframing", "Prototyping", "Design Systems", "Usability Testing"],
    keywords: ["figma", "ux", "ui", "design system", "research", "prototyping", "accessibility"],
    postedAt: "2026-08-14",
  },
  {
    id: "backend-go-remoto",
    company: "Bitpanda",
    role: "Backend Engineer Go",
    location: "Remoto (EU)",
    remote: true,
    market: "europa",
    seniority: "senior",
    salaryMin: 70000,
    salaryMax: 95000,
    companySize: COMPANY_SIZE["Scaleup"],
    description:
      "Piattaforma di investimento crypto e azionario. Cerchiamo un Backend Engineer Go con esperienza su sistemi distribuiti ad alta disponibilità, eventi e cloud.",
    requiredSkills: ["Go", "Distributed Systems", "Kubernetes", "SQL", "Event-driven", "Cloud"],
    keywords: ["go", "golang", "backend", "distributed systems", "kubernetes", "event-driven", "crypto"],
    postedAt: "2026-08-13",
  },
  {
    id: "data-engineer-berlin",
    company: "Zalando",
    role: "Data Engineer",
    location: "Berlino (ibrido)",
    remote: true,
    market: "europa",
    seniority: "mid",
    salaryMin: 65000,
    salaryMax: 85000,
    companySize: COMPANY_SIZE["Big Tech"],
    description:
      "E-commerce fashion leader in Europa. Cerchiamo un Data Engineer con Python, Spark e pipeline dati scalabili su AWS per alimentare analytics e machine learning.",
    requiredSkills: ["Python", "Spark", "SQL", "AWS", "ETL", "Data Pipeline"],
    keywords: ["python", "spark", "sql", "data engineering", "etl", "aws", "kafka", "big data"],
    postedAt: "2026-08-11",
  },
  {
    id: "frontend-eu-remote",
    company: "Miro",
    role: "Senior Software Engineer Frontend",
    location: "Remoto (EU)",
    remote: true,
    market: "europa",
    seniority: "senior",
    salaryMin: 75000,
    salaryMax: 105000,
    companySize: COMPANY_SIZE["Scaleup"],
    description:
      "La lavagna collaborativa. Cerchiamo un Senior Frontend Engineer con React, TypeScript e competenze su editor/real-time collaboration per un prodotto usato da 70+ milioni di utenti.",
    requiredSkills: ["React", "TypeScript", "Web Performance", "Testing", "Real-time", "Design Systems"],
    keywords: ["react", "typescript", "frontend", "performance", "real-time", "collaboration", "testing"],
    postedAt: "2026-08-15",
  },
  {
    id: "ml-engineer-amsterdam",
    company: "Booking.com",
    role: "Machine Learning Engineer",
    location: "Amsterdam",
    remote: false,
    market: "europa",
    seniority: "senior",
    salaryMin: 85000,
    salaryMax: 120000,
    companySize: COMPANY_SIZE["Big Tech"],
    description:
      "Ricerca, ranking e personalizzazione su scala globale. Cerchiamo un ML Engineer con esperienza di modelli in produzione, feature engineering e pipeline ML su larga scala.",
    requiredSkills: ["Python", "Machine Learning", "Feature Engineering", "MLOps", "Spark", "Cloud"],
    keywords: ["python", "machine learning", "mlops", "ranking", "recommendation", "spark", "cloud"],
    postedAt: "2026-08-09",
  },
  {
    id: "product-designer-london",
    company: "Revolut",
    role: "Product Designer",
    location: "Londra (ibrido)",
    remote: true,
    market: "europa",
    seniority: "mid",
    salaryMin: 60000,
    salaryMax: 85000,
    companySize: COMPANY_SIZE["Scaleup"],
    description:
      "App finanziaria globale. Cerchiamo un Product Designer con Figma, design system e test utente per esperienze mobile in un team cross-functional che ship ogni settimana.",
    requiredSkills: ["Figma", "UX Research", "Prototyping", "Design Systems", "Mobile", "Usability Testing"],
    keywords: ["figma", "product design", "ux", "mobile", "design system", "prototyping"],
    postedAt: "2026-08-12",
  },
  {
    id: "growth-marketing-paris",
    company: "Deezer",
    role: "Growth Marketing Manager",
    location: "Parigi (ibrido)",
    remote: true,
    market: "europa",
    seniority: "mid",
    salaryMin: 45000,
    salaryMax: 62000,
    companySize: COMPANY_SIZE["Scaleup"],
    description:
      "Streaming musicale europeo. Cerchiamo un Growth Marketing Manager con esperienza in paid acquisition, A/B testing e CRM per aumentare attivazione e retention degli abbonati.",
    requiredSkills: ["Growth", "Paid Ads", "A/B Testing", "CRM", "Analytics", "Email Marketing"],
    keywords: ["growth", "paid acquisition", "a/b testing", "crm", "analytics", "retention", "marketing"],
    postedAt: "2026-08-14",
  },
  {
    id: "ios-engineer-remote-eu",
    company: "Spotify",
    role: "Senior iOS Engineer",
    location: "Remoto (EU)",
    remote: true,
    market: "europa",
    seniority: "senior",
    salaryMin: 90000,
    salaryMax: 125000,
    companySize: COMPANY_SIZE["Big Tech"],
    description:
      "Il più grande servizio di streaming audio al mondo. Cerchiamo un Senior iOS Engineer con Swift e SwiftUI per team che costruiscono funzionalità usate da centinaia di milioni di utenti.",
    requiredSkills: ["Swift", "SwiftUI", "iOS", "Testing", "Performance", "CI/CD"],
    keywords: ["swift", "swiftui", "ios", "mobile", "performance", "testing", "ci/cd"],
    postedAt: "2026-08-10",
  },
  {
    id: "technical-account-manager-barcelona",
    company: "Typeform",
    role: "Technical Account Manager",
    location: "Barcellona",
    remote: false,
    market: "europa",
    seniority: "mid",
    salaryMin: 50000,
    salaryMax: 68000,
    companySize: COMPANY_SIZE["Scaleup"],
    description:
      "Piattaforma di form e sondaggi. Cerchiamo un Technical Account Manager con background tecnico (API, integration) e gestione clienti enterprise B2B SaaS per guidare onboarding e retention.",
    requiredSkills: ["Account Management", "API", "B2B SaaS", "Customer Success", "Technical", "Negotiation"],
    keywords: ["account management", "customer success", "b2b", "api", "technical", "retention"],
    postedAt: "2026-08-13",
  },
  {
    id: "frontend-react-usa-remote",
    company: "Shopify",
    role: "Frontend Developer",
    location: "Remoto (USA/Canada)",
    remote: true,
    market: "usa",
    seniority: "mid",
    salaryMin: 110000,
    salaryMax: 150000,
    companySize: COMPANY_SIZE["Big Tech"],
    description:
      "La piattaforma di e-commerce. Cerchiamo un Frontend Developer con React, TypeScript e attenzione alla performance per costruire esperienze di checkout veloci e accessibili.",
    requiredSkills: ["React", "TypeScript", "JavaScript", "Performance", "Accessibility", "Testing"],
    keywords: ["react", "typescript", "frontend", "e-commerce", "performance", "accessibility", "testing"],
    postedAt: "2026-08-15",
  },
  {
    id: "backend-usa-remote",
    company: "Stripe",
    role: "Software Engineer Backend",
    location: "Remoto (USA)",
    remote: true,
    market: "usa",
    seniority: "senior",
    salaryMin: 150000,
    salaryMax: 210000,
    companySize: COMPANY_SIZE["Big Tech"],
    description:
      "Infrastruttura di pagamenti per internet. Cerchiamo un Software Engineer con esperienza su sistemi distribuiti, affidabilità e linguaggi come Ruby o Go. Background in payments preferred.",
    requiredSkills: ["Distributed Systems", "Go", "Ruby", "SQL", "Reliability", "Cloud"],
    keywords: ["backend", "distributed systems", "payments", "go", "ruby", "sql", "reliability", "cloud"],
    postedAt: "2026-08-11",
  },
  {
    id: "data-analyst-nyc",
    company: "Bloomberg",
    role: "Data Analyst",
    location: "New York",
    remote: false,
    market: "usa",
    seniority: "junior",
    salaryMin: 80000,
    salaryMax: 105000,
    companySize: COMPANY_SIZE["Big Tech"],
    description:
      "Dati finanziari in tempo reale. Cerchiamo un Data Analyst con SQL, Python e dashboarding per trasformare dati complessi in insight per i clienti del terminale Bloomberg.",
    requiredSkills: ["SQL", "Python", "Data Visualization", "Excel", "Statistics", "Communication"],
    keywords: ["sql", "python", "data analysis", "visualization", "finance", "excel", "statistics"],
    postedAt: "2026-08-08",
  },
  {
    id: "ml-engineer-usa-remote",
    company: "Databricks",
    role: "Machine Learning Engineer",
    location: "Remoto (USA)",
    remote: true,
    market: "usa",
    seniority: "senior",
    salaryMin: 140000,
    salaryMax: 190000,
    companySize: COMPANY_SIZE["Big Tech"],
    description:
      "Data lakehouse e ML platform. Cerchiamo un ML Engineer con esperienza su Spark, MLOps e deployment di modelli per costruire prodotti ML di livello enterprise.",
    requiredSkills: ["Python", "Spark", "MLOps", "Machine Learning", "Data Pipeline", "Cloud"],
    keywords: ["python", "spark", "machine learning", "mlops", "data pipelines", "cloud", "model serving"],
    postedAt: "2026-08-12",
  },
  {
    id: "ux-designer-usa-remote",
    company: "Figma",
    role: "Product Designer",
    location: "Remoto (USA)",
    remote: true,
    market: "usa",
    seniority: "mid",
    salaryMin: 120000,
    salaryMax: 165000,
    companySize: COMPANY_SIZE["Big Tech"],
    description:
      "La piattaforma di design collaborativo. Cerchiamo un Product Designer con esperienza su design system, Figma e ricerca utente per migliorare il core experience della piattaforma.",
    requiredSkills: ["Figma", "Design Systems", "UX Research", "Prototyping", "Usability Testing", "Communication"],
    keywords: ["figma", "product design", "design system", "ux", "prototyping", "research"],
    postedAt: "2026-08-14",
  },
  {
    id: "growth-hacker-usa",
    company: "HubSpot",
    role: "Growth Marketing Manager",
    location: "Remoto (USA)",
    remote: true,
    market: "usa",
    seniority: "mid",
    salaryMin: 95000,
    salaryMax: 130000,
    companySize: COMPANY_SIZE["Big Tech"],
    description:
      "Piattaforma di marketing e CRM. Cerchiamo un Growth Marketing Manager con esperienza in paid channels, CRO e marketing automation per acquisizione e upsell.",
    requiredSkills: ["Growth", "Paid Ads", "CRO", "Marketing Automation", "Analytics", "CRM"],
    keywords: ["growth", "paid marketing", "cro", "marketing automation", "analytics", "crm", "seo"],
    postedAt: "2026-08-10",
  },
  {
    id: "fullstack-saas-milan",
    company: "Mia-Platform",
    role: "Full Stack Developer SaaS",
    location: "Milano (ibrido)",
    remote: true,
    market: "italia",
    seniority: "mid",
    salaryMin: 45000,
    salaryMax: 62000,
    companySize: COMPANY_SIZE["Startup"],
    description:
      "Piattaforma per lo sviluppo di prodotti digitali. Cerchiamo un Full Stack Developer con React, Node.js e Kubernetes per costruire feature end-to-end della piattaforma.",
    requiredSkills: ["React", "Node.js", "TypeScript", "Kubernetes", "PostgreSQL", "Testing"],
    keywords: ["react", "node.js", "typescript", "full stack", "kubernetes", "postgresql", "ci/cd"],
    postedAt: "2026-08-09",
  },
  {
    id: "backend-java-rome",
    company: "Enel X",
    role: "Backend Engineer Java",
    location: "Roma",
    remote: false,
    market: "italia",
    seniority: "senior",
    salaryMin: 48000,
    salaryMax: 65000,
    companySize: COMPANY_SIZE["Big Tech"],
    description:
      "Servizi energetici digitali. Cerchiamo un Backend Engineer Java con esperienza su Spring Boot, microservizi e cloud per sistemi di gestione energetica su scala enterprise.",
    requiredSkills: ["Java", "Spring Boot", "Microservices", "SQL", "Kubernetes", "Cloud"],
    keywords: ["java", "spring boot", "backend", "microservices", "sql", "kubernetes", "cloud"],
    postedAt: "2026-08-06",
  },
  {
    id: "sales-bdr-milan",
    company: "Celonis",
    role: "Business Development Representative",
    location: "Milano (ibrido)",
    remote: true,
    market: "italia",
    seniority: "junior",
    salaryMin: 30000,
    salaryMax: 42000,
    companySize: COMPANY_SIZE["Scaleup"],
    description:
      "Process mining enterprise. Cerchiamo un BDR con ottima comunicazione e attitudine commerciale per generare lead qualificati e avviare pipeline con clienti enterprise.",
    requiredSkills: ["Sales", "Lead Generation", "CRM", "Communication", "B2B", "Outbound"],
    keywords: ["sales", "bdr", "lead generation", "outbound", "crm", "b2b", "communication"],
    postedAt: "2026-08-13",
  },
  {
    id: "qa-engineer-milan",
    company: "Bending Spoons",
    role: "QA Automation Engineer",
    location: "Milano",
    remote: false,
    market: "italia",
    seniority: "mid",
    salaryMin: 40000,
    salaryMax: 55000,
    companySize: COMPANY_SIZE["Scaleup"],
    description:
      "Cerchiamo un QA Automation Engineer con esperienza su test automatici end-to-end, CI/CD e strumenti come Playwright o Cypress per garantire la qualità di app usate da milioni di utenti.",
    requiredSkills: ["Testing", "Playwright", "Cypress", "CI/CD", "JavaScript", "API Testing"],
    keywords: ["qa", "automation", "playwright", "cypress", "testing", "ci/cd", "quality"],
    postedAt: "2026-08-07",
  },
  {
    id: "data-analyst-milan",
    company: "Nexi",
    role: "Data Analyst",
    location: "Milano (ibrido)",
    remote: true,
    market: "italia",
    seniority: "mid",
    salaryMin: 35000,
    salaryMax: 48000,
    companySize: COMPANY_SIZE["Digital"],
    description:
      "Payments leader europeo. Cerchiamo un Data Analyst con SQL, Python e dashboarding (PowerBI o Tableau) per analizzare i dati delle transazioni e supportare le decisioni di business.",
    requiredSkills: ["SQL", "Python", "Data Visualization", "Excel", "PowerBI", "Statistics"],
    keywords: ["sql", "python", "data analysis", "dashboarding", "powerbi", "payments", "statistics"],
    postedAt: "2026-08-12",
  },
  {
    id: "product-manager-italia",
    company: "Sistemi Informativi",
    role: "Technical Product Manager",
    location: "Milano",
    remote: false,
    market: "italia",
    seniority: "senior",
    salaryMin: 60000,
    salaryMax: 80000,
    companySize: COMPANY_SIZE["Mid-size"],
    description:
      "Cerchiamo un Technical Product Manager con background tecnico per guidare lo sviluppo di una piattaforma B2B: roadmap, discovery con clienti e coordinamento del team engineering.",
    requiredSkills: ["Product Management", "Roadmap", "Agile", "Technical", "Stakeholder Management", "Analytics"],
    keywords: ["product manager", "roadmap", "agile", "technical", "b2b", "stakeholder", "analytics"],
    postedAt: "2026-08-08",
  },
  {
    id: "backend-ruby-usa",
    company: "GitHub",
    role: "Backend Engineer (Ruby)",
    location: "Remoto (USA)",
    remote: true,
    market: "usa",
    seniority: "mid",
    salaryMin: 130000,
    salaryMax: 175000,
    companySize: COMPANY_SIZE["Big Tech"],
    description:
      "La piattaforma di sviluppo più grande al mondo. Cerchiamo un Backend Engineer con Ruby on Rails, SQL e esperienza su sistemi distribuiti per costruire funzionalità di collaborazione.",
    requiredSkills: ["Ruby", "Rails", "SQL", "Distributed Systems", "Testing", "Git"],
    keywords: ["ruby", "rails", "backend", "distributed systems", "sql", "testing", "developer tools"],
    postedAt: "2026-08-12",
  },
  {
    id: "frontend-junior-milan",
    company: "Scalapay",
    role: "Junior Frontend Developer",
    location: "Milano (ibrido)",
    remote: true,
    market: "italia",
    seniority: "junior",
    salaryMin: 30000,
    salaryMax: 38000,
    companySize: COMPANY_SIZE["Startup"],
    description:
      "Fintech BNPL. Cerchiamo un Junior Frontend Developer con React e JavaScript, voglia di imparare e attenzione al dettaglio per sviluppare widget di pagamento integrati.",
    requiredSkills: ["React", "JavaScript", "HTML", "CSS", "Git", "Testing basics"],
    keywords: ["react", "javascript", "frontend", "junior", "html", "css", "fintech"],
    postedAt: "2026-08-14",
  },
  {
    id: "scrum-master-milan",
    company: "Engineering Group",
    role: "Scrum Master / Agile Coach",
    location: "Milano (ibrido)",
    remote: true,
    market: "italia",
    seniority: "mid",
    salaryMin: 40000,
    salaryMax: 55000,
    companySize: COMPANY_SIZE["Consulenza"],
    description:
      "Cerchiamo uno Scrum Master con certificazioni Agile e esperienza nella facilitazione di team cross-functional, coaching e miglioramento continuo su progetti enterprise.",
    requiredSkills: ["Agile", "Scrum", "Coaching", "Facilitation", "Stakeholder Management", "Jira"],
    keywords: ["scrum", "agile", "scrum master", "coaching", "jira", "facilitation", "kanban"],
    postedAt: "2026-08-05",
  },
];

export function getJobById(id: string): Job | undefined {
  return jobCatalog.find((job) => job.id === id);
}

function seniorityWeight(profileYears: number, jobSeniority: Job["seniority"]): number {
  const seniorityYearRange: Record<Job["seniority"], [number, number]> = {
    junior: [0, 3],
    mid: [2, 6],
    senior: [5, 20],
  };
  const [min, max] = seniorityYearRange[jobSeniority];
  if (profileYears === 0) return jobSeniority === "junior" ? 1 : 0.5;
  if (profileYears >= min && profileYears <= max) return 1;
  if (profileYears < min) return 0.6;
  return 0.7;
}

function estimateYearsExperience(profileText: string): number {
  const lower = profileText.toLowerCase();
  const patterns = [
    /(\d{2})\+\s*(?:anni|years)/,
    /(\d{2})\s*(?:anni|years)/,
    /(\d)\+\s*(?:anni|years)/,
    /(\d)\s*(?:anni|years)/,
  ];
  for (const pattern of patterns) {
    const match = lower.match(pattern);
    if (match) {
      const value = parseInt(match[1], 10);
      return value < 40 ? value : 0;
    }
  }
  return 0;
}

export function scoreJobForProfile(job: Job, profileText: string): ScoredJob {
  const normalizedProfile = normalizeText(profileText).toLowerCase();
  const profileKeywords = new Set(extractKeywords(normalizedProfile, 60).map((k) => k.toLowerCase()));
  const profileRole = detectRole(normalizedProfile);
  const jobRole = detectRole(`${job.role} ${job.keywords.join(" ")}`);

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];
  for (const keyword of job.keywords) {
    if (normalizedProfile.includes(keyword.toLowerCase())) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  }

  const skillsCovered = job.requiredSkills.filter((skill) =>
    normalizedProfile.includes(skill.toLowerCase())
  );
  const skillsCoverage = skillsCovered.length / job.requiredSkills.length;

  const roleScore = profileRole === "general" ? 0.35 : profileRole === jobRole ? 1 : 0.55;

  const keywordScore = matchedKeywords.length / job.keywords.length;
  const years = estimateYearsExperience(normalizedProfile);
  const seniorityScore = seniorityWeight(years, job.seniority);

  const score = Math.round(
    100 * (0.4 * keywordScore + 0.3 * skillsCoverage + 0.2 * roleScore + 0.1 * seniorityScore)
  );

  const reasons: string[] = [];
  if (matchedKeywords.length >= 4) {
    reasons.push(`${matchedKeywords.length} keyword del profilo in match con l'offerta`);
  } else if (matchedKeywords.length > 0) {
    reasons.push(`Keyword in comune: ${matchedKeywords.slice(0, 4).join(", ")}`);
  }
  if (skillsCoverage >= 0.7) {
    reasons.push(`Copertura forte delle skill richieste (${Math.round(skillsCoverage * 100)}%)`);
  }
  if (profileRole === jobRole) {
    reasons.push("Ruolo allineato al tuo profilo");
  }
  if (seniorityScore === 1) {
    reasons.push("Seniority coerente con la posizione");
  }
  if (reasons.length === 0) {
    reasons.push("Fit in linea con il tuo profilo: pochi punti di contatto diretti, ma offra uno spazio di crescita");
  }
  if (matchedKeywords.length === 0 && missingKeywords.length > 0) {
    reasons.push(`Integra nel CV keyword chiave come ${missingKeywords.slice(0, 3).join(", ")}`);
  }

  const highlight: ScoredJob["highlight"] = score >= 70 ? "alta" : score >= 45 ? "buona" : "media";

  return {
    ...job,
    score,
    matchedKeywords,
    missingKeywords,
    reasons,
    highlight,
  };
}

export function buildDailyDigest(
  profileText: string,
  options: { limit?: number; market?: string } = {}
): ScoredJob[] {
  const { limit = 8, market } = options;
  const pool = market ? jobCatalog.filter((job) => job.market === market) : jobCatalog;
  return pool
    .map((job) => scoreJobForProfile(job, profileText))
    .sort((a, b) => b.score - a.score || b.salaryMax - a.salaryMax)
    .slice(0, Math.max(5, Math.min(limit, 10)));
}

export function formatSalary(min: number, max: number): string {
  return `${formatEuro(min)} – ${formatEuro(max)}`;
}

export function formatEuro(value: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}