# Istruzioni di progetto

## Verifica e test dopo OGNI modifica

Prima del commit, esegui in quest'ordine e correggi subito gli errori:

1. `npx tsc --noEmit` — deve essere pulito.
2. `npm run lint` — ammessi solo gli errori preesistenti
   (`dashboard/interview/page.tsx:56`, `LanguageContext.tsx:132`). Qualsiasi
   errore nuovo, specie `react/no-unescaped-entities` (apostrofi in JSX:
   usa sempre `&apos;` nel testo JSX, mai `'`), va corretto subito.
3. `npx next build` — deve compilare senza errori.
4. Se hai toccato `src/content/*` o API: crea un file di test temporaneo
   `src/content/__verify__.test.ts` (vitest include `src/**/*.test.ts`),
   eseguilo con `npx vitest run src/content/__verify__.test.ts` e poi
   **ELIMINALO subito dopo la verifica** — i file di test temporanei non
   vanno mai committati.
5. Se hai toccato route o API: verifica runtime con `npx next start`
   (dopo la build) e `Invoke-WebRequest` sulle route toccate; controlla
   status code, assenza di claim vietati e risposte delle API senza auth
   (401 atteso). Spegni il server a fine verifica.

Claim vietati in UI/schema (verifica con grep prima del commit):
`16 template`, `Pro/Premium`, `ResuMax`, `+5000`, `75% dei CV`,
`Usato dai migliori`, `Logica limiti`, `Dashboard →`, email personale
in chiaro, `src/app/icon.*` (l'unico logo e' `public/curriculuxe.png).

Per la tabella `resource_progress` (Supabase) esiste la migrazione
`supabase/supabase-migration-progress.sql` come modello delle altre in
`supabase/`.

## Salvataggio automatico su GitHub

Dopo OGNI modifica al codice (feature, fix, refactor, anche piccoli),
a fine lavoro devi sempre salvare su GitHub, senza che l'utente debba
chiederlo esplicitamente:

1. Verifica con `git status` e `git diff` quali file sono cambiati;
   metti in stage solo i file relativi alla modifica.
2. Crea un commit con un messaggio conciso in italiano che descriva
   la modifica (es. `Aggiunta chat AI laterale nella pagina CV`).
3. Fai `push` sul branch corrente verso `origin`.
4. A fine operazione riporta all'utente branch, file committati e
   messaggio del commit.

Regole di sicurezza (sempre valide):

- NON committare mai segreti: file `.env*`, chiavi API, token,
  credenziali o file con dati sensibili. Se una modifica li tocca,
  segnalalo e fermati prima del commit.
- NON usare `push --force` e NON riscrivere la storia pubblica.
- Se il push fallisce (conflitti, rete, autenticazione), NON insistere:
  spiega l'errore all'utente e indica come risolverlo.
- Rispetta il `.gitignore` del progetto.
