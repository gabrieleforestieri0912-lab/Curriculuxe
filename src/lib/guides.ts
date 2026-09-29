export interface GuideSection {
  heading: string;
  paragraphs: string[];
}

export interface Guide {
  slug: string;
  title: string;
  excerpt: string;
  readMin: number;
  intro: string;
  sections: GuideSection[];
  checklist: string[];
  templateTitle: string;
  templateText: string;
}

export const guides: Guide[] = [
  {
    slug: "cv-ats-2026",
    title: "CV ATS nel 2026: checklist completa",
    excerpt: "Le 5 verifiche che fanno passare il tuo CV dai filtri ATS.",
    readMin: 6,
    intro:
      "Oltre il 75% dei CV viene scartato da un software prima ancora di arrivare a un recruiter. Gli ATS (Applicant Tracking System) non giudicano il tuo valore: parsing, keyword, formato. Questa guida ti dà le 5 verifiche che contano davvero, nell'ordine in cui farle.",
    sections: [
      {
        heading: "1. Formato: una colonna, niente tabelle",
        paragraphs: [
          "I parser ATS leggono il CV riga per riga, da sinistra a destra. Tabelle, colonne multiple, intestazioni grafiche e icone mandano in confusione l'estrazione: le tue esperienze finiscono nel campo sbagliato o spariscono del tutto.",
          "Usa un layout a colonna singola con sezioni etichettate in modo standard (Esperienza, Formazione, Competenze, Contatti). I 16 template di Curriculuxe sono già costruiti così: scegli un template ATS-safe e non pensarci più.",
        ],
      },
      {
        heading: "2. Keyword: specchio dell'offerta, non lista della spesa",
        paragraphs: [
          "L'ATS confronta le keyword della job description con quelle del tuo CV. Non serve riempirlo di termini a caso: servono le 8-12 keyword core dell'offerta, inserite in contesto (esperienze e summary), con la stessa dizione dell'annuncio.",
          "Incolla l'offerta in Curriculuxe e guarda le keyword mancanti: integrale una per una nelle descrizioni, mai in un blocco artificiale in fondo al CV.",
        ],
      },
      {
        heading: "3. Metriche: ogni bullet deve avere un numero",
        paragraphs: [
          "I bullet senza numeri sono invisibili, per gli ATS e per i recruiter. Riscrivi ogni esperienza in formato Azione + Strumento + Risultato misurabile: percentuali, budget, utenti, dimensioni del team, tempi.",
          "Esempio: non “Mi occupavo del sito web”, ma “Ridisegnato il sito corporate in Next.js, +34% di conversioni su 80.000 visite mensili”. La riscrittura AI di Curriculuxe fa esattamente questo partendo dai tuoi bullet grezzi.",
        ],
      },
    ],
    checklist: [
      "Layout a colonna singola, sezioni standard, nessun elemento grafico essenziale",
      "Contatti completi e leggibili (email, telefono, città, LinkedIn)",
      "8-12 keyword dell'offerta inserite in contesto",
      "Ogni esperienza con almeno un risultato misurabile",
      "File PDF nativo (non scansione) sotto i 2 MB",
    ],
    templateTitle: "Template: bullet ATS-ready",
    templateText: "[Azione forte] + [strumento/metodo] + [risultato misurabile]\nEsempio: Automatizzato il reporting settimanale in Python e SQL, riducendo da 6 a 1 le ore manuali.",
  },
  {
    slug: "tailoring-jd",
    title: "Adattare il CV alla job description senza inventare",
    excerpt: "Come riscrivere i bullet con evidenze reali.",
    readMin: 5,
    intro:
      "Inviare lo stesso CV a 50 offerte non funziona: ogni ATS cerca keyword diverse. Adattare il CV (tailoring) non significa inventare esperienze, ma selezionare e riformulare quelle vere con il linguaggio dell'offerta. Ecco il metodo in 3 passi.",
    sections: [
      {
        heading: "1. Estrai le 10 keyword che contano",
        paragraphs: [
          "Leggi l'offerta ed evidenzia requisiti hard (tecnologie, tool, metodologie) e soft (leadership, stakeholder, mentoring). Le prime 10 per frequenza e posizione nell'annuncio sono quelle che l'ATS pesa di più.",
          "Confrontale col tuo CV: quelle che hai davvero ma con un altro nome (es. “gestione progetti” vs “project management”) vanno allineate alla dizione dell'offerta.",
        ],
      },
      {
        heading: "2. Riscrivi 3 bullet mirati, non tutto il CV",
        paragraphs: [
          "Non serve riscrivere tutto: bastano il summary e 2-3 esperienze chiave riformulate sulle priorità dell'offerta. Il resto del CV resta stabile, così mantieni coerenza tra candidature.",
          "Ogni bullet mirato deve restare verificabile in colloquio: se non puoi raccontare un aneddoto su quel risultato, non scriverlo.",
        ],
      },
      {
        heading: "3. Salva una versione per offerta",
        paragraphs: [
          "Crea una versione del CV per ogni offerta importante (azienda, ruolo, data) così sai sempre cosa hai inviato dove. Curriculuxe salva le versioni per offerta in automatico con keyword e score di match.",
          "Regola pratica: tailoring completo per le 10 offerte che vuoi davvero, CV standard ottimizzato per tutto il resto.",
        ],
      },
    ],
    checklist: [
      "10 keyword core dell'offerta identificate",
      "Summary riscritto con ruolo target e 2 skill chiave",
      "2-3 bullet riformulati con dizione dell'offerta",
      "Ogni bullet raccontabile in colloquio (metodo STAR)",
      "Versione salvata con nome azienda e data",
    ],
    templateTitle: "Template: summary mirato",
    templateText: "[Ruolo] con [N] anni in [settore]: [skill 1] e [skill 2] applicate su [contesto], con [risultato misurabile]. Cerco [tipo di ruolo/azienda].",
  },
  {
    slug: "cover-letter-italia",
    title: "Cover letter in Italia: struttura e errori comuni",
    excerpt: "Modello e tono per mercato italiano/europeo.",
    readMin: 4,
    intro:
      "In Italia la cover letter si legge ancora, soprattutto in aziende tradizionali e PMI. Deve stare sotto le 200 parole, citare fatti veri e avere il tono giusto: professionale e concreto, mai supplichevole né arrogante.",
    sections: [
      {
        heading: "1. Struttura in 4 blocchi",
        paragraphs: [
          "Apertura (2 righe): ruolo, dove hai visto l'offerta, una riga sul perché ti interessa quell'azienda specifica. Corpo (6-8 righe): 2 risultati reali collegati ai requisiti dell'offerta, con numeri. Chiusura (2 righe): disponibilità e proposta di colloquio. Firma con recapiti.",
          "Niente “mi chiamo X e vi scrivo per...”: parti dal valore che porti, non dalla tua biografia.",
        ],
      },
      {
        heading: "2. I 3 errori che affossano tutto",
        paragraphs: [
          "Primo: ripetere il CV parola per parola. La lettera deve aggiungere il “perché tu per quel ruolo”, non riassumere. Secondo: elogi generici all'azienda (“leader di settore innovativa”). Terzo: superare la pagina o allegare foto e dati sensibili non richiesti.",
          "In Europa vale lo stesso con una sfumatura: tono più internazionale e livelli lingua CEFR espliciti se richiesti.",
        ],
      },
      {
        heading: "3. Email di candidatura: oggetto + 5 righe",
        paragraphs: [
          "L'email che accompagna il CV decide se l'allegato viene aperto. Oggetto chiaro (Candidatura [Ruolo] – [Nome Cognome]), corpo di 5 righe: chi sei, perché quel ruolo, un risultato, allegati, disponibilità.",
          "Curriculuxe genera lettera ed email insieme, entrambe ancorate alle tue esperienze reali e al tono del mercato scelto.",
        ],
      },
    ],
    checklist: [
      "Sotto le 200 parole, una sola pagina",
      "2 risultati reali con numeri, collegati all'offerta",
      "Tono professionale e concreto, niente elogi generici",
      "Firma con nome, telefono ed email",
      "Email separata con oggetto chiaro e 5 righe di corpo",
    ],
    templateTitle: "Template: apertura cover letter",
    templateText: "Gentile team [Azienda],\nmi candido per [Ruolo]: in [N] anni in [settore] ho [risultato misurabile], competenza centrale per [requisito dell'offerta].",
  },
  {
    slug: "negoziazione-ral",
    title: "Negoziare la RAL: script e timing",
    excerpt: "Quando e come chiedere più del primo numero.",
    readMin: 7,
    intro:
      "Il primo numero sul tavolo non è mai l'ultimo: quasi tutte le offerte hanno margine. Negoziare bene vale spesso più di un aumento annuale. Conta il timing, il benchmark e il tono: assertivo, mai aggressivo.",
    sections: [
      {
        heading: "1. Timing: mai prima dell'offerta scritta",
        paragraphs: [
          "Non dare numeri per primo se puoi evitarlo: lascia parlare l'azienda e chiedi sempre il range previsto per il ruolo. Tratta solo dopo l'offerta scritta, quando l'azienda ha già deciso che vuole te.",
          "Prepara prima i benchmark (Glassdoor, LinkedIn Salary, Levels.fyi) per ruolo, seniority e città: senza numeri di mercato, negozi al buio.",
        ],
      },
      {
        heading: "2. Script email: gratitudine, dati, apertura",
        paragraphs: [
          "Struttura che funziona: ringrazia e mostra entusiasmo, cita 2-3 risultati tuoi rilevanti, propone un range basato sui benchmark (non una cifra secca), aggiungi 1-2 leve oltre la RAL (bonus, smart working, budget formazione), chiudi con apertura al dialogo.",
          "Esempio di range: se offrono 38k e il mercato dice 42-48k per il tuo profilo, chiedi 44-48k motivandolo con dati, non con bisogni personali.",
        ],
      },
      {
        heading: "3. Leve oltre la RAL e chiusura",
        paragraphs: [
          "Se sulla RAL non si muovono, sposta la trattativa sul pacchetto: bonus annuale, welfare, giorni di smart working, budget formazione e certificazioni, revisione salariale anticipata a 6 mesi messa per iscritto.",
          "Qualunque accordo va confermato per email prima di firmare: la traccia scritta evita fraintendimenti su cifre e benefit.",
        ],
      },
    ],
    checklist: [
      "Benchmark di mercato per ruolo, seniority e città",
      "2-3 risultati personali pronti da citare",
      "Range proposto (mai cifra secca), motivato con dati",
      "1-2 leve extra oltre la RAL",
      "Accordo finale confermato per iscritto",
    ],
    templateTitle: "Template: frase di apertura",
    templateText: "Grazie per l'offerta, sono molto motivato dal ruolo. Dai benchmark di mercato (Glassdoor, Levels.fyi) per [ruolo] a [città], un range equo per il mio profilo è [X-Y]k: possiamo ragionare su queste cifre?",
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
