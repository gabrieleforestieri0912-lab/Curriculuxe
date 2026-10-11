import type { Roadmap } from "./types";

/**
 * Roadmap per ruolo. Le tappe sono ordinate per livello di seniority: ogni
 * tappa dichiara le skill, i progetti che la dimostrano, cosa scrivere nel CV
 * e il criterio verificabile che la chiude.
 */
export const roadmaps: Roadmap[] = [
  {
    slug: "frontend-engineer",
    title: "Roadmap Frontend Engineer",
    metaDescription:
      "Percorso da Frontend a Senior Frontend: tappe, skill richieste, progetti da costruire e criteri di verifica per ogni passo.",
    role: "Frontend",
    level: "mid",
    levelLabel: "Mid → Senior",
    months: 10,
    hoursPerWeek: 10,
    market: "italia",
    intro:
      "Il salto di livello in frontend non arriva dalla quantita' di framework che conosci, ma da tre cose che un recruiter verifica subito: accessibilita', performance misurata e test. Questa roadmap mette in fila quei tre filoni, con un progetto per ogni tappa.",
    prerequisites: [
      "HTML semantico e CSS moderno: flexbox, grid, custom properties",
      "JavaScript ES2020+: array methods, async/await, moduli",
      "Un editor con lint e formatter integrati",
    ],
    stops: [
      {
        id: "fondamenti",
        title: "Fondamentali di prodotto, non solo di sintassi",
        goal:
          "Capire come si costruisce un'interfaccia che regge il dato reale: stati di caricamento, errori e vuoti.",
        skills: [
          "TypeScript",
          "Gestione stato remoto con cache",
          "Form e validazione accessibile",
          "Testing di componenti",
        ],
        projects: ["realtime-board", "accessible-component-lib"],
        cvEvidence:
          "Sviluppato un flusso di candidate con stati di caricamento ed errore espliciti e test di componente sui casi limite.",
        doneWhen:
          "Ogni schermata ha uno stato di caricamento, uno di errore con azione di recupero e uno vuoto: tutti raggiungibili solo con la tastiera.",
        resources: [
          { label: "Progetto: board realtime" },
          { label: "Progetto: libreria accessibile" },
        ],
      },
      {
        id: "accessibilita",
        title: "Accessibilita' non negoziabile",
        goal:
          "Portare il prodotto a WCAG 2.2 AA su navigazione, focus e contrasto.",
        skills: [
          "Ruoli ARIA e focus management",
          "Contrasto e tipografia",
          "Navigazione da tastiera",
          "Test automatici di accessibilita'",
        ],
        projects: ["accessible-component-lib"],
        cvEvidence:
          "Portato a zero violazioni WCAG 2.2 AA su un flusso completo con test automatici che bloccano la regressione.",
        doneWhen:
          "Tutti i componenti interattivi si usano solo da tastiera e il contrasto del testo sul tema scuro supera 4.5:1.",
        resources: [{ label: "Progetto: libreria accessibile" }],
      },
      {
        id: "performance",
        title: "Performance misurata, non dichiarata",
        goal:
          "Diagnosticare e correggere i colli di bottiglia con metriche, non con impressioni.",
        skills: [
          "Core Web Vitals",
          "Code splitting e lazy loading",
          "Memoizzazione e stabilita' dei render",
          "Profilazione di bundle",
        ],
        projects: ["realtime-board"],
        cvEvidence:
          "Ridotto l'LCP da 4.1s a 1.6s con code splitting per rotta e budget di bundle in CI.",
        doneWhen:
          "Il report di build segnala il superamento del budget di bundle e i tre Core Web Vitals sono verdi su una build di produzione.",
        resources: [{ label: "Progetto: board realtime" }],
      },
      {
        id: "testing",
        title: "Test dove il fallimento costa",
        goal:
          "Coprire con i test i flussi che scagliano denaro, non la percentuale di copertura.",
        skills: [
          "Test di integrazione",
          "Mock delle API",
          "Test end-to-end",
          "Mutation testing",
        ],
        projects: ["cv-tailoring-engine"],
        cvEvidence:
          "Coperti con test end-to-end i tre flussi che generano reddito, con riduzione dei difetti in produzione.",
        doneWhen:
          "Un difetto su form, submit e pagamento viene bloccato dalla pipeline prima del deploy.",
        resources: [{ label: "Progetto: motore di tailoring" }],
      },
      {
        id: "design-system",
        title: "Design system e componenti riusabili",
        goal:
          "Estrarre i pattern ripetuti in componenti con contratto chiaro.",
        skills: [
          "API dei componenti",
          "Token di design",
          "Versionamento",
          "Documentazione",
        ],
        projects: ["ats-friendly-templates", "accessible-component-lib"],
        cvEvidence:
          "Estratto un design system di 18 componenti usato in 4 prodotti, con documentazione e test visivi.",
        doneWhen:
          "Un nuovo componente entra nel sistema con contratto documentato, token e test, senza duplicare codice esistente.",
        resources: [{ label: "Progetto: template ATS-safe" }],
      },
      {
        id: "seniorita",
        title: "Impatto: coordinamento e decisioni tecniche",
        goal:
          "Passare da 'risolvo il task' a 'decido come lo risolviamo'.",
        skills: [
          "Code review strutturata",
          "Stime e breakdown",
          "Decisioni tecniche documentate",
          "Mentoring",
        ],
        projects: ["cv-tailoring-engine"],
        cvEvidence:
          "Guidato la migrazione di un modulo a una nuova versione, con piano di lavoro e review di 14 pull request.",
        doneWhen:
          "Ogni modifica strutturale ha una decisione scritta con alternative valutate e criteri di rollback.",
        resources: [{ label: "Progetto: motore di tailoring" }],
      },
    ],
    jobKeywords: ["frontend", "react", "typescript", "performance", "accessibility"],
    relatedGuides: ["cv-ats-2026", "tailoring-jd"],
  },
  {
    slug: "backend-engineer",
    title: "Roadmap Backend Engineer",
    metaDescription:
      "Percorso da Backend Junior a Mid: API, dati, affidabilita' e deployment, con progetti concreti e criteri di verifica.",
    role: "Backend",
    level: "junior",
    levelLabel: "Junior → Mid",
    months: 9,
    hoursPerWeek: 10,
    market: "italia",
    intro:
      "Il salto da Junior a Mid in backend si gioca su tre cose verificabili: sai progettare un contratto che non ti costringe a rifare tutto fra sei mesi, sai rendere il tuo servizio affidabile quando qualcosa si rompe, e sai guardare i dati prima di ottimizzare.",
    prerequisites: [
      "Un linguaggio di backend a tuo agio: Node, Python o Java",
      "SQL: JOIN, indice, EXPLAIN",
      "HTTP e REST a mano: metodi, status, codici di errore",
      "Git e riga di comando",
    ],
    stops: [
      {
        id: "contratto",
        title: "Progettare il contratto prima del codice",
        goal:
          "Definire risorse, errori e compatibilita' prima di scrivere l'implementazione.",
        skills: [
          "REST e risorse annidate",
          "Versionamento dell'API",
          "Codici di errore coerenti",
          "Validazione dell'input",
        ],
        projects: ["ats-parser"],
        cvEvidence:
          "Progettato e documentato il contratto di un'API di parsing CV con 5 codici di errore e schema versionato.",
        doneWhen:
          "Il contratto e' scritto, l'input non validato e' rifiutato con 400 e un cliente puo' consumare l'API dal solo documento.",
        resources: [{ label: "Progetto: parser CV" }],
      },
      {
        id: "dati",
        title: "Dati che reggono la crescita",
        goal:
          "Modellare e interrogare in modo che il volume non rompa nulla.",
        skills: [
          "Modellazione relazionale",
          "Indici e query plan",
          "Migrazioni",
          "Paginamento",
        ],
        projects: ["jobs-scraper-dedup"],
        cvEvidence:
          "Ridotto il tempo di una query da 8s a 120ms aggiungendo gli indici sui campi realmente filtrati.",
        doneWhen:
          "Ogni query che risponde in piu' di 100 ms ha un EXPLAIN allegato e un indice motivato.",
        resources: [{ label: "Progetto: raccolta annunci" }],
      },
      {
        id: "affidabilita",
        title: "Affidabilita' quando qualcosa si rompe",
        goal:
          "Gestire timeout, retry e idempotenza senza duplicare effetti.",
        skills: [
          "Idempotenza",
          "Retry con backoff",
          "Code e job asincroni",
          "Transazioni",
        ],
        projects: ["saas-billing"],
        cvEvidence:
          "Reso idempotente l'endpoint di pagamento: zero doppi addebiti su eventi duplicati e fuori ordine.",
        doneWhen:
          "Lo stesso webhook processato due volte produce lo stesso stato, e un fallimento a meta' non lascia dati a meta'.",
        resources: [{ label: "Progetto: billing SaaS" }],
      },
      {
        id: "sicurezza",
        title: "Sicurezza di base, non specialistica",
        goal:
          "Chiudere i vizi che capitano davvero in produzione.",
        skills: [
          "Autenticazione e autorizzazione",
          "Validazione dei dati non fidati",
          "Segreti e configurazione",
          "Log senza dati sensibili",
        ],
        projects: ["jobs-scraper-dedup"],
        cvEvidence:
          "Chiusi 4 vulnerabilita' su un'app in produzione, fra cui autorizzazione mancante su 3 endpoint.",
        doneWhen:
          "Ogni endpoint verifica l'ownership della risorsa e nessun segreto finisce nel repository o nei log.",
        resources: [{ label: "Progetto: raccolta annunci" }],
      },
      {
        id: "osservabilita",
        title: "Misurare prima di ottimizzare",
        goal:
          "Strumenti per capire dove il sistema rallenta davvero.",
        skills: [
          "Log strutturati",
          "Metriche",
          "Tracing",
          "Alert",
        ],
        projects: ["analytics-dashboard"],
        cvEvidence:
          "Introdotto tracing su 9 servizi, riducendo il tempo medio di diagnosi degli incidenti da 40 a 8 minuti.",
        doneWhen:
          "A ogni richiesta puoi rispondere in meno di un minuto da dove arriva il tempo speso.",
        resources: [{ label: "Progetto: dashboard analisi" }],
      },
      {
        id: "scala",
        title: "Scala senza riscrivere",
        goal:
          "Gestire la crescita del carico con code, cache e sharding ragionati.",
        skills: [
          "Caching",
          "Code di messaggi",
          "Partizionamento",
          "Degrado controllato",
        ],
        projects: ["saas-billing", "analytics-dashboard"],
        cvEvidence:
          "Gestito un picco di 12x il carico con code e rate limiting, senza degrado del tempo di risposta.",
        doneWhen:
          "Sotto carico il servizio rallenta in modo controllato invece di restituire errori.",
        resources: [{ label: "Progetto: dashboard analisi" }],
      },
    ],
    jobKeywords: ["backend", "node.js", "sql", "distributed systems", "api"],
    relatedGuides: ["tailoring-jd", "negoziazione-ral"],
  },
  {
    slug: "data-scientist",
    title: "Roadmap Data Scientist",
    metaDescription:
      "Percorso Data Scientist: dalla statistica all'ML in produzione, con progetti, metriche di valutazione e criteri di verifica.",
    role: "Data",
    level: "mid",
    levelLabel: "Mid",
    months: 11,
    hoursPerWeek: 10,
    market: "europa",
    intro:
      "Il salto di livello in data non passa dal numero di modelli che hai addestrato, ma da quanto sei preciso su due cose: sai dire quando un modello non funziona, e sai metterlo in produzione senza che nessuno lo monitori.",
    prerequisites: [
      "Statistica: distribuzioni, test d'ipotesi, inferenza",
      "SQL intermedio e Python per l'analisi",
      "Nozioni di machine learning supervisionato",
    ],
    stops: [
      {
        id: "analisi",
        title: "Analisi che regge la discussione",
        goal:
          "Rispondere a una domanda di business con dati che reggono fino alla riunione successiva.",
        skills: [
          "Query analitiche",
          "Analisi di coorte",
          "Bias e confounders",
          "Comunicazione dei dati",
        ],
        projects: ["analytics-dashboard"],
        cvEvidence:
          "Analizzato i dati di abbandono su 18 mesi, isolando la causa principale e quantificando l'impatto correttivo.",
        doneWhen:
          "Ogni affermazione ha il numeratore, il denominatore, il periodo e la fonte dei dati.",
        resources: [{ label: "Progetto: dashboard analisi" }],
      },
      {
        id: "features",
        title: "Feature engineering con criterio",
        goal:
          "Costruire variabili che hanno una motivazione, non che regnano la correlazione.",
        skills: [
          "Feature selection",
          "Encoding categorici",
          "Normalizzazione",
          "Data leakage",
        ],
        projects: ["resume-score-explainer"],
        cvEvidence:
          "Ridotto il numero di feature da 180 a 34 mantenendo un vantaggio a 0.3 punti di F1 ed eliminando data leakage.",
        doneWhen:
          "Ogni feature ha una motivazione dichiarata e il training non usa informazioni non disponibili a produzione.",
        resources: [{ label: "Progetto: score con evidenze" }],
      },
      {
        id: "valutazione",
        title: "Valutazione onesta",
        goal:
          "Misurare un modello su dati che somigliano a quelli su cui andra' in produzione.",
        skills: [
          "Cross validation",
          "Metriche sbilanciate",
          "Baseline",
          "Intervalli di confidenza",
        ],
        projects: ["resume-score-explainer"],
        cvEvidence:
          "Sostituita una metrica che premiava il caso maggioritario con una validazione su fold temporali, con intervalli di confidenza.",
        doneWhen:
          "Il modello batte una baseline banale su un dataset di test temporale, non su una cross validation casuale.",
        resources: [{ label: "Progetto: score con evidenze" }],
      },
      {
        id: "produzione",
        title: "ML in produzione",
        goal:
          "Portare il modello in produzione e sapere quando degradare.",
        skills: [
          "Pipeline dati versionati",
          "Servizio del modello",
          "Monitoraggio della deriva",
          "Rollback",
        ],
        projects: ["resume-score-explainer"],
        cvEvidence:
          "Messo in produzione un modello di scoring con monitoraggio della deriva e rollback automatico, riducendo del 40% i tempi di degrado.",
        doneWhen:
          "Una deriva nella distribuzione dei dati di ingresso attiva un alert prima che impatti l'accuratezza.",
        resources: [{ label: "Progetto: score con evidenze" }],
      },
      {
        id: "comunicazione",
        title: "Comunicare l'incertezza",
        goal:
          "Dire quanto sei sicuro, perche' una stima senza intervallo e' una scommessa.",
        skills: [
          "Intervalli di confidenza",
          "Test A/B",
          "Visualizzazione di distribuzioni",
          " storytelling dei dati",
        ],
        projects: ["analytics-dashboard"],
        cvEvidence:
          "Riproposto il sistema di raccomandazione con intervalli di confidenza, riducendo le segnalazioni di incongruenza del 60%.",
        doneWhen:
          "Ogni presentazione mostra la distribuzione, non solo la media.",
        resources: [{ label: "Progetto: dashboard analisi" }],
      },
    ],
    jobKeywords: ["data scientist", "python", "sql", "machine learning", "mlops"],
    relatedGuides: ["cv-ats-2026", "colloqui-star"],
  },
  {
    slug: "product-manager",
    title: "Roadmap Product Manager",
    metaDescription:
      "Percorso Product Manager: discovery, priorita' evidence-based, misura e comunicazione, con progetti e criteri di verifica.",
    role: "Product",
    level: "mid",
    levelLabel: "Mid",
    months: 8,
    hoursPerWeek: 8,
    market: "italia",
    intro:
      "Il salto di livello in product non arriva dal numero di feature lanciate, ma da tre abitudini: sai dire di no motivatamente, sai distinguere un problema vero da un cliente rumoroso, e sai misurare quello che hai costruito.",
    prerequisites: [
      "Un contesto tecnico: sai come funziona un team di sviluppo abbastanza da non promettere l'impossibile",
      "Metodi quantitativi di base per leggere un dataset",
      "Scrittura: una specifica chiara vale piu' di tre riunioni",
    ],
    stops: [
      {
        id: "discovery",
        title: "Discovery: il problema prima della soluzione",
        goal:
          "Validare che il problema sia reale,ampio e urgente prima di costruire.",
        skills: [
          "Interviste",
          "Analisi dei dati d'uso",
          "Jobs to be done",
          "Mappatura delle ipotesi",
        ],
        projects: ["salary-negotiation-sim"],
        cvEvidence:
          "Ridotta la roadmap di un trimestre a due iniziative dopo aver verificato che il 70% delle richieste riguardava un solo flusso.",
        doneWhen:
          "Ogni iniziativa di roadmap ha un problema dichiarato, un utente e una prova che il problema esiste.",
        resources: [{ label: "Progetto: simulatore di negoziazione" }],
      },
      {
        id: "priorita",
        title: "Priorita' con metodo",
        goal:
          "Ordinare le richieste senza che la decisione dipenda da chi chiede piu' forte.",
        skills: [
          "Framework di priorita'",
          "Costo opportunita'",
          "Dipendenze tecniche",
          "Trade-off espliciti",
        ],
        projects: ["cover-letter-ai"],
        cvEvidence:
          "Ridotto il backlog del 30% applicando un modello di costo-opportunita', con i trade-off dichiarati in una pagina per-quarter.",
        doneWhen:
          "Ogni scelta di priorita' ha un criterio dichiarato e un costo-opportunita' calcolato.",
        resources: [{ label: "Progetto: generatore cover letter" }],
      },
      {
        id: "specifica",
        title: "Specifiche che non generano sorprese",
        goal:
          "Scrivere una specifica che uno sviluppatore possa implementare senza chiederti tre volte.",
        skills: [
          "User story con criteri di accettazione",
          "Edge case",
          "Stati di errore",
          "Dipendenze",
        ],
        projects: ["cv-tailoring-engine"],
        cvEvidence:
          "Riscritte 40 user story con criteri di accettazione ed edge case, azzerando i ticket rimandati per ambiguità.",
        doneWhen:
          "Nessuna user story torna indietro perche' manca un caso limite.",
        resources: [{ label: "Progetto: motore di tailoring" }],
      },
      {
        id: "misura",
        title: "Misurare l'effetto",
        goal:
          "Collegare la modifica al risultato, non all'attivita'.",
        skills: [
          "Definizione di metriche",
          "Test A/B",
          "Funnel analysis",
          "Attribuzione",
        ],
        projects: ["analytics-dashboard"],
        cvEvidence:
          "Disegnato un esperimento A/B che ha portato a +11% di attivazione, con significativita' statistica dichiarata e potenza calcolata.",
        doneWhen:
          "Ogni iniziativa ha una metrica dichiarata prima del lancio e un criterio di successo scritto in anticipo.",
        resources: [{ label: "Progetto: dashboard analisi" }],
      },
      {
        id: "comunicazione",
        title: "Comunicare anche le notizie scomode",
        goal:
          "Dire quando una cosa non funziona, prima che lo scoprano gli altri.",
        skills: [
          "Storytelling con i dati",
          "Gestione degli stakeholder",
          "Scrittura asincrona",
          "Allineamento sullo stato",
        ],
        projects: ["salary-negotiation-sim"],
        cvEvidence:
          "Introdotto un aggiornamento mensile con obiettivi, risultati e scostamenti, riducendo le richieste di stato ad hoc del 70%.",
        doneWhen:
          "Il team sa dove siamo senza che tu debba riunirti, e gli scostamenti vengono pubblicati quando accadono.",
        resources: [{ label: "Progetto: simulatore di negoziazione" }],
      },
    ],
    jobKeywords: ["product management", "agile", "roadmap", "stakeholder", "analytics"],
    relatedGuides: ["cover-letter-italia", "colloqui-star"],
  },
];

export function getRoadmap(slug: string): Roadmap | undefined {
  return roadmaps.find((roadmap) => roadmap.slug === slug);
}