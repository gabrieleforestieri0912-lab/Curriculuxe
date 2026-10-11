import type { Project } from "./types";

/**
 * Catalogo progetti. Ogni voce e' un progetto realmente realizzabile da zero:
 * obiettivo, milestone, criteri di qualita' e il bullet da mettere nel CV.
 * Il numero di progetti mostrato in pagina viene calcolato da questa lista,
 * quindi non puo' divergere dai dati.
 */
export const projects: Project[] = [
  {
    slug: "ats-parser",
    title: "Parser di CV con score ATS",
    stack: ["Python", "FastAPI", "regex"],
    difficulty: "intermedio",
    hours: 14,
    roles: ["backend", "data"],
    goal:
      "Estrarre testo da PDF e DOCX, ricavare le sezioni del CV e calcolare uno score 0-100 sulle stesse cinque dimensioni che usa un ATS: leggibilita' del parsing, copertura keyword, meta' concrete, allineamento all'offerta e struttura.",
    previewMilestones: [
      "Estrazione testo da PDF e DOCX con fallback esplicito quando il PDF e' scansione",
      "Riconoscimento delle 7 sezioni standard per alias (Esperienza, Competenze, Istruzione...)",
      "Estrazione di email, telefono e link",
    ],
    fullMilestones: [
      "Normalizzazione del testo e rimozione dei caratteri di controllo che rompono il parsing",
      "Estrazione keyword per frequenza con disambiguazione per lunghezza",
      "Score per keyword match rispetto a una job description",
      "Suite di test con 10 CV reali e relative firme attese",
      "Endpoint REST con documentazione OpenAPI",
    ],
    architecture: [
      "Ingestione file -> normalizzazione -> sezioning -> estrazione campi -> scoring",
      "Regole di scoring isolate in funzioni pure, testabili senza I/O",
      "Contratto JSON stabile: l'anteriore modello puo' essere sostituito senza toccare il resto",
    ],
    commonMistakes: [
      "Usare regex troppo strette che falliscono sui CV con layout atipici",
      "Considerare successo dell'estrazione senza verificare l'ordine di lettura",
      "Restituire sempre 100: uno score che non discriminate non serve a nessuno",
    ],
    qualityCriteria: [
      "Estrazione corretta su almeno 9 CV su 10 del campione",
      "Score deterministico: stesso input, stesso output",
      "Test automatici che falliscono se il parsing regredisce",
    ],
    cvBullet:
      "Realizzato un parser di CV in Python/FastAPI che estrae le 7 sezioni da PDF e DOCX e calcola uno score ATS 0-100 su 10 CV di test, coprendo keyword, metriche e struttura.",
    skills: ["Python", "API REST", "NLP di base", "Testing", "Regex"],
    roadmapSlug: "backend-engineer",
    guideSlug: "cv-ats-2026",
    minPlan: "free",
  },
  {
    slug: "saas-billing",
    title: "Billing SaaS con abbonamenti",
    stack: ["Next.js", "Stripe", "PostgreSQL"],
    difficulty: "avanzato",
    hours: 24,
    roles: ["backend", "full stack"],
    goal:
      "Implementare il ciclo completo di un abbonamento: checkout, webhook, cambio di piano, disdetta e portale cliente, con idempotenza sugli eventi in arrivo.",
    previewMilestones: [
      "Checkout con piano mensile e annuale",
      "Webhook con verifica della firma e idempotenza sugli eventi duplicati",
    ],
    fullMilestones: [
      "Modello dati: utente, piano, abbonamento, evento elaborato",
      "Gestione di pagamento riuscito, fallito e carta scaduta",
      "Cambio di piano con pro-rata e downgrade differito a fine ciclo",
      "Disdetta e reattivazione",
      "Area cliente con storico fatture",
      "Test end-to-end del webhook con eventi duplicati e fuori ordine",
    ],
    architecture: [
      "Il webhook e' l'unica fonte di verita': la UI non aggiorna mai lo stato di pagamento da sola",
      "Idempotenza tramite chiave univoca sull'evento gia' elaborato",
      "Il cambio di piano non tocca mai la data di rinnovo, solo l'importo",
    ],
    commonMistakes: [
      "Aggiornare lo stato dalla pagina di successo invece che dal webhook",
      "Non gestire il downgrade differito, con il risultato di addebitare subito il piano inferiore",
      "Salvare le carte: non serve e crea un rischio di conformita' inutile",
    ],
    qualityCriteria: [
      "Nessun doppio addebito su eventi duplicati",
      "Ogni transizione di stato e' ricostruibile dal log eventi",
      "Il webhook risponde in meno di 500 ms e lavora in coda",
    ],
    cvBullet:
      "Sviluppato un ciclo di billing SaaS in Next.js e Stripe con webhook idempotenti, cambio di piano con pro-rata e disdetta, testato su eventi duplicati e fuori ordine.",
    skills: ["Next.js", "Stripe", "PostgreSQL", "Webhook", "Idempotenza"],
    roadmapSlug: "backend-engineer",
    minPlan: "starter",
  },
  {
    slug: "realtime-board",
    title: "Kanban realtime per la pipeline candidature",
    stack: ["Supabase Realtime", "React", "TypeScript"],
    difficulty: "intermedio",
    hours: 16,
    roles: ["frontend", "full stack"],
    goal:
      "Costruire un board a colonne con aggiornamento in tempo reale fra piu' schede aperte, senza polling e senza conflitti di posizione.",
    previewMilestones: [
      "Colonne con spostamento delle schede",
      "Aggiornamento istantaneo fra piu' browser aperti",
    ],
    fullMilestones: [
      "Schema con ordine posizionale per colonna",
      "Risoluzione dei conflitti quando due utenti spostano la stessa scheda",
      "Riconnessione automatica e stato di sincronizzazione visibile",
      "Ottimistica dell'interfaccia con rollback in caso di errore",
      "Test di riconnessione",
    ],
    architecture: [
      "L'update ottimistico parte subito, il canale realtime conferma o annulla",
      "L'ordine e' un indice frazionario, non un intero: spostare una scheda non riscrive la colonna",
      "Il client distingue sempre 'in attesa' da 'confermato'",
    ],
    commonMistakes: [
      "Usare interi per l'ordine e ritoccare tutti gli indici a ogni spostamento",
      "Non mostrare nulla quando la connessione cade: l'utente crede di aver perso i dati",
      "Aggiornare lo stato solo sul server e ignorare il riepilogo all'utente",
    ],
    qualityCriteria: [
      "Una scheda spostata appare nella posizione giusta in meno di 200 ms",
      "Riconnessione automatica dopo caduta di rete senza perdita",
      "Nessun doppio rendering dopo una riconnessione",
    ],
    cvBullet:
      "Realizzata una board kanban realtime in React e TypeScript con Supabase, aggiornamento ottimistico e rollback, ordine a indice frazionario e riconnessione automatica senza perdita di modifiche.",
    skills: ["React", "TypeScript", "Realtime", "Gestione stato"],
    roadmapSlug: "frontend-engineer",
    minPlan: "free",
  },
  {
    slug: "cover-letter-ai",
    title: "Generatore di cover letter ancorata ai fatti",
    stack: ["TypeScript", "API LLM", "Retrieval"],
    difficulty: "intermedio",
    hours: 12,
    roles: ["full stack", "backend"],
    goal:
      "Generare una cover letter a partire dal CV e dall'offerta, usando solo informazioni presenti nei documenti di input: nessun risultato, nessun ruolo e nessuna azienda deve essere inventato.",
    previewMilestones: [
      "Estrazione di azioni e metriche dal CV",
      "Selezione dei risultati piu' rilevanti per l'offerta",
    ],
    fullMilestones: [
      "Vincolo di output: ogni frase deve essere riferibile a un frammento del CV",
      "Selezione dei 2-3 risultati con il match piu' alto sull'offerta",
      "Personalizzazione del tono per mercato Italia, Europa e USA",
      "Contatore di lunghezza con tetto di 200 parole",
      "Test su 10 offerte con revisione umana",
    ],
    architecture: [
      "Estrazione dei fatti dal CV e selezione: due passi separati, mai un'unica chiamata libera",
      "Ogni affermazione generata porta con se' il frammento di CV da cui deriva",
      "Se non ci sono abbastanza fatti, il testo lo dice invece di riempirsi",
    ],
    commonMistakes: [
      "Chiedere al modello di scrivere 'ispirandoti' al CV: produce invenzioni",
      "Non distinguere il tono per mercato: una lettera americana scritta all'italiana fallisce",
      "Non mostrare all'utente da dove arriva ogni frase",
    ],
    qualityCriteria: [
      "Zero risultati o aziende non presenti nei documenti di input",
      "Ogni parola tecnica usata compare nell'offerta o nel CV",
      "Lunghezza entro il tetto dichiarato",
    ],
    cvBullet:
      "Progettato un generatore di cover letter che seleziona i risultati piu' rilevanti dal CV e ne deriva ogni frase da un frammento verificabile, con tono per mercato Italia, Europa e USA.",
    skills: ["TypeScript", "LLM", "Retrieval", "Prompt engineering"],
    roadmapSlug: "product-manager",
    guideSlug: "cover-letter-italia",
    minPlan: "starter",
  },
  {
    slug: "cv-tailoring-engine",
    title: "Motore di tailoring con preview",
    stack: ["TypeScript", "diff", "React"],
    difficulty: "avanzato",
    hours: 18,
    roles: ["full stack", "frontend"],
    goal:
      "Adattare un CV a un'offerta mostrando un diff prima/dopo e senza scrivere nulla sul documento originale finche' l'utente non approva.",
    previewMilestones: [
      "Diff parola per parola fra versione originale e versione adattata",
      "Nessuna scrittura sul CV originale: la nuova versione vive accanto",
    ],
    fullMilestones: [
      "Ogni modifica accompagnata dal motivo e dalla keyword dell'offerta che la giustifica",
      "Versione sempre recuperabile",
      "Blocco delle modifiche che aggiungerebbero esperienza non presente nel CV",
      "Esportazione in PDF, DOC e TXT",
    ],
    architecture: [
      "La versione originale e' immutabile: il tailoring produce una nuova versione",
      "Ogni modifica porta con se' la motivazione, altrimenti l'utente non puo' controllarla",
      "Il diff e' calcolato a parole, non a caratteri",
    ],
    commonMistakes: [
      "Applicare le modifiche in-place: senza approvazione si perdono dati",
      "Mostrare un diff senza spiegare perche' quella modifica serve all'offerta",
      "Permettere all'AI di aggiungere competenze che non sono nel CV",
    ],
    qualityCriteria: [
      "Nessuna modifica applicata senza approvazione esplicita",
      "Ogni modifica e' reversibile",
      "Il CV originale e' sempre recuperabile",
    ],
    cvBullet:
      "Costruito un motore di tailoring con diff parola per parola, ogni modifica accompagnata dalla keyword dell'offerta che la giustifica e versioni sempre recuperabili senza scrittura sull'originale.",
    skills: ["TypeScript", "Diff", "React", "Prodotto"],
    roadmapSlug: "frontend-engineer",
    guideSlug: "tailoring-jd",
    minPlan: "pro",
  },
  {
    slug: "jobs-scraper-dedup",
    title: "Raccolta annunci e deduplicazione",
    stack: ["Python", "httpx", "PostgreSQL"],
    difficulty: "intermedio",
    hours: 14,
    roles: ["backend", "data"],
    goal:
      "Raccogliere annunci da fonti pubbliche, deduplicarli su azienda, titolo e localita' e tracciare la data di controllo di ogni inserimento.",
    previewMilestones: [
      "Raccolta da feed pubblici con gestione di rate limit ed errori",
      "Deduplicazione su chiave azienda + titolo + localita'",
    ],
    fullMilestones: [
      "Chiave di deduplicazione normalizzata (lowercase, spazi, suffissi di sede)",
      "Rilevamento dei duplicati con differenze minime nel testo",
      "Data di ultimo controllo e stato dell'annuncio",
      "Esportazione del catalogo con fonte e data",
      "Retry con backoff esponenziale",
    ],
    architecture: [
      "Ogni annuncio conserva fonte e data: e' cio' che rende verificabile il Career Market",
      "La deduplicazione avviene all'inserimento, non in lettura",
      "Il refresh e' idempotente: rieseguirlo non duplica nulla",
    ],
    commonMistakes: [
      "Deduplicare sul titolo esatto: 'Senior Frontend' e 'Frontend Senior' sono lo stesso ruolo",
      "Perdere la data di controllo, rendendo impossibile capire se un annuncio e' vecchio",
      "Non gestire il rate limit e farsi bloccare dalla fonte",
    ],
    qualityCriteria: [
      "Zero duplicati sul catalogo dopo refresh ripetuti",
      "Ogni annuncio espone fonte e data",
      "Il refresh e' sicuro da eseguire piu' volte",
    ],
    cvBullet:
      "Sviluppato un collettore di annunci in Python che raccoglie feed pubblici, deduplica su azienda-titolo-localita' e traccia fonte e data di controllo di ogni inserimento.",
    skills: ["Python", "HTTP", "PostgreSQL", "Data quality"],
    roadmapSlug: "backend-engineer",
    minPlan: "free",
  },
  {
    slug: "resume-score-explainer",
    title: "Score con evidenze citabili",
    stack: ["TypeScript", "Algoritmi", "UI"],
    difficulty: "intermedio",
    hours: 10,
    roles: ["frontend", "data"],
    goal:
      "Calcolare uno score 0-100 mostrando, per ogni penalita', il frammento di testo che l'ha generata: nessun punteggio senza prova.",
    previewMilestones: [
      "Score 0-100 su cinque dimensioni",
      "Ogni penalita' accompagnata dal frammento di testo che la genera",
    ],
    fullMilestones: [
      "Penalita' per sezione mancante, bullet senza meta' e keyword mancanti",
      "Raggruppamento delle penalita' per sezione, dal peso maggiore",
      "Score coerente e monotono: piu' penalita' non possono aumentare il punteggio",
      "Visualizzazione del diff prima/dopo",
    ],
    architecture: [
      "Ogni regola di scoring e' una funzione pura che restituisce penalita' e prova",
      "L'aggregazione non puo' mai superare 100 ne' scendere sotto 0",
      "Le prove sono parte del dato, non un rendering",
    ],
    commonMistakes: [
      "Mostrare uno score senza spiegare come e' stato calcolato",
      "Regole che si compensano: un bonus puo' annullare una penalita' reale",
      "Dimenticare di mostrare anche i punti di forza",
    ],
    qualityCriteria: [
      "Ogni punto di score ha un frammento di testo che lo spiega",
      "Stesso CV, stesso punteggio, sempre",
      "Nessun punteggio possibile sotto 0 o sopra 100",
    ],
    cvBullet:
      "Progettato un motore di scoring ATS dove ogni penalita' e' accompagnata dal frammento di CV che la genera, con score 0-100 su cinque dimensioni e output deterministico.",
    skills: ["TypeScript", "Algoritmi", "UI", "Data analysis"],
    roadmapSlug: "data-scientist",
    guideSlug: "cv-ats-2026",
    minPlan: "free",
  },
  {
    slug: "salary-negotiation-sim",
    title: "Simulatore di negoziazione RAL",
    stack: ["TypeScript", "API LLM", "Regole"],
    difficulty: "avanzato",
    hours: 14,
    roles: ["full stack", "product"],
    goal:
      "Simulare una negoziazione partendo da una fascia reale, con l'agente che obietta come farebbe un recruiter e che l'utente deve convincere con argomentazioni.",
    previewMilestones: [
      "Avvio con ruolo, seniority e mercato",
      "L'agente parte da una posizione difendibile e risponde alle argomentazioni",
    ],
    fullMilestones: [
      "Leve distinte: responsabilita', mercato, urgenza, benefit",
      "Ogni risposta dell'agente cita la fascia di partenza e la fonte dei dati",
      "Esito finale con la posizione raggiunta e le leve piu' efficaci",
      "Nessun invio automatico di candidature o offerte",
    ],
    architecture: [
      "Le fasce arrivano dagli annunci reali, mai da numeri inventati",
      "L'agente non conclude mai la trattativa: l'utente decide",
      "Il simulatore non ha accesso a canali di contatto con l'azienda",
    ],
    commonMistakes: [
      "Far partire l'agente da cifre non riconducibili a nessuna fonte",
      "Mostrare solo le risposte positive: il training deve includere i rifiuti",
      "Collegare il simulatore a un invio reale: il confine va mantenuto netto",
    ],
    qualityCriteria: [
      "Ogni cifra citata e' riconducibile a un annuncio o dichiarata come stima",
      "Nessun accesso a funzioni di invio",
      "L'esito finale riassume le leve che hanno funzionato",
    ],
    cvBullet:
      "Realizzato un simulatore di negoziazione RAL che parte da fasce derivate da annunci reali, fa obiettare l'agente come un recruiter e riassume le leve efficaci, senza alcuna funzione di invio.",
    skills: ["TypeScript", "LLM", "Simulazione", "Product"],
    roadmapSlug: "product-manager",
    guideSlug: "negoziazione-ral",
    minPlan: "pro",
  },
  {
    slug: "ats-friendly-templates",
    title: "Motore di template ATS-safe",
    stack: ["TypeScript", "PDF", "HTML"],
    difficulty: "avanzato",
    hours: 16,
    roles: ["frontend", "full stack"],
    goal:
      "Generare lo stesso contenuto in layout a colonna singola che superano il parsing, e verificare automaticamente che il testo estratto dal PDF corrisponda a quello atteso.",
    previewMilestones: [
      "Stesso contenuto in tre impaginati diversi",
      "Estrazione del testo dal PDF generato",
    ],
    fullMilestones: [
      "Confronto automatico fra testo atteso e testo estratto",
      "Font e margini che non spezzano le righe",
      "Sezioni etichettate che il parser riconosce",
      "Tre formati di export: PDF, DOC e TXT",
    ],
    architecture: [
      "Il layout e' una scelta, il contenuto resta identico fra i formati",
      "Il test di verifica estrae il testo dal PDF e lo confronta: e' l'unico controllo che conta",
      "Nessuna tabella, nessuna colonna multipla, nessuna icona con significato",
    ],
    commonMistakes: [
      "Valutare un template a occhio invece di estrarne il testo",
      "Usare intestazioni grafiche al posto delle etichette di sezione",
      "Scegliere font che spostano l'ordine di lettura",
    ],
    qualityCriteria: [
      "Il testo estratto dal PDF corrisponde al contenuto sorgente",
      "Nessuna perdita di contenuto fra i formati di export",
      "Nessun elemento grafico che porti informazione unica",
    ],
    cvBullet:
      "Costruito un motore di template ATS-safe in TypeScript che verifica l'estrazione del testo dal PDF generato, con tre impaginati a colonna singola ed export in PDF, DOC e TXT.",
    skills: ["TypeScript", "PDF", "HTML", "Testing"],
    roadmapSlug: "frontend-engineer",
    minPlan: "starter",
  },
  {
    slug: "interview-sim",
    title: "Simulatore di colloquio comportamentale",
    stack: ["TypeScript", "API LLM", "Valutazione"],
    difficulty: "avanzato",
    hours: 12,
    roles: ["full stack", "product"],
    goal:
      "Porre domande in stile STAR ancorate ai bullet reali del CV e valutare la risposta su struttura, concretezza e profondita' tecnica.",
    previewMilestones: [
      "Domande derivate dalle esperienze effettive del CV, non da un bank generico",
      "Valutazione su struttura, concretezza e profondita'",
    ],
    fullMilestones: [
      "Rubrica pubblicata e visibile prima della simulazione",
      "Domande successive che approfondiscono la risposta data",
      "Feedback su struttura STAR, non sul tono",
      "Piano di miglioramento con i due punti su cui insistere",
    ],
    architecture: [
      "Le domande nascono dai bullet del CV: se non c'e' un bullet, la domanda non viene generata",
      "La valutazione usa una rubrica fissa, mostrata all'utente",
      "Il feedback non giudica il personaggio, giudica la struttura della risposta",
    ],
    commonMistakes: [
      "Valutare il tono invece della struttura",
      "Chiedere cose che il CV non sostiene",
      "Restituire un voto senza spiegare su cosa e' stato valutato",
    ],
    qualityCriteria: [
      "Ogni domanda e' ancorata a un elemento presente nel CV",
      "La rubrica e' visibile prima della simulazione",
      "Il feedback indica almeno due azioni concrete",
    ],
    cvBullet:
      "Sviluppato un simulatore di colloquio STAR che genera domande ancorate ai bullet reali del CV e valuta le risposte con una rubrica pubblicata, con feedback su struttura e profondita'.",
    skills: ["TypeScript", "LLM", "Valutazione", "Product"],
    roadmapSlug: "product-manager",
    guideSlug: "colloqui-star",
    minPlan: "starter",
  },
  {
    slug: "accessible-component-lib",
    title: "Libreria di componenti accessibili",
    stack: ["React", "TypeScript", "Testing"],
    difficulty: "intermedio",
    hours: 16,
    roles: ["frontend"],
    goal:
      "Costruire una libreria di componenti con navigazione da tastiera, focus visibile, ruoli ARIA corretti e test automatici sui requisiti di accessibilita'.",
    previewMilestones: [
      "Menu, dialog e tab con navigazione da tastiera completa",
      "Focus visibile e gestione corretta del focus trap",
    ],
    fullMilestones: [
      "Ruoli ARIA e gestione del focus su ogni componente",
      "Contrasto dei colori verificato sul tema scuro",
      "Test automatici che falliscono se un componente perde la navigazione da tastiera",
      "Documentazione con esempio d'uso",
    ],
    architecture: [
      "Ogni componente interattivo gestisce focus, Escape e click fuori in modo coerente",
      "Gli stili derivano dagli stessi token del tema: nessun colore hardcoded",
      "I test verificano il comportamento da tastiera, non la struttura del DOM",
    ],
    commonMistakes: [
      "Usare un div con onClick al posto di un button",
      "Rimuovere l'outline senza una alternativa visibile",
      "Dialog che non restituisce il focus al trigger alla chiusura",
    ],
    qualityCriteria: [
      "Tutti i componenti interattivi raggiungibili da tastiera",
      "Contrasto almeno 4.5:1 sul testo",
      "Nessun componente senza test sul comportamento da tastiera",
    ],
    cvBullet:
      "Realizzata una libreria di componenti React accessibili con navigazione da tastiera, focus trap, ruoli ARIA corretti e test automatici che verificano il comportamento da tastiera.",
    skills: ["React", "TypeScript", "Accessibilità", "Testing"],
    roadmapSlug: "frontend-engineer",
    minPlan: "free",
  },
  {
    slug: "analytics-dashboard",
    title: "Dashboard analisi con query reali",
    stack: ["PostgreSQL", "Next.js", "Chart"],
    difficulty: "avanzato",
    hours: 18,
    roles: ["data", "frontend"],
    goal:
      "Costruire una dashboard su dati di produzione con query ottimizzate, aggregazioni corrette e paginazione che non si degrada con la crescita dei dati.",
    previewMilestones: [
      "Query con aggregazione per intervallo temporale",
      "Indici sui campi usati nei filtri",
    ],
    fullMilestones: [
      "Paginazione che non si degrada con il crescere dei dati",
      "Indici sui campi filtrati e verifica con EXPLAIN",
      "Calcolo delle metriche con test su dataset noti",
      "Cache delle query piu' costose con invalidazione esplicita",
    ],
    architecture: [
      "Gli indici scendono dai filtri reali della UI, non a caso",
      "Ogni metrica ha un test su un dataset con risultato noto",
      "La cache ha un'invalidazione esplicita, non una scadenza cieca",
    ],
    commonMistakes: [
      "Aggiungere indici a tutto: rallentano le scritture",
      "Calcolare le metriche in JavaScript invece che in SQL",
      "Non testare le aggregazioni su dati noti",
    ],
    qualityCriteria: [
      "Il tempo di risposta resta costante crescendo i dati",
      "Ogni metrica ha un test",
      "Le query usano gli indici, verificato con EXPLAIN",
    ],
    cvBullet:
      "Costruita una dashboard analitica in Next.js con aggregazioni SQL testate su dataset noti, indici scelti dai filtri reali e paginazione stabile alla crescita dei dati.",
    skills: ["SQL", "Next.js", "Data visualization", "Performance"],
    roadmapSlug: "data-scientist",
    minPlan: "starter",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export const projectCount = projects.length;

export const projectPlanLabels: Record<Project["minPlan"], string> = {
  free: "Free",
  starter: "Starter",
  pro: "Pro",
  enterprise: "Enterprise",
};