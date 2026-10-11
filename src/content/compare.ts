import type { ComparePlan, CompareRow } from "./types";

/**
 * Confronto con i builder generici, non con prodotti nominati.
 *
 * Non facciamo affermazioni su strumenti di terzi che non possiamo
 * verificare: la colonna "generico" descrive il comportamento tipico
 * dichiarato nelle pagine di vendita dei builder, e ogni cella porta il
 * dettaglio di cosa significa. Dove non sappiamo, lo diciamo.
 */
export const compareRows: CompareRow[] = [
  {
    feature: "Score ATS 0-100 con la prova di ogni penalita'",
    category: "ats",
    curriculuxe: {
      value: "yes",
      detail:
        "Ogni punto di score e' accompagnato dal frammento di CV che lo genera: si vede perche' e' stato tolto un punto.",
    },
    generic: {
      value: "unknown",
      detail:
        "Molti builder mostrano uno score senza mostrarne il calcolo: non e' verificabile dall'esterno quale sia il metodo.",
    },
  },
  {
    feature: "Tailoring con diff e approvazione esplicita",
    category: "tailoring",
    curriculuxe: {
      value: "yes",
      detail:
        "Il CV originale non viene mai modificato: vedi il diff e approvi. Ogni modifica e' reversibile.",
    },
    generic: {
      value: "partial",
      detail:
        "La riscrittura e' di norma immediata e sovrascrive il testo senza mostrare un confronto.",
    },
  },
  {
    feature: "Nessuna invenzione di esperienza",
    category: "tailoring",
    curriculuxe: {
      value: "yes",
      detail:
        "Ogni affermazione generata e' agganciata a un frammento del CV di partenza; le competenze non presenti non possono essere aggiunte.",
    },
    generic: {
      value: "unknown",
      detail:
        "Dipende dall'implementazione del singolo prodotto e non e' dichiarato nelle pagine commerciali.",
    },
  },
  {
    feature: "Career Market pubblico senza login",
    category: "mercato",
    curriculuxe: {
      value: "yes",
      detail: "Gli annunci verificati si consultano, filtrano e condividono anche da anonimi.",
    },
    generic: {
      value: "no",
      detail: "Il mercato e' normalmente dentro l'area riservata: serve un account per vedere le offerte.",
    },
  },
  {
    feature: "Annunci con fonte e data di controllo",
    category: "mercato",
    curriculuxe: {
      value: "yes",
      detail:
        "Ogni annuncio espone la fonte e la data dell'ultimo controllo, e il catalogo e' deduplicato.",
    },
    generic: {
      value: "unknown",
      detail: "Nessun builder dichiara pubblicamente fonte e data di controllo.",
    },
  },
  {
    feature: "Nessun invio massivo di candidature",
    category: "trasparenza",
    curriculuxe: {
      value: "yes",
      detail:
        "Nessuna funzione invia candidature al posto tuo: il prodotto prepara e tu invii. Vale anche per il simulatore di negoziazione.",
    },
    generic: {
      value: "partial",
      detail:
        "Alcuni tool integrano l'invio automatico: utile per il volume, scomodo se il recruiter risponde.",
    },
  },
  {
    feature: "Agente MCP per ChatGPT e Claude",
    category: "trasparenza",
    curriculuxe: {
      value: "yes",
      detail:
        "Server MCP (Streamable HTTP): lettura su Free, scrittura sui piani a pagamento e sempre con approvazione esplicita.",
    },
    generic: {
      value: "no",
      detail: "Nessun builder generico espone un server MCP.",
    },
  },
  {
    feature: "Dati del CV non usati per addestrare modelli",
    category: "trasparenza",
    curriculuxe: {
      value: "yes",
      detail:
        "Il testo inviato serve solo a produrre il risultato richiesto e puoi chiederne la cancellazione completa.",
    },
    generic: {
      value: "unknown",
      detail:
        "Le condizioni sui dati cambiano per prodotto: va lette caso per caso e non sono confrontabili.",
    },
  },
];

