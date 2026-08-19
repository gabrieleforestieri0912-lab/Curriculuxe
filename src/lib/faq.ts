export interface FAQItem {
  q: string;
  a: string;
}

/**
 * FAQ content in Italian (default language). Single source of truth:
 * used for the visible FAQ accordion (client) and the server-rendered
 * FAQPage JSON-LD (AEO/answer engines).
 */
export const faqIt: FAQItem[] = [
  {
    q: "Cos'è Curriculuxe?",
    a: "Curriculuxe è una piattaforma AI che crea, ottimizza e analizza curriculum professionali. Analizza la compatibilità ATS, riscrive i bullet point con metriche d'impatto e prepara alle domande di colloquio, in italiano e inglese.",
  },
  {
    q: "Come funziona l'analisi ATS del CV?",
    a: "Carichi il tuo CV in PDF o DOCX e l'AI lo confronta con la job description: ottieni uno score ATS, le keyword mancanti e suggerimenti mirati per superare i filtri automatici dei recruiter.",
  },
  {
    q: "Come genera il CV con l'AI?",
    a: "Incolla una job description o descrivi il tuo profilo una sola volta: l'AI costruisce un CV formattato con i template premium, adattato alle keyword dell'offerta e al tuo stile.",
  },
  {
    q: "Curriculuxe è gratuito?",
    a: "Sì, il piano gratuito include analisi base, score ATS e 5 crediti AI di prova. Per un uso intensivo ci sono i piani Starter (50 crediti al mese), Pro (500) ed Enterprise (2000), con rinnovo automatico.",
  },
  {
    q: "In quali lingue posso creare il curriculum?",
    a: "Curriculuxe supporta la creazione di curriculum in italiano e inglese, con interfaccia bilingue e traduzione completa del sito tramite selettore di lingua.",
  },
  {
    q: "Quali formati di esportazione sono supportati?",
    a: "Puoi esportare il tuo CV in PDF, DOCX e TXT, scegliendo tra 16 template professionali ottimizzati per i sistemi ATS.",
  },
];

export const faqEn: FAQItem[] = [
  {
    q: "What is Curriculuxe?",
    a: "Curriculuxe is an AI platform that creates, optimizes and analyzes professional CVs. It checks ATS compatibility, rewrites bullet points with impact metrics and prepares you for interview questions, in Italian and English.",
  },
  {
    q: "How does the ATS CV analysis work?",
    a: "Upload your CV as PDF or DOCX and the AI compares it with the job description: you get an ATS score, the missing keywords and targeted suggestions to pass the recruiters' automated filters.",
  },
  {
    q: "How does the AI generate a CV?",
    a: "Paste a job description or describe your profile once: the AI builds a formatted CV using premium templates, tailored to the posting's keywords and your style.",
  },
  {
    q: "Is Curriculuxe free?",
    a: "Yes, the free plan includes basic analysis, ATS score and 5 trial AI credits. For heavier use there are Starter (50 credits per month), Pro (500) and Enterprise (2000) plans with automatic renewal.",
  },
  {
    q: "Which languages can I create a CV in?",
    a: "Curriculuxe supports creating CVs in Italian and English, with a bilingual interface and full site translation through the language switcher.",
  },
  {
    q: "Which export formats are supported?",
    a: "You can export your CV as PDF, DOCX and TXT, choosing from 16 professional templates optimized for ATS systems.",
  },
];
