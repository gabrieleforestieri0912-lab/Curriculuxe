import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Curriculuxe",
  description:
    "Informativa privacy di Curriculuxe: quali dati raccogliamo (account, Google OAuth, CV, pagamenti), perché li usiamo, con chi li condividiamo e quali sono i tuoi diritti (GDPR).",
};

const CONTACT_EMAIL = "gabriele.forestieri0912@gmail.com";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen gradient-bg-animated px-6 py-24">
      <div className="max-w-3xl mx-auto glass-card rounded-2xl p-8 border border-white/10">
        <Link href="/" className="text-sm text-indigo-300 hover:text-indigo-200">
          Torna alla home
        </Link>
        <h1 className="text-4xl font-bold text-white mt-6 mb-4">Privacy Policy</h1>
        <p className="text-zinc-400 mb-8">
          Ultimo aggiornamento: 28 settembre 2026. Questa informativa descrive come
          Curriculuxe raccoglie, usa, condivide e protegge i dati personali degli
          utenti, ai sensi del Regolamento (UE) 2016/679 (GDPR).
        </p>

        <div className="space-y-6 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">1. Titolare del trattamento</h2>
            <p>
              Il titolare del trattamento dei dati è il team di Curriculuxe. Per
              qualsiasi richiesta relativa alla privacy (accesso, rettifica,
              cancellazione, opposizione) puoi scrivere a{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-indigo-300 hover:text-indigo-200">
                {CONTACT_EMAIL}
              </a>
              . Rispondiamo di norma entro 30 giorni.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">2. Dati che raccogliamo</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-white">Dati account:</strong> nome, indirizzo
                email e password (memorizzata solo in forma cifrata/hash) quando ti
                registri con email, oppure quando accedi con Google.
              </li>
              <li>
                <strong className="text-white">Dati da Google OAuth:</strong> se accedi
                con Google riceviamo esclusivamente i dati del profilo di base (nome,
                email, foto profilo e identificativo Google) tramite gli ambiti
                standard <code className="text-xs bg-white/10 px-1 rounded">openid</code>,{" "}
                <code className="text-xs bg-white/10 px-1 rounded">email</code> e{" "}
                <code className="text-xs bg-white/10 px-1 rounded">profile</code>.
                Non richiediamo e non accediamo a Gmail, Drive, Contatti o altri dati
                Google.
              </li>
              <li>
                <strong className="text-white">Contenuti dei CV e candidature:</strong>{" "}
                curriculum caricati o creati, esperienze, competenze, job description
                incollate, cover letter, feedback e cronologia delle analisi. Possono
                contenere dati personali: carica solo contenuti tuoi o per cui hai
                autorizzazione.
              </li>
              <li>
                <strong className="text-white">Dati di pagamento:</strong> piano
                sottoscritto, crediti AI e storico transazioni. I dati della carta
                sono trattati esclusivamente da Stripe durante il checkout: non li
                vediamo né li memorizziamo.
              </li>
              <li>
                <strong className="text-white">Dati tecnici:</strong> cookie tecnici
                (sessione di login firmata, preferenza di lingua), log di sicurezza e
                statistiche anonime di utilizzo (Vercel Analytics).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">3. Perché usiamo i dati (finalità e basi giuridiche)</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Fornire il servizio (creazione, analisi e ottimizzazione CV, simulazioni colloqui): esecuzione del contratto.</li>
              <li>Gestire account, autenticazione (inclusa Google OAuth) e sicurezza: esecuzione del contratto e legittimo interesse.</li>
              <li>Gestire abbonamenti, crediti AI e pagamenti: esecuzione del contratto e obblighi di legge.</li>
              <li>Inviare comunicazioni di servizio (es. conferme, avvisi sui feedback): legittimo interesse.</li>
              <li>Migliorare la piattaforma in forma aggregata e anonima: legittimo interesse.</li>
            </ul>
            <p className="mt-2">
              Non vendiamo i tuoi dati personali a terzi e non li usiamo per
              pubblicità comportamentale.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">4. Analisi AI: come vengono trattati i tuoi CV</h2>
            <p>
              Quando richiedi un&apos;analisi, una generazione o una riscrittura, il
              testo necessario (CV, job description, risposte alle simulazioni) viene
              trasmesso al nostro fornitore di intelligenza artificiale
              (infrastruttura compatibile OpenAI) esclusivamente per produrre il
              risultato richiesto. I contenuti non vengono usati per addestrare
              modelli pubblici né condivisi con altri utenti. Le analisi salvate
              restano nel tuo storico personale finché non le elimini.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">5. Con chi condividiamo i dati</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-white">Supabase</strong> (database PostgreSQL): memorizzazione di account, CV, analisi e pagamenti.</li>
              <li><strong className="text-white">Vercel</strong> (hosting e analytics anonime): erogazione del sito.</li>
              <li><strong className="text-white">Stripe</strong> (pagamenti): gestione di checkout, abbonamenti e fatturazione.</li>
              <li><strong className="text-white">Resend</strong> (email): invio di comunicazioni di servizio.</li>
              <li><strong className="text-white">Google</strong> (OAuth): autenticazione tramite il tuo account Google.</li>
              <li><strong className="text-white">Fornitore AI</strong>: elaborazione dei testi per analisi e generazione CV.</li>
            </ul>
            <p className="mt-2">
              Questi fornitori agiscono come responsabili del trattamento e trattano
              i dati solo per erogare il servizio. Non comunichiamo dati a terzi per
              finalità di marketing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">6. Trasferimenti fuori dall&apos;UE</h2>
            <p>
              Alcuni fornitori (es. hosting, pagamenti, AI) hanno sede o
              infrastrutture negli Stati Uniti. I trasferimenti avvengono con le
              garanzie previste dal GDPR (decisioni di adeguatezza o clausole
              contrattuali standard).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">7. Conservazione dei dati</h2>
            <p>
              Conserviamo i dati finché l&apos;account è attivo e per il tempo
              necessario alle finalità descritte o agli obblighi di legge (es. dati
              fiscali legati ai pagamenti). Puoi chiedere in qualsiasi momento la
              cancellazione dell&apos;account e dei dati associati scrivendo a{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-indigo-300 hover:text-indigo-200">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">8. I tuoi diritti</h2>
            <p>
              Hai diritto di accedere, rettificare, cancellare i tuoi dati, limitarne
              od opporti al trattamento, richiederne la portabilità e revocare il
              consenso ove prestato. Puoi esercitarli scrivendo a{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-indigo-300 hover:text-indigo-200">
                {CONTACT_EMAIL}
              </a>
              . Hai inoltre diritto di proporre reclamo al Garante per la protezione
              dei dati personali (www.garanteprivacy.it).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">9. Sicurezza</h2>
            <p>
              Applichiamo misure tecniche e organizzative adeguate: connessioni
              cifrate HTTPS, password con hash, cookie di sessione firmati (HMAC) in
              formato httpOnly, controlli di accesso lato server e segregazione dei
              dati per utente. Nessun sistema è infallibile: segnalaci subito
              eventuali usi anomali del tuo account.
            </p>
          </section>

          <section id="cookie">
            <h2 className="text-xl font-semibold text-white mb-2">10. Cookie</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-white">Cookie di sessione</strong> (tecnico, httpOnly): mantiene il login in modo sicuro.</li>
              <li><strong className="text-white">Preferenza lingua</strong> (tecnico): ricorda italiano/inglese.</li>
              <li><strong className="text-white">Stripe e Google OAuth</strong> (tecnici di terze parti): necessari per pagamenti e login social durante l&apos;uso di tali funzioni.</li>
              <li><strong className="text-white">Analytics anonime</strong> (Vercel): statistiche aggregate senza profilazione.</li>
            </ul>
            <p className="mt-2">
              Non usiamo cookie di profilazione o marketing. Puoi comunque gestire o
              bloccare i cookie dalle impostazioni del browser (il blocco dei cookie
              tecnici può impedire login e pagamenti).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">11. Minori</h2>
            <p>
              Il servizio è rivolto a utenti di almeno 16 anni. Non raccogliamo
              consapevolmente dati di minori di 16 anni: se ritieni che un minore ci
              abbia fornito dati, contattaci per la rimozione.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">12. Modifiche a questa informativa</h2>
            <p>
              Possiamo aggiornare questa pagina per adeguarla a modifiche normative o
              del servizio. La data di ultimo aggiornamento in alto indica la
              versione vigente; modifiche sostanziali saranno evidenziate
              nella piattaforma.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
