import type { Guide, GuideCategory } from "./types";

export const guides: Guide[] = [
  {
    slug: "cv-ats-2026",
    title: "CV ATS: le 5 verifiche che contano",
    excerpt:
      "I sistemi di tracciamento leggono il CV riga per riga. Cinque verifiche concrete per non farti scartare prima che una persona legga una riga.",
    metaDescription:
      "Le 5 verifiche per superare i filtri ATS: formato a colonna singola, keyword dell'offerta, metriche nei bullet, leggibilita' e controllo finale. Con esempi prima/dopo.",
    category: "ats",
    intro:
      "Se un filtro automatico scarta il tuo CV, non e' un giudizio sul tuo valore: e' un errore di lettura. Un parser cerca sezioni con nomi riconoscibili, keyword che compaiono nel documento e una struttura che non gli si spezzi addosso. Questa guida segue quei cinque punti nell'ordine in cui conviene controllarli, perche' il primo sbagliato rende inutile il resto.",
    sections: [
      {
        id: "formato",
        heading: "1. Formato: una colonna, niente tabelle",
        paragraphs: [
          "I parser leggono da sinistra a destra, riga per riga. Tabelle, colonne multiple, intestazioni grafiche e icone mandano in confusione l'estrazione: le tue esperienze finiscono nel campo sbagliato o spariscono del tutto, senza che tu veda nulla sul PDF che hai inviato.",
          "La regola pratica e' semplice: se nel PDF le righe si leggono in ordine quando incolli il testo in un editor, il parser le leggera' uguale. I template di Curriculuxe sono a colonna singola per questo motivo, non per una questione estetica.",
        ],
        example: {
          label: "Come appare in un CV a due colonne",
          before:
            "ESPERIENZA PROFESSIONALE\n\nRuolo | Azienda | 2021-2024\nAnalista | Acme | Milano\n\nCOMPETENZE\nExcel, SQL, Python",
          after:
            "ESPERIENZA PROFESSIONALE\n\nAnalista — Acme, Milano (2021-2024)\n\nCOMPETENZE TECNICHE\n\nExcel, SQL, Python",
          note:
            "Nel testo incolla dal PDF la versione a due colonne perde l'associazione fra ruolo e date: il punteggio di parsing crolla anche se il documento e' identico a occhio.",
        },
        bullets: [
          "Una sola colonna, sempre",
          "Niente tabelle per allineare le date",
          "Niente icone al posto delle intestazioni di sezione",
          "Nomi di sezione standard: il parser li riconosce",
        ],
      },
      {
        id: "keyword",
        heading: "2. Keyword: lo specchio dell'offerta, non la lista della spesa",
        paragraphs: [
          "L'errore piu' comune e' copiare il proprio CV su quello di qualcun altro. Le keyword che contano sono quelle dell'offerta che stai leggendo in questo momento: il termine con cui l'azienda chiama la tua mansione, lo strumento che ha nel testo, la certificazione che richiede.",
          "Non serve infilare tutto: servono le keyword che descrivono davvero quello che sai. Un termine che non regge la domanda 'mostrami un esempio' in colloquio ti costa piu' di quanto rende.",
        ],
        bullets: [
          "Scegli 8-12 keyword dall'annuncio, non 40",
          "Usale dove descrivono un risultato, non in una riga generica",
          "Scrivi la sigla e la forma estesa almeno una volta: 'K8s (Kubernetes)'",
        ],
      },
      {
        id: "metriche",
        heading: "3. Metriche: ogni bullet deve avere un numero",
        paragraphs: [
          "Un bullet senza numero e' un'affermazione. 'Automatizzato il reporting settimanale' dice che hai lavorato; 'automatizzato il reporting settimanale in Python, riducendo da 6 ore a 1' dice cosa hai prodotto. Il parser conta i numeri come indicatori di concretezza, e chi legge valuta la differenza.",
          "Il numero non deve essere inventato e non deve essere un round number di comodo. Se il dato non esiste, misuralo o scrivi il risultato in modo verificabile: 'su 12 clienti seguiti' e' un numero onesto.",
        ],
        example: {
          label: "Stesso lavoro, due versioni",
          before: "Mi sono occupata del lancio di nuove funzionalita' e della creazione di contenuti.",
          after:
            "Guidato il lancio di 3 funzionalita' per 2 buyer persona, aumentando l'attivazione del 22% su 12.000 utenti.",
          note: "Azione, ambito, risultato. Tre elementi, un numero.",
        },
      },
      {
        id: "leggibilita",
        heading: "4. Leggibilita': se non lo leggi tu in 30 secondi, non lo leggera' nemmeno il recruiter",
        paragraphs: [
          "Il primo giro di lettura dura pochi secondi. In quel tempo il recruiter cerca tre cose: di che ruolo ti occupi, su cosa hai lavorato di recente e con quale risultato. Se queste tre risposte non sono in cima, il CV funziona ma non viene ricordato.",
          "Questo non ha a che fare con l'ATS, e' il passaggio successivo. Un CV perfetto per il parser e illeggibile per una persona e' un CV che non funziona.",
        ],
        bullets: [
          "Ruolo e anni di esperienza nelle prime due righe",
          "Tre esiti principali in evidenza, non undici",
          "Un CV per offerta: non usare lo stesso documento per ruoli diversi",
        ],
      },
      {
        id: "controllo",
        heading: "5. Controllo finale: rileggi il file, non il documento",
        paragraphs: [
          "L'ultimo controllo si fa sul testo estratto, non sul PDF aperto. Apri il file, incolla tutto in un editor di testo e leggi: e' esattamente quello che vede il parser. Se ci sono colonne spezzate, righe fuori ordine o simboli residui, li trovi subito.",
          "Poi verifica la coerenza: stesse date fra offerta e LinkedIn, stesse tecnologie, nessun ruolo che non sai raccontare. E non inviare la stessa versione a offerte diverse: il tailoring e' la verifica piu' economica che esista.",
        ],
        bullets: [
          "Incolla il testo del PDF in un editor e rileggilo",
          "Controlla che ogni tecnologia citata sia nel tuo curriculum reale",
          "Adatta il CV all'offerta prima di inviare",
        ],
      },
    ],
    checklist: [
      "CV a colonna singola, senza tabelle",
      "Nomi di sezione standard riconoscibili",
      "8-12 keyword dell'offerta presenti dove descrivono un risultato",
      "Almeno un numero in ogni bullet di esperienza",
      "Ruolo e risultati principali leggibili nei primi 10 secondi",
      "Testo del PDF incollato e riletto prima dell'invio",
      "Versione adattata all'offerta, non quella generica",
    ],
    faq: [
      {
        q: "I template a due colonne sono davvero un problema?",
        a:
          "Solo se il parser li legge male. Dipende dall'implementazione del sistema che ti legge e non puoi saperlo in anticipo. La scelta sicura resta una colonna: costa poco e non dipende dalla fortuna.",
      },
      {
        q: "Quante keyword servono?",
        a:
          "Dipende dalla lunghezza dell'annuncio, non da un numero magico. Di solito 8-12 termini coprono la parte tecnica di un'offerta reale; il rischio non e' usarne poche, e' usarne troppe che non descrivono il tuo lavoro.",
      },
      {
        q: "I simboli, le emoji e i grafici influiscono?",
        a:
          "Sì, quando sostituiscono informazione. Un'icona al posto di 'Email' o di 'Istruzione' e' un simbolo che il parser non collega a nulla. Se l'icona e' decorativa e il testo e' gia' presente, non crea problemi.",
      },
    ],
    sources: [],
    related: ["tailoring-jd", "keyword-tailoring-ats"],
    publishedAt: "2026-06-18",
    updatedAt: "2026-10-01",
  },

  {
    slug: "tailoring-jd",
    title: "Adattare il CV a un'offerta senza inventare nulla",
    excerpt:
      "Il tailoring non e' cambiare le parole: e' riordinare la tua esperienza in funzione di cio' che quell'offerta chiede.",
    metaDescription:
      "Come adattare il CV a una job description senza inventare esperienze: 3 passi, esempi prima/dopo e il metodo per scegliere cosa cambiare.",
    category: "cv",
    intro:
      "Il tailoring e' la singola azione che alza di piu' la risposta a una candidatura, ed e' anche quella che piu' facilmente diventa una bugia. La regola e' una sola: puoi cambiare l'ordine, l'evidenza e la/tagliare, non i fatti.",
    sections: [
      {
        id: "estrai",
        heading: "1. Estrai le keyword che contano, non tutte",
        paragraphs: [
          "Rileggi l'offerta e sottolinea i termini che ricorrono: la tecnologia principale, il modo in cui l'azienda nomina il ruolo, la responsabilita' che compare piu' volte. Se un termine compare una volta sola fra 400 parole, e' rumore.",
          "Ora confronta con il tuo CV: per ogni keyword trovi un esempio reale? Se si', deve essere visibile in tre secondi. Se non si', non aggiungerla.",
        ],
        bullets: [
          "Sottolinea i termini che ricorrono almeno due volte",
          "Per ciascuno chiediti: ho un esempio concreto?",
          "Se non hai l'esempio, il problema e' nell'offerta, non nel CV",
        ],
      },
      {
        id: "riscrivi",
        heading: "2. Riscrivi tre bullet, non tutto il CV",
        paragraphs: [
          "Il tentativo di riscrivere ogni riga produce un CV peggiore: diventa incomprensibile e si perde il filo di quello che hai davvero fatto. Bastano tre bullet, scelti fra quelli che hanno piu' affinità con l'offerta.",
          "Il metodo e' il formato Azione + Strumento + Risultato, con il risultato misurato. Se non hai il numero, il risultato si descrive in modo verificabile: il cliente, il perimetro, la frequenza.",
        ],
        example: {
          label: "Tailoring di un bullet su due offerte diverse",
          before: "Sviluppo di microservizi in Node.js.",
          after:
            "[Frontend] Refactoring di 4 microservizi Node.js su un monolite, riducendo il tempo di build da 22 a 6 minuti.\n[Backend] Estrazione di 4 microservizi Node.js per separare il ciclo di deploy, riducendo il tempo di build da 22 a 6 minuti.",
          note:
            "Stesso fatto, due inquadrature diverse. Non e' una versione pi' vera dell'altra: e' la stessa realta' vista dal punto di vista del lavoro richiesto.",
        },
      },
      {
        id: "salva",
        heading: "3. Una versione per offerta, mai sopra l'originale",
        paragraphs: [
          "Il documento di base non si tocca. Ogni candidatura parte da una copia con un nome che ricordi l'azienda: quando torni su quella stessa azienda fra tre mesi, sai esattamente cosa hai mandato.",
          "Questo vale perche' ti serve per capire cosa funziona. Dopo dieci candidature con dieci versioni diverse, vedi quali modifiche hanno prodotto risposte.",
        ],
        bullets: [
          "Versione base intoccabile",
          "Una copia per offerta, con data nel nome",
          "Annota quale versione ha avuto risposta",
        ],
      },
    ],
    checklist: [
      "Le keyword ricorrenti dell'offerta sono visibili nel CV",
      "Ogni keyword scelta ha un esempio reale nel tuo curriculum",
      "Tre bullet riscritti in formato Azione + Strumento + Risultato",
      "Nessuna competenza aggiunta che non sai dimostrare",
      "L'originale e' rimasto intatto",
      "La copia e' salvata con il nome dell'azienda",
    ],
    faq: [
      {
        q: "Posso aggiungere una tecnologia che non ho usato ma che e' richiesta?",
        a:
          "No, a meno che tu non intendiamo studiarla prima del colloquio. Metterla nel CV espone a una domanda a cui non sai rispondere, e la risposta peggiore che puoi dare e' 'e' nel mio CV ma non l'ho mai usata'.",
      },
      {
        q: "Devo riscrivere tutto il CV per ogni offerta?",
        a:
          "No. Riordina le sezioni in funzione dell'offerta e riscrivi tre bullet. Il resto resta com'e': se una versione richiede di stravolgere il documento, l'offerta e' semplicemente di un altro tipo di lavoro.",
      },
    ],
    sources: [],
    related: ["keyword-tailoring-ats", "cv-ats-2026"],
    publishedAt: "2026-07-22",
    updatedAt: "2026-09-28",
  },

  {
    slug: "cover-letter-italia",
    title: "Cover letter in Italia: struttura ed errori",
    excerpt:
      "Quattro blocchi, tre errori che affossano la lettera, e la differenza di tono fra mercato italiano, europeo e americano.",
    metaDescription:
      "Come scrivere una cover letter per il mercato italiano: la struttura in 4 blocchi, un esempio completo, gli errori da evitare e come adattare il tono all'Europa e agli USA.",
    category: "cover-letter",
    intro:
      "In Italia la cover letter non e' la norma, ma quando c'e' arriva perche' l'azienda l'ha richiesta o perche' il ruolo e' aperto. In quel caso la leggete davvero. La lettera non aggiunge informazioni nuove: dice perche' quella candidatura ti interessa.",
    sections: [
      {
        id: "struttura",
        heading: "1. Struttura in quattro blocchi",
        paragraphs: [
          "Nel primo blocco dici per quale ruolo ti candidi e perche' quella specifica azienda. Il secondo dimostra, con un risultato, che sai fare il lavoro. Il terzo collega la tua esperienza ai requisiti dell'offerta. Il quarto chiude con disponibilita' e modalita' di contatto.",
          "Tieni la lettera sotto le 200 parole. Oltre quella soglia smetti di convincere e inizi a ripetere il CV.",
        ],
        example: {
          label: "Esempio completo, 168 parole",
          before: "",
          after:
            "Gentile team,\n\nmi candido per la posizione di Backend Engineer Node.js. Il motivo e' preciso: il lavoro che descrivete richiede di tenere insieme affidabilita' del servizio e rapidita' di rilascio, e su questo ho un risultato che posso raccontare nel dettaglio.\n\nIn 4 anni ho lavorato su un servizio di pagamento che gestiva 40.000 operazioni al giorno. Ho separato la logica di riconciliazione dal servizio principale, riducendo gli incidenti notturni da 6 al mese a meno di uno.\n\nQuello che mi interessa del vostro ruolo e' la parte di affidabilita': e' il punto in cui ho imparato di piu' negli ultimi due anni, e vorrei continuare a lavorarci dentro.\n\nResto a disposizione per una conversazione.\n\nCordiali saluti,\n[Nome Cognome]",
          note:
            "Quattro blocchi, un solo risultato con numero, una ragione specifica per quell'azienda.",
        },
      },
      {
        id: "errori",
        heading: "2. I tre errori che affossano tutto",
        paragraphs: [
          "Il primo e' il copia-incolla: se la prima riga si puo' cambiare con il nome di un'altra azienda, la lettera non e' per quell'azienda. Il secondo e' l'assenza di numeri: la lettera senza risultati misurati e' un profilo generico come tanti.",
          "Il terzo e' chiedere in modo esplicito il lavoro. La lettera dice perche' sei adatto e lascia che sia l'azienda a decidere se ti assume: chiedere 'quando posso iniziare' nella prima riga sposta il baricentro su di te.",
        ],
      },
      {
        id: "mercati",
        heading: "3. Tono: Italia, Europa, Stati Uniti non sono la stessa cosa",
        paragraphs: [
          "In Italia la lettera piu' funzionare e' sobria: dati, contesto, disponibilita'. In Europa la stessa struttura va resa piu' esplicita sul perimetro del ruolo e, se l'azienda lo chiede, sul livello di lingua.",
          "Negli Stati Uniti la lettera e' il punto in cui spieghi il motivo della candidatura in tre righe: perche' quell'azienda, perche' quel ruolo, perche' adesso. Nessuna delle tre e' facoltativa.",
        ],
        bullets: [
          "Italia: sobrio, dati, disponibilita'",
          "Europa: espliciti sul perimetro del ruolo e sulla lingua",
          "USA: tre righe di motivazione specifica, nessuna ripetizione del CV",
        ],
      },
      {
        id: "email",
        heading: "4. L'email che accompagna la lettera",
        paragraphs: [
          "L'oggetto decide se l'email viene aperta: nome, ruolo, riferimento all'annuncio, niente frasi generiche. Il corpo contiene la lettera in tre o quattro paragrafi brevi, non un allegato da aprire.",
          "Se invii il CV in allegato, il nome del file deve essere leggibile: nome cognome, ruolo, azienda. Un file chiamato cv.pdf costringe chi riceve a indovinare di chi si tratta.",
        ],
      },
    ],
    checklist: [
      "Prima riga con ruolo e nome dell'azienda",
      "Almeno un risultato con numero",
      "Massimo 200 parole",
      "Nessuna frase copiabile su un'altra azienda",
      "Oggetto dell'email con ruolo e riferimento all'annuncio",
      "File del CV con nome leggibile nel formato nome-cognome-ruolo-azienda",
    ],
    faq: [
      {
        q: "La cover letter e' obbligatoria in Italia?",
        a:
          "No. Nella maggior parte delle candidature non viene richiesta e inviare un documento in piu' senza che sia chiesto aggiunge lavoro a chi riceve. Quando e' richiesta nell'annuncio, e' il segnale che leggono.",
      },
      {
        q: "Poszo allegarla in PDF?",
        a:
          "Si', e per la mail in un messaggio normale il formato testo e' spesso preferibile, perche' resta ricercabile e non introduce problemi di impaginazione. Il PDF ha senso solo se la richiesta e' esplicita.",
      },
    ],
    sources: [],
    related: ["cv-senza-esperienza", "colloqui-star"],
    publishedAt: "2026-08-30",
    updatedAt: "2026-09-30",
  },

  {
    slug: "negoziazione-ral",
    title: "Negoziare la RAL: quando e come chiederla",
    excerpt:
      "Timing, script e leve. Perche' si negozia solo a posteriori dell'offerta scritta e cosa dire nei primi due minuti.",
    metaDescription:
      "Guida alla negoziazione della retribuzione in Italia ed Europa: quando chiedere, come impostare la conversazione, script email e leve oltre la RAL.",
    category: "stipendi",
    intro:
      "La negoziazione non e' il momento in cui chiedi 'quanto guadagno', e' il momento in cui spieghi come stai usando il tempo e cosa ti mancherebbe per fare di piu'. Detto questo, il timing conta piu' della forma, e sbagliarlo costa piu' che sbagliare le parole.",
    sections: [
      {
        id: "timing",
        heading: "1. Timing: mai prima dell'offerta scritta",
        paragraphs: [
          "Fino a quando non hai un'offerta scritta, la tua posizione negoziale e' debole: stai ipotizzando, loro stanno valutando. Negoziare in quel momento significa dare un segnale che potrebbe abbassare l'offerta invece di alzarla.",
          "Il momento giusto e' alla consegna dell'offerta, e il momento successivo e' alla scadenza del preavviso. Prima dell'offerta si parla di aspettative di compenso, che sono una cosa diversa: si dichiara la fascia cercata, non la si negozia.",
        ],
        bullets: [
          "Prima dell'offerta: dichiara la fascia cercata, non negoziare",
          "Alla consegna dell'offerta scritta: qui si apre",
          "Alla scadenza del preavviso: e' l'ultimo momento utile",
        ],
      },
      {
        id: "script",
        heading: "2. Apertura: gratitudine, dati, proposta",
        paragraphs: [
          "L'apertura ha tre parti. Gratitudine per la fiducia, che non e' cavalleria. Poi i dati: la tua esperienza rilevante e la fascia che ti risulta coerente con quel ruolo. Poi la proposta concreta, formulata come richiesta e non come ultimatum.",
          "'Non posso accettare' e' una posizione debole. 'Sono motivato a firmare, su questo vorrei ragionare' e' una posizione che apre una conversazione.",
        ],
        example: {
          label: "Apertura in tre parti",
          before:
            "Ho ricevuto l'offerta. Purtroppo il compenso non e' in linea con le mie aspettative, quindi preferirevo rifiutare.",
          after:
            "Grazie per l'offerta, sono motivato dal progetto. Il ruolo copre bene la mia esperienza: negli ultimi 4 anni ho gestito il[lareostesso problema] con risultati concreti.\n\nIl compenso proposto e' sotto la fascia che valuto per questo perimetro. Le chiedo se c'e' margine per portarlo a 48.000 euro.",
          note: "Stessa decisione di rinunciare, ma una conversazione aperta.",
        },
      },
      {
        id: "leve",
        heading: "3. Le leve oltre il numero",
        paragraphs: [
          "Il denaro non e' l'unica variabile, ed e' spesso quella meno negoziabile al primo giro. Le leve piu' efficaci sono la modalita' di lavoro, la frequenza delle riunioni, il ruolo di tutoraggio, la data di inizio e la scadenza della proposta.",
          "Vale la pena sapere cosa vale davvero per te: e' inutile trattare la proprieta' del pc se per te il vero costo e' il tragitto. Tratta quello che ti pesa, e chiedi quello che ti serve.",
        ],
        bullets: [
          "Modalita': remoto, ibrido con giorni definiti",
          "Perimetro: responsabilita' reali oltre al titolo",
          "Tempo: date di ferie e formazione",
          "Scadenza: il tempo necessario per valutare davvero",
        ],
      },
      {
        id: "chiusura",
        heading: "4. Chiusura: dai dati, non dall'umore",
        paragraphs: [
          "Il momento in cui la trattativa si chiude e' quello dei benchmark. Un numerico verificabile e condiviso vale piu' di qualunque argomento sul valore del mercato, che resta un'opinione.",
          "Le fasce che vedi nella pagina Stipendi derivano dagli annunci verificati del Career Market e puoi aprire ognuno di quelli per vedere la fonte. Un dato che puo' ispezionare vale piu' di una stima ricordata.",
        ],
      },
    ],
    checklist: [
      "Aspettative di compenso dichiarate PRIMA dell'offerta",
      "Negoziazione aperta solo con l'offerta scritta",
      "Apertura in tre parti: gratitudine, dati, proposta",
      "Almeno una leva non economica pronta",
      "Benchmark presi da fonti apribili, non da ricordi",
      "Scadenza chiesta se ti serve tempo",
    ],
    faq: [
      {
        q: "Posso chiedere piu' di quanto indicato nell'annuncio?",
        a:
          "Si'. La fascia in annuncio indica il budget previsto, non un tetto. La domanda concreta e' se il ruolo offre un perimetro superiore a quello di chi era in posizione prima: se e' cosi', il motivo per rivedere la cifra c'e'.",
      },
      {
        q: "Se dicono che il budget e' fissato?",
        a:
          "Allora la leva si sposta: modalita', ruolo, benefit, scadenza. Chiedere due volte il numero quando la risposta e' no e' contrario a quello che hai appena detto tu su non insistere, e chi ascolta se ne accorge.",
      },
    ],
    sources: [],
    related: ["colloqui-star", "tailoring-jd"],
    publishedAt: "2026-09-25",
    updatedAt: "2026-10-06",
  },

  {
    slug: "colloqui-star",
    title: "Colloqui in stile STAR: rispondere con struttura",
    excerpt:
      "Situazione, Task, Azione, Risultato. Come usare lo schema STAR e cosa succede quando salti uno dei quattro passaggi.",
    metaDescription:
      "Metodo STAR per i colloqui comportamentali: le quattro fasi, esempi di risposte deboli e forti, e gli errori che fanno perdere il punto.",
    category: "colloqui",
    intro:
      "Il metodo STAR esiste perche' i colloquatori hanno bisogno di valutare il processo, non solo il risultato. Una risposta che arriva subito al risultato sembra convincente ma non dimostra nulla, perche' chi ascolta non sa come ci sei arrivato.",
    sections: [
      {
        id: "schema",
        heading: "1. Le quattro fasi, in ordine",
        paragraphs: [
          "Situazione: il contesto in due frasi. Dove, quando, perche'. Se il contesto si diluisce per tre minuti l'interlocutore si perde, e la fase successiva non ha piu' senso.",
          "Task: il problema specifico che era tuo. Non il team's, tuo. Poi l'Azione: cosa hai fatto tu, in ordine, con il perche' delle scelte. E infine il Risultato, con il numero.",
        ],
        bullets: [
          "Situazione: due frasi, il contesto",
          "Task: il problema tuo, in una frase",
          "Azione: cosa hai fatto e perche', in ordine",
          "Risultato: il numero, se esiste",
        ],
      },
      {
        id: "debole",
        heading: "2. Cosa rende debole una risposta",
        paragraphs: [
          "La risposta debole parte dal risultato e torna indietro, o usa il 'noi' per nascondere il proprio contributo. 'Abbiamo migliorato le conversioni del 22%' e' una frase che puo' dire chiunque: quello che interessa e' cosa hai deciso tu e cosa hai sacrificato per ottenerlo.",
          "Altra causa comune: la risposta troppo lunga. Tre minuti di risposta su una domanda da trenta secondi fanno perdere i minuti delle altre domande.",
        ],
        example: {
          label: "Stessa domanda, due risposte",
          before:
            "Siamo riusciti a migliorare le conversioni del 22% grazie a un lavoro di squadra sul funnel, con un progetto che ha coinvolto diverse persone e richiesto mesi di impegno.",
          after:
            "Situazione: il checkout aveva 4 passaggi e il 62% dei carrelli si abbandonava al secondo.\nTask: toccava a me ridurre l'abbandono senza alzare il tempo di pagamento.\nAzione: ho rimosso un passaggio e reso opzionale la creazione account, testando 3 varianti per due settimane.\nRisultato: abbandono dal 62% al 44%, conversione su 12.000 carrelli nel periodo di test.",
          note: "Stesso fatto raccontato. La prima versione non e' verificabile.",
        },
      },
      {
        id: "preparazione",
        heading: "3. Preparazione: sei storie coprono il 90% delle domande",
        paragraphs: [
          "Non imparare risposte a singole domande: prepara sei storie e sappi raccontarle da tre angolazioni diversi. Conflitto con un collega, un errore che ha insegnato qualcosa, un risultato che ha sorpreso, una scelta tecnica contestata, una deadline stretta, una persona che hai fatto crescere.",
          "Scrivile su carta. A voce racconti delle storie diverse ogni volta, e la versione migliore si perde. Con un foglio leggi la struttura, non il testo.",
        ],
        bullets: [
          "Sei storie, non trenta risposte",
          "Tre angolazioni per ogni storia",
          "Scrivile: raccontare a voce cambia sempre qualcosa",
        ],
      },
      {
        id: "domande",
        heading: "4. Le domande che fai tu",
        paragraphs: [
          "Chiedere come misurano il successo del ruolo nei primi sei mesi e' la domanda piu' utile che puoi fare: dice che ti interessa il risultato, non solo la scrivania. Chiedere anche cosa sta andando storto e su cosa si vorrebbe un contributo mostra che pensi in modo strutturato.",
          "Una domanda di chiusura che funziona bene: quale e' la cosa che, se potessimo cambiarla, migliorerebbe questo lavoro nei prossimi sei mesi.",
        ],
      },
    ],
    checklist: [
      "Sei storie scritte, non pensate al momento",
      "Ogni storia raccontata in meno di 2 minuti",
      "Azione descritta al singolare: cosa hai fatto tu",
      "Risultato con un numero, o con un perimetro verificabile",
      "Una domanda sul modo in cui misurano il successo del ruolo",
      "Una domanda su cosa sta andando storto nel team",
    ],
    faq: [
      {
        q: "E se non ho un risultato numerico da citare?",
        a:
          "Non e' un problema se descrivi il perimetro in modo verificabile: 'su 12 clienti', 'ogni settimana', 'in due settimane'. Il numero e' la forma migliore di evidenza, non l'unica.",
      },
      {
        q: "Racconto anche i fallimenti?",
        a:
          "Si', e ti conviene: la domanda su un errore e' quasi sempre presente. Il formato e' identico, cambia la conclusione: cosa hai capito e cosa hai cambiato dopo. Un fallimento senza apprendimento e' solo un fallimento.",
      },
    ],
    sources: [],
    related: ["cover-letter-italia", "negoziazione-ral"],
    publishedAt: "2026-09-10",
    updatedAt: "2026-10-04",
  },

  {
    slug: "cv-senza-esperienza",
    title: "CV senza esperienza: cosa scrivere al posto delleesperienze",
    excerpt:
      "Primi lavori, stage, gap o cambiamento di campo: come costruire un CV credibile quando il reparto esperienze e' vuoto.",
    metaDescription:
      "Come scrivere un CV quando non hai ancora esperienza lavorativa: cosa mettere al posto delle esperienze, come valorizzare progetti e formazione, con esempi.",
    category: "cv",
    intro:
      "Un CV senza esperienza non e' un CV vuoto: e' un documento che piu' di tutti deve dimostrare che sai fare qualcosa. Il reparto esperienze si riempie di progetti, formazione e lavoro non pagato, ma solo se sono reali e raccontati con lo stesso taglio di chi ha un lavoro da tre anni.",
    sections: [
      {
        id: "struttura",
        heading: "1. Sposta il peso sulla sezione giusta",
        paragraphs: [
          "Quando non hai esperienza lavorativa, il CV deve dire prima cosa sai fare. Il ruolo, le tecnologie e la disponibilita' vanno nelle prime righe, prima che chi legge incontri un reparto vuoto e perda attenzione.",
          "La formazione va trattata come esperienza: un corso con progetto finale, una tesi, un tirocinio sono esperienze se hai prodotto qualcosa di verificabile.",
        ],
        bullets: [
          "Ruolo e stack nelle prime due righe",
          "Formazione con progetto, non solo il titolo del corso",
          "Tirocinio e stage raccontati come esperienze reali",
        ],
      },
      {
        id: "progetti",
        heading: "2. I progetti valgono piu' di un corso",
        paragraphs: [
          "Un corso finito dice che hai seguito qualcuno; un progetto dice cosa sai fare. Due progetti personali ben descritti pesano piu' di dieci certificazioni, perche' sono la prova che sai trasformare un requisito in qualcosa che funziona.",
          "Vale anche il lavoro non pagato: volontariato, associazioni, progetti di team scolastici o universitari. Se c'e' stato un impegno reale, si racconta come impegno reale.",
        ],
        example: {
          label: "Corso vs progetto, stessa persona",
          before: "Corso di JavaScript e React, 40 ore.",
          after:
            "Applicazione di lista della spesa in React e TypeScript, 6 settimane.\nHo costruito il componente di riepilogo con test, poi ho aggiunto la sincronizzazione fra schede aperte con IndexedDB.",
          note: "La riga lunga dimostra piu' del nome del corso.",
        },
      },
      {
        id: "gap",
        heading: "3. Un gap non e' una colpa, ma va spiegato",
        paragraphs: [
          "Un intervallo di sei mesi o un anno nella tua timeline non e' automaticamente un problema: lo diventa quando si presenta da solo, senza spiegazione, e lascia allo chi legge il compito di indovinare.",
          "Una riga che dice cosa hai fatto in quel periodo, se qualcosa hai fatto, scioglie l'ambiguità. Se non hai fatto nulla di produttivo, non e' un problema: molte persone hanno periodi cosi' e il mercato del lavoro li conosce.",
        ],
        bullets: [
          "Una riga di contesto per ogni intervallo lungo",
          "Se hai studiato, ditto: corso, esame, progetto",
          "Se hai lavorato in modo informale, raccontalo come lavoro",
        ],
      },
      {
        id: "invito",
        heading: "4. Chiedi di vedere il lavoro, non descriverlo",
        paragraphs: [
          "In una candidatura junior hai meno spazio per dimostrare: la tua leva e' la riduzione dell'incertezza. Un link a un repository, a una demo o a un deploy e' l'unico modo per far valutare il tuo lavoro reale prima del colloquio.",
          "Lo stesso vale al colloquio: porta il progetto aperto sul tavolo. Un candidato junior che spiega per due minuti un problema che ha risolto vale piu' di dieci candidati che descrivono un corso.",
        ],
      },
    ],
    checklist: [
      "Ruolo e tecnologie nelle prime righe del CV",
      "Almeno due progetti reali con una riga di risultato ciascuno",
      "Lavoro di volontariato o stage raccontato come esperienza",
      "Ogni intervallo lungo ha una riga di contesto",
      "Link a repository, demo o deploy del lavoro",
    ],
    faq: [
      {
        q: "Non ho progetti: e' un problema?",
        a:
          "Non e' un blocco, ma ti lascia meno spazio per dimostrare. Se hai tempo, un progetto piccolo e finito vale piu' di un corso intero, e non richiede mesi: due settimane per qualcosa di funzionante sono un buon inizio.",
      },
      {
        q: "Meglio un master o un progetto?",
        a:
          "Dipende dal ruolo. Per i ruoli che richiedono la laurea, il master e' il percorso. Per i ruoli dove conta sapere fare, un progetto che dimostra lavoro reale ha piu' peso di un altro titolo.",
      },
    ],
    sources: [],
    related: ["cv-ats-2026", "prima-lettera-ruolo"],
    publishedAt: "2026-09-18",
    updatedAt: "2026-10-02",
  },

  {
    slug: "prima-lettera-ruolo",
    title: "Il primo contatto con un'azienda",
    excerpt:
      "Come presentarsi quando non esiste un annuncio: struttura, lunghezza e l'errore che chiude la porta.",
    metaDescription:
      "Scrivere a un'azienda senza annuncio: struttura del messaggio, come dimostrare che hai letto il loro lavoro e cosa evitare assolutamente.",
    category: "cover-letter",
    intro:
      "Scrivere a un'azienda che non ti ha cercato funziona, ma solo se dimostri che hai guardato cosa fa. Il contatto spontaneo ha percentuali basse per definizione: la differenza la fa la qualita' della preparazione, non il volume di invii.",
    sections: [
      {
        id: "struttura",
        heading: "1. Cinque righe, non cinque pagine",
        paragraphs: [
          "Primo blocco: chi sei e per che' ruolo scrivi. Secondo: una cosa di specifica che hai guardato di loro, che dimostra che non hai inviato lo stesso testo a trenta aziende. Terzo: che cosa sai fare, con un risultato.",
          "Poi la disponibilita' e l'azione richiesta. Chiudi chiedendo una conversazione breve, non offrendoti come risorsa gratuita.",
        ],
        bullets: [
          "Chi sei e per che' ruolo, in una riga",
          "Una cosa specifica sul loro lavoro",
          "Un risultato tuo, con un numero",
          "Disponibilita' e prossimo passo",
        ],
      },
      {
        id: "personalizzazione",
        heading: "2. Il pezzo specifico e' l'unico che conta",
        paragraphs: [
          "Il motivo per cui il contatto spontaneo viene ignorato e' che si vede subito che e' una massa. Quel pezzo specifico puo' essere un loro prodotto che hai usato, una conferenza che hanno tenuto, un loro annuncio di lavoro che hai letto.",
          "Se non hai nulla di specifico da dire, valuta se il contatto e' davvero utile. Una mail senza un motivo concreto per cui scrivi a loro non ha una risposta attesa.",
        ],
        example: {
          label: "Prima riga, due versioni",
          before: "Sono un frontend developer e vorrei lavorare da voi.",
          after:
            "Ho usato [prodotto] per [uso concreto] e mi sono fermato su come gestisce [problema tecnico]. Vi scrivo per il ruolo di frontend.",
          note: "La seconda riga dimostra che hai guardato il loro lavoro prima di scrivere.",
        },
      },
      {
        id: "offerta",
        heading: "3. Non offrirti come manodopera gratis",
        paragraphs: [
          "Chiedere un tirocinio non retribuito a un'azienda che non ti ha assunto e' una richiesta che nella maggior parte dei casi si conclude con un no, e lascia un'impressione peggiore di nessun contatto.",
          "Se sei agli inizi, il percorso corretto e' candidarti a un annuncio che esiste e dimostrare li' il tuo lavoro. Se invece cerchi una conversazione per capire se esiste un ruolo adatto a te, chiedi quello: e' una domanda legittima, e la risposta ti dice di non insistere.",
        ],
      },
      {
        id: "canale",
        heading: "4. Il canale conta piu' del testo",
        paragraphs: [
          "Una mail all'indirizzo generico arriva in una casella che nessuno controlla. Il contatto diretto con la persona che lavora sull'argomento che ti interessa arriva. Cerca chi segue il tema: un loro intervento, un articolo, una conferenza.",
          "Sul social professionale il messaggio privato ha un tasso di risposta piu' alto della mail, perche' passa da una persona che ti ha gia' visto. Due righe, un punto specifico, una domanda.",
        ],
      },
    ],
    checklist: [
      "Massimo 150 parole",
      "Un elemento specifico sul lavoro dell'azienda",
      "Un risultato tuo con un numero",
      "Disponibilita' e prossimo passo espliciti",
      "Nessuna richiesta di lavoro non retribuito",
    ],
    faq: [
      {
        q: "Conviene mandare la stessa mail a piu' aziende?",
        a:
          "No, e il motivo e' tecnico piu' che etico: il pezzo specifico e' l'unica riga che rende credibile il messaggio. Senza di esso il testo si riduce a 'vi scrivo per lavorare da voi', che e' filtrato prima di essere letto.",
      },
      {
        q: "Se non rispondono, e' il mio CV il problema?",
        a:
          "Non puoi saperlo, ed e' il motivo per cui il contatto spontaneo va trattato come un esperimento: invia 10 messaggi personalizzati, misura le risposte, e valuta se vale la pena insistere su quel canale.",
      },
    ],
    sources: [],
    related: ["cover-letter-italia", "cv-senza-esperienza"],
    publishedAt: "2026-09-20",
    updatedAt: "2026-10-03",
  },

  {
    slug: "keyword-tailoring-ats",
    title: "Keyword nel CV: quanto basta e dove metterle",
    excerpt:
      "Le keyword non sono un trucco: sono il vocabolario dell'azienda. Come sceglierle, dove scriverle e cosa succede se ne esageri.",
    metaDescription:
      "Come usare le keyword dell'offerta nel CV senza riempirlo di sinonimi: quante sceglierne, dove posizionarle e gli errori da evitare.",
    category: "ats",
    intro:
      "Le keyword sono il termine con cui l'azienda descrive il lavoro che vuoi fare. Il tuo CV parla un altro dialetto: stesso lavoro, parole diverse. Il lavoro di matching e' tradurre, non ripetere.",
    sections: [
      {
        id: "quante",
        heading: "1. Quante keyword servono, davvero",
        paragraphs: [
          "Non c'è un numero, c'e' una regola: le keyword che descrivono il tuo lavoro in modo specifico. Un annuncio reale ne contiene 8-12 relevanti, ma la maggior parte dei candidati non ne usa nessuna e altri ne usano trenta a caso.",
          "La prova che hai usato la keyword giusta e' che sai raccontare un progetto in cui quella tecnica serviva. Se la risposta a 'perche' quella keyword' e' 'perche' c'era nell'annuncio', hai sbagliato target.",
        ],
        bullets: [
          "8-12 keyword per un annuncio tecnico reale",
          "Solo quelle che descrivono un tuo lavoro specifico",
          "Sigla e forma estesa almeno una volta",
        ],
      },
      {
        id: "dove",
        heading: "2. Dove metterle perche' il parser le trovi",
        paragraphs: [
          "Il parser legge in ordine e le keyword contano di piu' dove compaiono con contesto. Le zone efficaci sono: la riga di ruolo sotto il nome, il titolo dell'esperienza piu' rilevante, il primo rigo della sezione competenze, i titoli dei progetti.",
          "Una keyword sepolta in un paragrafo di prosa e' contata, ma non aiuta il giudizio di chi legge: il vantaggio delle keyword e' anche quello di far capire in tre secondi di cosa ti occupi.",
        ],
        example: {
          label: "Stesse keyword, due posizioni",
          before:
            "Competenze varie.\n\nSviluppatore con esperienza in progetti web, mi sono occupato di varie cose tra cui anche la parte di database.",
          after:
            "Frontend Engineer — React, TypeScript, GraphQL.\n\nSviluppatore con esperienza in PostgreSQL e REST API.",
          note: "Il contenuto non e' cambiato: e' cambiato dove stanno le informazioni.",
        },
      },
      {
        id: "sinonimi",
        heading: "3. Sinonimi e varianti: due parole, non dieci",
        paragraphs: [
          "Le offerte usano lo stesso concetto con parole diverse: 'frontend' e 'front-end', 'machine learning' e 'ML'. Coprire le varianti principali richiede due parole, non dieci: la terza variante e' rumore che diluisce la sezione.",
          "Il caso diverso e' quando il sinonimo indica una competenza diversa: 'Data Scientist' e 'Data Analyst' non sono la stessa offerta, e trattarli come sinonimi fa sembrare il CV piu' ampio di quanto sia.",
        ],
      },
      {
        id: "verifica",
        heading: "4. Verifica se le stai usando davvero",
        paragraphs: [
          "Il modo piu' rapido per controllare il lavoro di matching e' consegnare il CV all'analisi e guardare le keyword mancanti che restituisce. Il confronto e' fra il tuo documento e l'offerta, non con un'opinione.",
          "Se le keyword mancanti sono termini che non sai usare, il problema non e' il CV: e' che stai valutando un ruolo che richiede qualcosa che non hai ancora. In quel caso la risposta non e' aggiungere la parola.",
        ],
      },
    ],
    checklist: [
      "8-12 keyword scelte dall'annuncio",
      "Ogni keyword descrive un lavoro reale tuo",
      "Keyword anche nel titolo del ruolo e nella sezione competenze",
      "Varianti principali coperte senza elencare sinonimi infiniti",
      "Nessuna keyword aggiunta che non sai spiegare",
    ],
    faq: [
      {
        q: "Quante keyword sono troppe?",
        a:
          "Dopo il punto in cui ripeti concetti gia' detti. Su un annuncio reale, dodici keyword ben distribuite coprono la parte tecnica; quaranta indicano un CV scritto per il filtro, che e' esattamente l'opposto di quello che serve.",
      },
      {
        q: "Le skill manageriale valgono?",
        a:
          "Si', se sono dimostrate. 'Gestione di un team di 6' e' una keyword concreta; 'leadership' da sola non dice nulla e occupa una riga. Vale la regola di sempre: la keyword deve poter essere seguita da un esempio.",
      },
    ],
    sources: [],
    related: ["cv-ats-2026", "tailoring-jd"],
    publishedAt: "2026-09-22",
    updatedAt: "2026-10-05",
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export const guideCategoryLabels: Record<GuideCategory, string> = {
  cv: "CV",
  ats: "ATS",
  "cover-letter": "Cover letter",
  colloqui: "Colloqui",
  stipendi: "Stipendi",
};

/** Tempo di lettura calcolato sul testo reale, non dichiarato a mano. */
export function guideReadMinutes(guide: Guide): number {
  const words =
    guide.intro.split(/\s+/).length +
    guide.sections.reduce(
      (total, section) =>
        total +
        section.paragraphs.join(" ").split(/\s+/).length +
        (section.example?.before ?? "").split(/\s+/).length +
        (section.example?.after ?? "").split(/\s+/).length +
        (section.bullets ?? []).join(" ").split(/\s+/).length,
      0
    );

  return Math.max(1, Math.round(words / 200));
}