export const comparePlanRows: ComparePlan[] = [
  {
    plan: "Free",
    price: "0 €",
    curriculuxe: "Score ATS, 3 crediti AI, template e Career Market",
    generic: "Score e riscrittura di base, mercato in area riservata",
  },
  {
    plan: "Starter",
    price: "4,99 €/mese",
    curriculuxe: "50 crediti AI al mese, tailorings illimitati, cover letter",
    generic: "Rinnovo mensile, crediti variabili per prodotto",
  },
  {
    plan: "Pro",
    price: "6,99 €/mese",
    curriculuxe: "500 crediti AI, simulazione colloqui, server MCP in scrittura",
    generic: "Funzionalita' premium a listino, spesso piu' alte",
  },
  {
    plan: "Enterprise",
    price: "9,99 €/mese",
    curriculuxe: "2000 crediti AI, onboarding guidato, supporto",
    generic: "Non previsto nella maggior parte dei builder",
  },
];

export const compareHonesty: { title: string; body: string }[] = [
  {
    title: "Non siamo un generatore di CV da zero a partire da zero",
    body:
      "Curriculuxe parte da quello che sai davvero e lo rende leggibile. Se vuoi un CV da inventare, non e' lo strumento giusto: rischieresti di portare in colloquio cose che non sai raccontare.",
  },
  {
    title: "Non c'è il pulsante 'invia a 200 aziende'",
    body:
      "Il mass apply e' il modo piu' rapido per farsi ignorare da tutti. Prepariamo la candidatura, decidi tu quando e a chi inviarla.",
  },
  {
    title: "Non siamo un recruiter e non facciamo colloqui per te",
    body:
      "Nessun prodotto puo' negoziare al posto tuo. Prepariamo la trattativa, la conduci tu: il simulatore serve a farcela prima, non al posto tuo.",
  },
  {
    title: "Non garantiamo il passaggio di un filtro automatico",
    body:
      "Uno score alto riduce il rischio di scarto automatico, non lo azzera. Nessuno strumento puo' garantire l'esito di un filtro che non controlliamo.",
  },
];

export const compareFaq: { q: string; a: string }[] = [
  {
    q: "Curriculuxe e' davvero diverso da un generatore di CV con intelligenza artificiale?",
    a:
      "Il generatore produce testo. Curriculuxe mantiene l'evidenza: ogni modifica al CV e' accompagnata dal frammento che la giustifica, ogni penalita' dello score mostra il testo che l'ha generata e il tailoring non scrive mai sull'originale senza approvazione.",
  },
  {
    q: "Perche' non mettete in tabella gli altri builder?",
    a:
      "Perche' non possiamo verificare in continuazione cosa offre ciascun prodotto. Un confronto che invecchia in tre mesi peggiora la decisione di chi legge, quindi descriviamo il comportamento tipico dichiarato nelle pagine di vendita e segnaliamo sempre quando non sappiamo.",
  },
  {
    q: "Quanto costa usare le funzioni AI?",
    a:
      "Ogni funzione AI consuma un credito. Free include 3 crediti di prova, Starter 50 al mese, Pro 500, Enterprise 2000. La lista dei crediti resta visibile nella dashboard.",
  },
  {
    q: "Posso usare Curriculuxe se sono gia' iscritto a un altro tool?",
    a:
      "Si': il tuo CV resta tuo e puoi esportarlo in PDF, DOC o TXT quando vuoi. Nessun formato proprietario che ti blocca.",
  },
  {
    q: "I miei dati finiscono in mano a terzi?",
    a:
      "Il CV e' salvato su un database europeo. Il testo inviato al modello serve solo a produrre il risultato richiesto e non viene usato per addestrare modelli pubblici. Puoi chiedere accesso o cancellazione completa scrivendo dalla pagina contatti.",
  },
  {
    q: "Curriculuxe invia candidature per me?",
    a:
      "No, in nessun caso e in nessun piano. Non esiste una funzione di invio automatico, nemmeno nel simulatore di negoziazione.",
  },
];

export const compareCategoryLabels: Record<CompareRow["category"], string> = {
  ats: "Analisi ATS",
  tailoring: "Tailoring e scrittura",
  mercato: "Ricerca lavoro",
  trasparenza: "Trasparenza",
};