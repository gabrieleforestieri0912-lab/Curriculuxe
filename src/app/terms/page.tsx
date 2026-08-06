import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termini di Servizio | Applimix",
  description: "Termini di utilizzo di Applimix.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen gradient-bg-animated px-6 py-24">
      <div className="max-w-3xl mx-auto glass-card rounded-2xl p-8 border border-white/10">
        <Link href="/" className="text-sm text-indigo-300 hover:text-indigo-200">
          Torna alla home
        </Link>
        <h1 className="text-4xl font-bold text-white mt-6 mb-4">Termini di Servizio</h1>
        <p className="text-zinc-400 mb-8">
          Ultimo aggiornamento: 3 maggio 2026. Utilizzando Applimix accetti questi
          termini e le regole d&apos;uso della piattaforma.
        </p>

        <div className="space-y-6 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">Servizio</h2>
            <p>
              Applimix fornisce strumenti per creare, analizzare e ottimizzare curriculum
              e materiali di candidatura. I suggerimenti prodotti non garantiscono assunzioni,
              colloqui o risultati professionali specifici.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">Responsabilità utente</h2>
            <p>
              L&apos;utente è responsabile dell&apos;accuratezza dei dati inseriti,
              dei contenuti caricati e dell&apos;uso dei documenti generati.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">Pagamenti</h2>
            <p>
              Eventuali piani a pagamento, rinnovi, cancellazioni e rimborsi seguono le
              condizioni mostrate al checkout e gestite tramite il provider di pagamento.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">Uso corretto</h2>
            <p>
              Non è consentito usare la piattaforma per caricare contenuti illeciti,
              violare diritti di terzi, aggirare limiti tecnici o compromettere sicurezza
              e disponibilità del servizio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">Modifiche</h2>
            <p>
              I termini possono essere aggiornati nel tempo. Le modifiche saranno pubblicate
              in questa pagina con indicazione della data di aggiornamento.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
