export interface LoopStep {
  key: string;
  title: string;
  body: string;
}

export interface AboutContent {
  title: string;
  lead: string;
  missionTitle: string;
  missionBody: string[];
  loopTitle: string;
  loopIntro: string;
  loop: LoopStep[];
  principlesTitle: string;
  principles: { title: string; body: string }[];
  privacyTitle: string;
  privacyBody: string[];
  marketTitle: string;
  marketBody: string[];
  marketChecks: string[];
  contactTitle: string;
  contactBody: string;
}

export const about: Record<"it" | "en", AboutContent> = {
  it: {
    title: "Chi siamo",
    lead:
      "Curriculuxe e' un job search copilot per l'Italia e l'Europa: prepara la candidatura, la mostra insieme alle prove e ti lascia la decisione.",
    missionTitle: "Perche' esiste",
    missionBody: [
      "Candidarsi online e' diventato un lavoro da uomo. Ogni ruolo riceve centinaia di candidature, la maggior parte delle quali arriva identica. Chi legge ha trenta secondi per capire chi sei e cosa hai fatto.",
      "I generatori di CV con intelligenza artificiale hanno risolto il problema sbagliato: rendono veloce produrre un documento, non renderlo convincente. Il risultato e' un mare di CV plausibili e intercambiabili.",
      "Curriculuxe lavora sull'altra parte: mantenere l'evidenza. Ogni modifica al CV e' accompagnata dal frammento che la giustifica, ogni penalita' di score mostra il testo che l'ha generata, e il tailoring non scrive mai sull'originale senza approvazione.",
    ],
    loopTitle: "Il Loop",
    loopIntro:
      "Cinque passaggi, sempre nello stesso ordine. Ogni passaggio produce un risultato che vedi prima di andare al successivo.",
    loop: [
      {
        key: "discover",
        title: "Discover",
        body:
          "Parti dalle offerte verificate del Career Market e da quelle che gia' hai visto. Nessun curriculum da generare a caso: si sceglie dove candidarsi.",
      },
      {
        key: "assess",
        title: "Scoring CV",
        body:
          "Carichi il CV e ottieni uno score da 0 a 100 su cinque dimensioni, con la prova di ogni penalita'. Se un punto e' stato tolto, vedi il testo che lo ha causato.",
      },
      {
        key: "tailor",
        title: "Tailoring",
        body:
          "Adatti il CV a quell'offerta mostrando un diff prima/dopo. Ogni modifica porta la keyword dell'offerta che la giustifica, e l'originale resta intatto.",
      },
      {
        key: "cover",
        title: "Cover letter",
        body:
          "Ogni frase generata deriva da un frammento del tuo CV. Se mancano fatti, la lettera lo dice invece di riempirsi di risultati inventati.",
      },
      {
        key: "prepare",
        title: "Prep e negoziazione",
        body:
          "Simuli il colloquio con domande ancorate ai tuoi bullet e provi la trattativa su una fascia reale. Il simulatore non invia niente al posto tuo: prepara, poi decidi tu.",
      },
    ],
    principlesTitle: "I principi",
    principles: [
      {
        title: "Niente invio massivo di candidature",
        body:
          "Non esiste una funzione che manda il tuo CV a centinaia di aziende. Il mass apply e' il modo piu' rapido per farsi ignorare da tutti: prepariamo, decidi tu.",
      },
      {
        title: "Niente esperienze inventate",
        body:
          "Analisi, punteggi e riscritture sono ancorati ai contenuti reali del tuo CV e citano aziende, ruoli e skill effettivi. L'AI propone, tu approvi.",
      },
      {
        title: "Human-in-the-loop sempre",
        body:
          "Nessuna scrittura avviene senza la tua approvazione. Il diff e' mostrato prima, l'originale e' recuperabile dopo.",
      },
      {
        title: "Evidenze al posto delle promesse",
        body:
          "I dati che mostriamo sono ispezionabili: ogni annuncio del Career Market si apre e mostra fonte e data, ogni fascia salariale mostra da quanti annunci deriva.",
      },
    ],
    privacyTitle: "Come trattiamo i dati del tuo CV",
    privacyBody: [
      "Il CV che carichi e' salvato su un database europeo. Il testo inviato al modello serve solo a produrre il risultato richiesto in quel momento: non viene venduto e non viene usato per addestrare modelli pubblici.",
      "Gli analisi del Career Market sono pubblici e non contengono dati personali. Le pagine che richiedono un account, come la dashboard, sono dietro login.",
      "Puoi chiedere accesso ai tuoi dati o la cancellazione completa in qualsiasi momento scrivendo dalla pagina contatti.",
    ],
    marketTitle: "Come verifichiamo gli annunci",
    marketBody: [
      "Gli annunci del Career Market non sono raccolti da un aggregatore e riscritti: vengono raccolti da fonti pubbliche e deduplicati su azienda, titolo e localita'.",
      "Ogni annuncio conserva fonte e data dell'ultimo controllo, ed e' apribile da chiunque per leggerlo per intero.",
    ],
    marketChecks: [
      "Ogni annuncio mostra la fonte da cui proviene e la data dell'ultimo controllo",
      "Le duplicazioni su azienda, titolo e localita' vengono rimosse all'inserimento",
      "Gli annunci scaduti sono rimossi invece che lasciati a creare aspettative false",
      "Nessun posizionamento a pagamento: il posizionamento nell'elenco non si compra",
    ],
    contactTitle: "Parliamo",
    contactBody:
      "Domande, segnalazioni o richieste di cancellazione dei dati: scrivici dalla pagina contatti. Rispondiamo in italiano e in inglese.",
  },
  en: {
    title: "About us",
    lead:
      "Curriculuxe is a job-search copilot for Italy and Europe: it prepares the application, shows it together with the evidence, and leaves the decision to you.",
    missionTitle: "Why it exists",
    missionBody: [
      "Applying online has become a job in itself. Every role receives hundreds of applications, most of them identical. The person reading has thirty seconds to work out who you are and what you have done.",
      "AI resume generators solved the wrong problem: they make producing a document fast, not convincing. The result is a sea of plausible, interchangeable resumes.",
      "Curriculuxe works on the other side: keeping the evidence. Every change is attached to the snippet that justifies it, every score penalty shows the text that caused it, and tailoring never writes to the original without approval.",
    ],
    loopTitle: "The loop",
    loopIntro:
      "Five steps, always in the same order. Each step produces a result you see before moving to the next one.",
    loop: [
      {
        key: "discover",
        title: "Discover",
        body:
          "Start from the verified postings in the Career Market and the ones you already saw. No random resume: you decide where to apply.",
      },
      {
        key: "assess",
        title: "Resume scoring",
        body:
          "Upload your resume and get a 0-100 score across five dimensions, with the proof behind every penalty.",
      },
      {
        key: "tailor",
        title: "Tailoring",
        body:
          "Adapt the resume to that posting with a before/after diff. Every change carries the posting keyword that justifies it, and the original stays untouched.",
      },
      {
        key: "cover",
        title: "Cover letter",
        body:
          "Every generated sentence derives from a snippet of your resume. If facts are missing, the letter says so instead of inventing results.",
      },
      {
        key: "prepare",
        title: "Prep and negotiation",
        body:
          "Practise the interview with questions anchored to your bullets, and rehearse negotiation on a real band. The simulator never sends anything on your behalf.",
      },
    ],
    principlesTitle: "Principles",
    principles: [
      {
        title: "No mass applying",
        body:
          "There is no button that sends your resume to hundreds of companies. We prepare; you decide.",
      },
      {
        title: "No invented experience",
        body:
          "Analyses, scores and rewrites are anchored to the real content of your resume. The AI proposes, you approve.",
      },
      {
        title: "Human in the loop, always",
        body:
          "Nothing is written without your approval. The diff is shown first, the original stays recoverable.",
      },
      {
        title: "Evidence over promises",
        body:
          "Every Career Market posting opens and shows source and date; every salary band shows how many postings it comes from.",
      },
    ],
    privacyTitle: "How we handle your CV data",
    privacyBody: [
      "The CV you upload is stored on a European database. The text sent to the model is used only to produce the result you asked for: it is never sold and never used to train public models.",
      "Career Market analyses are public and contain no personal data. Pages that require an account, like the dashboard, sit behind login.",
      "You can request access to your data or full deletion at any time from the contact page.",
    ],
    marketTitle: "How we verify postings",
    marketBody: [
      "Career Market postings are not taken from an aggregator and rewritten: they are collected from public feeds and deduplicated on company, title and location.",
      "Every posting keeps its source and the date of the last check, and anyone can open it.",
    ],
    marketChecks: [
      "Every posting shows its source and the date of the last check",
      "Duplicates on company, title and location are removed on insertion",
      "Expired postings are removed instead of left to create false expectations",
      "No paid placement: position in the list cannot be bought",
    ],
    contactTitle: "Get in touch",
    contactBody:
      "Questions, reports or deletion requests: write from the contact page. We reply in English.",
  },
};