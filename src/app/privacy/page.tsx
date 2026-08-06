import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Applimix",
  description: "Informativa privacy di Applimix.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen gradient-bg-animated px-6 py-24">
      <div className="max-w-3xl mx-auto glass-card rounded-2xl p-8 border border-white/10">
        <Link href="/" className="text-sm text-indigo-300 hover:text-indigo-200">
          Torna alla home
        </Link>
        <h1 className="text-4xl font-bold text-white mt-6 mb-4">Privacy Policy</h1>
        <p className="text-zinc-400 mb-8">
          Ultimo aggiornamento: 3 maggio 2026. Questa pagina descrive come Applimix
          tratta i dati inseriti dagli utenti nella piattaforma.
        </p>

        <div className="space-y-6 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">Dati raccolti</h2>
            <p>
              Possiamo trattare dati account, dati di contatto, contenuti dei CV,
              job description, preferenze di template e informazioni tecniche necessarie
              al funzionamento del servizio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">Finalità</h2>
            <p>
              Usiamo i dati per creare, analizzare, ottimizzare ed esportare curriculum,
              generare materiali di candidatura, gestire account, pagamenti e sicurezza
              della piattaforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">CV e contenuti caricati</h2>
            <p>
              I CV possono contenere dati personali. L&apos;utente deve caricare solo
              contenuti di cui dispone e può richiedere cancellazione o aggiornamento
              dei dati secondo le funzionalità disponibili e la normativa applicabile.
            </p>
          </section>

          <section id="cookie">
            <h2 className="text-xl font-semibold text-white mb-2">Cookie</h2>
            <p>
              La piattaforma può usare cookie tecnici o strumenti equivalenti per login,
              sicurezza e preferenze. Eventuali cookie analitici o marketing richiederanno
              informativa e consenso dove necessario.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">Contatti</h2>
            <p>
              Per richieste privacy puoi contattare il team Applimix tramite i recapiti
              indicati nella piattaforma o nella documentazione commerciale.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
