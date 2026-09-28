import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termini di Servizio | Curriculuxe",
  description:
    "Termini di utilizzo di Curriculuxe: servizio offerto, account, piani e crediti AI, pagamenti, uso corretto, proprietà intellettuale e limitazioni di responsabilità.",
};

const CONTACT_EMAIL = "gabriele.forestieri0912@gmail.com";

export default function TermsPage() {
  return (
    <main className="min-h-screen gradient-bg-animated px-6 py-24">
      <div className="max-w-3xl mx-auto glass-card rounded-2xl p-8 border border-white/10">
        <Link href="/" className="text-sm text-indigo-300 hover:text-indigo-200">
          Torna alla home
        </Link>
        <h1 className="text-4xl font-bold text-white mt-6 mb-4">Termini di Servizio</h1>
        <p className="text-zinc-400 mb-8">
          Ultimo aggiornamento: 28 settembre 2026. Utilizzando Curriculuxe
          (&quot;Servizio&quot;) accetti questi Termini. Se non li accetti, non usare
          la piattaforma.
        </p>

        <div className="space-y-6 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">1. Servizio offerto</h2>
            <p>
              Curriculuxe è una piattaforma che aiuta a creare, analizzare e
              ottimizzare curriculum e materiali di candidatura tramite modelli,
              analisi di compatibilità ATS, intelligenza artificiale, simulazioni di
              colloquio e strumenti di ricerca lavoro. Il Servizio è fornito
              &quot;così com&apos;è&quot; e in continuo miglioramento: funzioni e piani
              possono evolvere nel tempo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">2. Account e requisiti</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Devi avere almeno 16 anni e fornire dati veritieri in registrazione.</li>
              <li>Puoi registrarti con email e password oppure con Google OAuth.</li>
              <li>Sei responsabile della riservatezza delle credenziali e di ogni attività svolta con il tuo account.</li>
              <li>Un account per persona: è vietato condividere, vendere o trasferire l&apos;account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">3. Piani, crediti AI e pagamenti</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Il piano gratuito include una dotazione limitata di crediti di prova.</li>
              <li>Ogni funzionalità AI (analisi CV, generazione CV, riscrittura bullet, summary, feedback colloqui) consuma 1 credito per gli utenti autenticati.</li>
              <li>I piani a pagamento (Starter, Pro, Enterprise) e le ricariche una tantum accreditano i crediti indicati al checkout; i crediti dei piani in abbonamento si rinnovano a ogni ciclo di fatturazione.</li>
              <li>I pagamenti sono elaborati da Stripe: condizioni, rinnovi e disdette seguono quanto mostrato al checkout. La disdetta ha effetto dal ciclo successivo e non rimborsa il periodo in corso, salvo quanto previsto dalla legge.</li>
              <li>Diritto di recesso: per i consumatori si applicano le tutele del Codice del Consumo, con le eccezioni per i contenuti digitali già fruiti.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">4. Contenuti dell&apos;utente e responsabilità</h2>
            <p>
              Resti titolare dei CV e dei contenuti che carichi. Concedi a Curriculuxe
              la sola licenza tecnica necessaria per memorizzarli, analizzarli ed
              esportarli per tuo conto. Sei responsabile dell&apos;accuratezza dei
              dati inseriti, del rispetto dei diritti di terzi e dell&apos;uso dei
              documenti generati (inclusa la veridicità verso i datori di lavoro).
              Non caricare contenuti illeciti, riservati senza autorizzazione o in
              violazione di norme e diritti altrui.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">5. Uso corretto e limiti</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Vietati: invio massivo automatizzato di candidature (spam-apply), scraping, reverse engineering, aggiramento di limiti tecnici o dei crediti, compromissione della sicurezza del Servizio.</li>
              <li>Possiamo sospendere o chiudere account in caso di violazioni, abusi o mancati pagamenti, con preavviso ove possibile.</li>
              <li>Puoi chiedere in qualsiasi momento la cancellazione dell&apos;account e dei dati associati scrivendo a{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-indigo-300 hover:text-indigo-200">
                  {CONTACT_EMAIL}
                </a>
                .
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">6. Intelligenza artificiale: limiti</h2>
            <p>
              I punteggi, i suggerimenti e i testi generati dall&apos;AI sono supporti
              orientativi e possono contenere errori: verificali sempre prima
              dell&apos;invio. Non garantiamo assunzioni, colloqui o risultati
              professionali specifici. Non usare il Servizio per decisioni
              interamente automatizzate con effetti giuridici su terzi.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">7. Proprietà intellettuale</h2>
            <p>
              Marchio, interfaccia, testi, grafica e software della piattaforma
              restano di proprietà di Curriculuxe o dei rispettivi licenzianti. I
              documenti che generi a partire dai tuoi contenuti sono tuoi e puoi
              usarli liberamente per le tue candidature.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">8. Limitazione di responsabilità</h2>
            <p>
              Nei limiti consentiti dalla legge, Curriculuxe non risponde di danni
              indiretti, perdita di opportunità lavorative o conseguenze derivanti
              dall&apos;uso dei documenti generati o da interruzioni temporanee del
              Servizio (manutenzione, cause di forza maggiore, disservizi di terze
              parti come hosting, pagamenti o provider AI).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">9. Modifiche ai Termini</h2>
            <p>
              Possiamo aggiornare questi Termini pubblicando la nuova versione in
              questa pagina con la data di aggiornamento. L&apos;uso continuato del
              Servizio dopo modifiche sostanziali equivale ad accettazione; in caso
              contrario puoi cessare l&apos;uso e chiedere la cancellazione
              dell&apos;account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">10. Legge applicabile e contatti</h2>
            <p>
              Questi Termini sono regolati dalla legge italiana. Per controversie con
              i consumatori è competente il foro del consumatore. Per assistenza o
              segnalazioni scrivi a{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-indigo-300 hover:text-indigo-200">
                {CONTACT_EMAIL}
              </a>
              . L&apos;informativa sul trattamento dei dati è nella{" "}
              <Link href="/privacy" className="text-indigo-300 hover:text-indigo-200">
                Privacy Policy
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
