export type FAQCategory = "product" | "pricing" | "ai" | "jobs";

export interface FAQItem {
  q: string;
  a: string;
  category: FAQCategory;
}

/**
 * FAQ content in Italian (default language). Single source of truth:
 * used for the visible FAQ accordion (client) and the server-rendered
 * FAQPage JSON-LD (AEO/answer engines).
 */
export const faqIt: FAQItem[] = [
  {
    q: "Come funziona l'analisi del CV, in pratica?",
    a: "Carichi il CV in PDF o DOCX e incolli la job description: l'AI restituisce uno score da 0 a 100 su 5 dimensioni (leggibilità ATS, qualità contenuti, scrittura, match con l'offerta, prontezza candidatura), le keyword trovate e mancanti, i bullet riscritti in formato Azione + Strumento + Risultato, più cover letter ed email di candidatura.",
    category: "product",
  },
  {
    q: "Cosa significa uno score ATS di 87/100?",
    a: "Sopra 80 il CV supera quasi tutti i filtri automatici; tra 60 e 80 è buon punto di partenza ma va ottimizzato su keyword e metriche; sotto 60 rischi lo scarto automatico. Ogni score è accompagnato da cosa sistemare e in quale sezione.",
    category: "product",
  },
  {
    q: "I template sono davvero sicuri per gli ATS?",
    a: "Sì: i 16 template usano layout a colonna singola, font standard e sezioni etichettate che i parser leggono senza errori. Puoi esportare in PDF, DOC o TXT e verificare lo score prima dell'invio.",
    category: "product",
  },
  {
    q: "Come funzionano i crediti AI?",
    a: "Ogni funzione AI (analisi, generazione CV, riscrittura bullet, summary, simulazione colloqui, cover letter) consuma 1 credito. Il piano Free include 3 crediti di prova; Starter ne dà 50 al mese, Pro 500, Enterprise 2000. Esiste anche la ricarica una tantum da 10 crediti.",
    category: "pricing",
  },
  {
    q: "Cosa succede se finisco i crediti?",
    a: "Le funzioni AI si mettono in pausa e vedi un'analisi di base gratuita. I crediti degli abbonamenti si rinnovano a ogni ciclo di fatturazione; in alternativa puoi ricaricare o passare a un piano superiore in qualsiasi momento.",
    category: "pricing",
  },
  {
    q: "Posso cancellare l'abbonamento? E i rimborsi?",
    a: "Sì, quando vuoi dal portale Stripe: la disdetta vale dal ciclo successivo, senza penali. Per i consumatori si applicano le tutele del Codice del Consumo, con le eccezioni per i contenuti digitali già fruiti.",
    category: "pricing",
  },
  {
    q: "I dati del mio CV dove vanno a finire?",
    a: "I tuoi dati sono salvati su database europeo (Supabase) e il testo inviato all'AI serve solo a produrre il risultato richiesto: non viene venduto né usato per addestrare modelli pubblici. Puoi chiedere accesso o cancellazione completa scrivendo a gabriele.forestieri0912@gmail.com.",
    category: "ai",
  },
  {
    q: "L'AI inventa esperienze false nel CV?",
    a: "No: analisi, punteggi e riscritture sono ancorati ai contenuti reali del tuo CV e citano aziende, ruoli e skill effettivi. Se generi un CV da zero, verifica sempre nomi, date e risultati prima dell'invio: l'AI propone, tu approvi.",
    category: "ai",
  },
  {
    q: "La cover letter è un testo generico?",
    a: "No: cita 2-3 risultati veri del tuo percorso e li collega ai requisiti dell'offerta, in massimo 200 parole con il tono del mercato scelto (Italia, Europa o USA). Ricevi anche una email di candidatura pronta da inviare.",
    category: "jobs",
  },
  {
    q: "Funziona anche per candidature all'estero?",
    a: "Sì: puoi impostare il mercato target (Italia, Europa o USA) e l'interfaccia è completamente in inglese. Tono, formato e benchmark salariali si adattano al paese dell'offerta.",
    category: "jobs",
  },
];

export const faqEn: FAQItem[] = [
  {
    q: "How does the CV analysis actually work?",
    a: "Upload your CV as PDF or DOCX and paste the job description: the AI returns a 0-100 score across 5 dimensions (ATS readability, content quality, writing, job match, application readiness), matched and missing keywords, bullets rewritten in Action + Tool + Result format, plus a cover letter and application email.",
    category: "product",
  },
  {
    q: "What does an ATS score of 87/100 mean?",
    a: "Above 80 your CV passes almost every automated filter; 60-80 is a solid starting point that needs keyword and metrics optimization; below 60 you risk automatic rejection. Every score comes with what to fix and in which section.",
    category: "product",
  },
  {
    q: "Are the templates really ATS-safe?",
    a: "Yes: all 16 templates use single-column layouts, standard fonts and labeled sections that parsers read without errors. You can export to PDF, DOC or TXT and check the score before sending.",
    category: "product",
  },
  {
    q: "How do AI credits work?",
    a: "Each AI feature (analysis, CV generation, bullet rewriting, summary, mock interviews, cover letter) costs 1 credit. The Free plan includes 3 trial credits; Starter gives 50 per month, Pro 500, Enterprise 2000. There is also a one-time 10-credit top-up.",
    category: "pricing",
  },
  {
    q: "What happens when I run out of credits?",
    a: "AI features pause and you still get a free basic analysis. Subscription credits renew every billing cycle; alternatively you can top up or upgrade at any time.",
    category: "pricing",
  },
  {
    q: "Can I cancel my subscription? What about refunds?",
    a: "Yes, anytime from the Stripe portal: cancellation applies from the next cycle, with no penalties. Consumer protections apply as required by law, with the exceptions for digital content already used.",
    category: "pricing",
  },
  {
    q: "Where does my CV data go?",
    a: "Your data is stored on a European database (Supabase) and text sent to the AI is used only to produce the requested result: it is never sold nor used to train public models. You can request access or full deletion at gabriele.forestieri0912@gmail.com.",
    category: "ai",
  },
  {
    q: "Does the AI invent fake experience?",
    a: "No: analyses, scores and rewrites are anchored to your real CV content and cite actual companies, roles and skills. If you generate a CV from scratch, always verify names, dates and results before sending: the AI proposes, you approve.",
    category: "ai",
  },
  {
    q: "Is the cover letter generic copy?",
    a: "No: it cites 2-3 real results from your background and ties them to the job requirements, in max 200 words with the tone of the chosen market (Italy, Europe or USA). You also get an application email ready to send.",
    category: "jobs",
  },
  {
    q: "Does it work for applications abroad?",
    a: "Yes: set your target market (Italy, Europe or USA) and switch the whole interface to English. Tone, format and salary benchmarks adapt to the posting's country.",
    category: "jobs",
  },
];
