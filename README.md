# Curriculuxe

Piattaforma AI-powered per creare, ottimizzare e monitorare curriculum professionali con analisi ATS, personalizzazione per job description e supporto completo alla candidatura.

---

## Architettura

**Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS, Framer Motion  
**Backend:** Next.js API Routes (Node.js runtime)  
**Database:** Supabase (PostgreSQL)  
**AI:** OpenAI (GPT-4o-mini) con fallback Ollama per test locali  
**Auth:** Cookie httpOnly firmato (HMAC-SHA256) con Google OAuth via Supabase Auth  
**Pagamenti:** Stripe Checkout (sessioni + webhook)  
**Email:** Resend (notifiche feedback)

---

## Struttura del Progetto

```
src/
├── app/
│   ├── api/                    # API routes
│   ├── auth/               # Login, register, Google OAuth (Supabase), lingua
│   ├── checkout/           # Stripe checkout session
│   ├── cv/                 # CRUD CV, analisi, generazione, career kit
│   │   ├── [id]/           # GET/PUT/DELETE singolo CV (auth + ownership)
│   │   │   ├── status/     # Pipeline tracking (draft→sent→interview→...)
│   │   │   └── versions/   # Versioni per offerta di lavoro
│   │   ├── analyze/        # Analisi ATS con AI + fallback statico
│   │   ├── generate/       # Generazione CV (AI o manuale)
│   │   ├── generate-summary/ # AI summary generator
│   │   ├── rewrite-bullet/ # AI bullet point rewriter
│   │   ├── revise/         # Revisione CV
│   │   ├── career-kit/     # Cover letter + email + skill suggerite
│   │   └── history/        # Cronologia analisi
│   ├── feedback/           # Invio feedback con notifica email (Resend)
│   ├── interview/          # Feedback AI su risposte colloquio
│   └── webhooks/stripe/    # Webhook pagamenti
│   │
│   ├── dashboard/              # Pagine protette (autenticazione richiesta)
│   │   ├── page.jsx            # Dashboard principale
│   │   ├── create/             # Creazione manuale CV
│   │   ├── cvs/                # Lista CV con pipeline tracking
│   │   ├── cv/[id]/            # Dettaglio CV
│   │   ├── generate/           # Generazione AI CV
│   │   ├── feedback/           # Pagina feedback
│   │   ├── interview/          # Simulazione colloqui
│   │   └── job-search/         # Ricerca lavoro e negoziazione
│   │
│   ├── analyze/                # Pagina analisi CV pubblica
│   ├── login/                  # Login
│   ├── register/               # Registrazione
│   ├── success/                # Pagina successo pagamento
│   ├── privacy/                # Privacy policy
│   └── terms/                  # Termini di servizio
│
├── components/
│   ├── Navbar.jsx              # Navigazione principale
│   ├── Hero.jsx                # Sezione hero landing
│   ├── Features.jsx            # Feature grid (6 aree)
│   ├── HowItWorks.jsx          # Come funziona
│   ├── Pricing.jsx             # Piani e prezzi
│   ├── ProductShowcase.jsx     # Demo interattiva
│   ├── ScoreDemo.jsx           # Demo punteggio
│   ├── CompaniesSection.jsx    # Loghi aziende
│   ├── CTA.jsx                 # Call to action finale
│   ├── Footer.jsx              # Footer completo
│   ├── Dashboard.jsx           # Dashboard operativa
│   ├── Analyze.jsx             # Analisi CV (upload + risultati)
│   ├── DashboardSkeleton.jsx   # Scheletro loading dashboard
│   ├── AnimatedCounter.jsx     # Contatore animato
│   ├── LanguageSwitcher.jsx    # Selettore lingua
│   ├── TemplatePreview.jsx     # Anteprima template realistica
│   └── templates/
│       ├── TemplateSelector.jsx # Selettore template con preview
│       ├── TemplateRenderer.jsx # Render template CV
│       └── definitions/        # Definizioni dei 16 template
│
├── context/
│   └── LanguageContext.tsx     # Provider lingua (IT/EN)
│
└── lib/
    ├── auth.ts                 # Autenticazione (Supabase, cookie firmato, bcrypt)
    ├── apiAuth.ts              # Helper auth per API routes (cookie → utente)
    ├── rateLimit.ts            # Rate limiter in-memory + IP extraction
    ├── credits.ts              # Sistema crediti AI (consumo atomico)
    ├── ai.ts                   # AI (OpenAI + fallback Ollama, con timeout)
    ├── cvAnalysis.ts           # Analisi statica CV (regex + scoring)
    ├── careerKit.ts            # Cover letter, skills, market profiles
    ├── stripe.ts               # Client Stripe + piani
    ├── i18n.ts                 # Traduzioni IT/EN
    └── supabase/               # Client + tipi Supabase
```

---

## Funzionalità Dettagliate

### 1. Analisi ATS con Scoring

Carica un CV (PDF/DOCX/TXT) e ricevi:

- **Score complessivo** (0-100) — media pesata di ATS, contenuto e job match
- **ATS Score** — 5 check binari (sezioni standard, contatti leggibili, keyword ≥55%, risultati quantificati, formato ATS-safe)
- **Job Match Score** — sovrapposizione keyword CV vs job description
- **Punti di forza** individuati dall'AI
- **Aree di miglioramento** con impatto (Alto/Medio/Basso)
- **Keyword matched e mancanti**
- **Bullet point riscritti** in formato Azione + Strumento + Risultato
- **Metriche di leggibilità**

L'analisi usa AI (OpenAI o Ollama) se l'utente ha crediti; altrimenti fallback su analisi statica regex.

### 2. Ottimizzazione per Job Description

- Confronto automatico CV vs job description
- Identificazione keyword mancanti e skill suggerite
- Risultati bullet point riscritti per allineamento al ruolo target
- Generazione versione CV per ogni offerta (tracking versioni)

### 3. AI Bullet Point Rewriter

`POST /api/cv/rewrite-bullet`

Riscrive un bullet point con:

- Formato: Azione + Strumento/Metodo + Risultato Misurabile
- Metriche e numeri (es. "riduzione 40% costi")
- Verbi d'azione forti
- Allineamento linguaggio alla job description

### 4. AI Summary Generator

`POST /api/cv/generate-summary`

Genera automaticamente:

- Professional summary (2-4 frasi)
- Headline professionale
- Key strengths

Basato su esperienze, competenze e ruolo target.

### 5. Career Kit

`POST /api/cv/career-kit`

Genera:

- **Cover letter** personalizzata per ruolo e mercato (Italia/Europa/USA)
- **Email di candidatura**
- **Skill suggerite** basate su ruolo e keyword job description
- **Market guidance** localizzata

### 6. Resume Builder

- **Creazione manuale** (`/dashboard/create`): 16 template, tutte le sezioni (personali, profilo, esperienze, istruzione, skills, lingue, certificazioni)
- **Generazione AI** (`/dashboard/generate`): descrivi il profilo e l'AI crea il CV
- **Template ATS-friendly** con classificazione (ATS-safe, creativo, accademico)
- Anteprime realistiche dei template

### 7. Preparazione ai Colloqui

`/dashboard/interview`

- Simulazione interattiva con 10 domande frequenti (IT/EN)
- Feedback AI su ogni risposta con punteggio (1-10), punti di forza, aree di miglioramento
- Guida al metodo STAR
- Suggerimenti specifici per ruolo target
- Versione migliorata della risposta

### 8. Ricerca Lavoro e Negoziazione

`/dashboard/job-search`

- Strategie di ricerca e personal branding
- Template networking (connect, info interview, referral, follow-up)
- Template email (accettazione, rifiuto, negoziazione)
- Guida alla negoziazione passo-passo (preparazione, timing, total compensation, script, closing)
- Consigli pratici per la trattativa

### 9. Application Tracking

`PUT /api/cv/[id]/status`

Pipeline di candidatura a 6 stati:

| Stato | Descrizione |
|-------|------------|
| Bozza | CV in lavorazione |
| Inviato | Candidatura inviata |
| Colloquio | In fase di colloqui |
| Offerta | Offerta ricevuta |
| Rifiutato | Candidatura respinta |
| Accettato | Offerta accettata |

Ogni cambio stato registra timestamp e note (storico consultabile via `GET /api/cv/[id]/status`). La dashboard mostra statistiche aggregate.

### 10. Feedback System

- Invio feedback da `/dashboard/feedback`
- Categorie: nuova funzionalità, bug, feedback generale, altro
- Salvataggio su MongoDB + notifica email a `gabriele.forestieri0912@gmail.com` (tramite Nodemailer)

### 11. Dashboard Operativa

- Crediti AI rimanenti con acquisto (Stripe, 10 crediti — 9.99€) e piani in abbonamento (starter 50, pro 500, enterprise 2000 crediti/mese)
- Score CV più alto
- Conteggio CV creati e keyword trovate
- Cronologia analisi recenti
- Azioni rapide (carica CV, genera da offerta, crea da zero, colloqui, ricerca lavoro)
- Pipeline applicazioni (bozza/inviato/colloquio/offerta)

---

## Autenticazione

- **Email/password** con hash bcrypt (le password legacy SHA-256 vengono migrate al login)
- **Google OAuth** via Supabase Auth (redirect callback)
- Cookie HTTP-only firmato HMAC-SHA256 con dati utente (id, email, nome)
- `JWT_SECRET` obbligatorio in produzione (senza, l'app rifiuta di firmare i token)
- Persistenza lingua su account Supabase (campo `language`)
- Protezione route: middleware Edge su `/dashboard/*` + verifica token nelle API
- Rate limiting su login/registrazione e analisi anonime

## Sicurezza API

- Tutte le API CV richiedono autenticazione e verificano l'ownership: un utente può leggere/modificare/cancellare solo i propri CV
- Le funzionalità AI (bullet, summary, colloqui, generazione) richiedono l'accesso e consumano 1 credito
- Il consumo crediti usa un update condizionale per evitare race condition

---

## AI Provider

Configurabile in `.env.local`:

```bash
# OpenAI (provider primario, richiede API key)
OPENAI_API_KEY=sk-...
# Modello adatto all'analisi/generazione CV (JSON output). Sovrascrivibile.
OPENAI_MODEL=gpt-4o-mini

# Ollama (fallback solo per test locali temporanei)
OLLAMA_HOST=http://127.0.0.1:11434
OLLAMA_MODEL=deepseek-r1:8b
```

L'AI viene usata per:

- Analisi CV con scoring
- Riscrittura bullet point
- Generazione summary
- Feedback colloqui

Se l'AI non è disponibile o l'utente non ha crediti, il sistema usa analisi statica (regex) come fallback.

---

## Pagamenti (Stripe)

### Piani

| Piano | Tipo | Prezzo | Crediti AI |
|-------|------|--------|------------|
| `free` | Gratuito | €0 | 5 crediti di prova alla registrazione |
| `starter` | Abbonamento ricorrente | €4.99/mese (€3.99/anno) | 50 crediti/mese |
| `pro` | Abbonamento ricorrente | €8.99/mese (€5.99/anno) | 500 crediti/mese |
| `enterprise` | Abbonamento ricorrente | €28.99/mese (€18.99/anno) | 2000 crediti/mese |
| `credits10` | Ricarica one-time | €9.99 | +10 crediti |

### Sistema crediti

- Ogni funzionalità AI (analisi CV, generazione CV, riscrittura bullet, summary, feedback colloqui) consuma **1 credito** per gli utenti autenticati, su **tutti** i piani.
- Gli utenti `free` ricevono 5 crediti alla registrazione; una volta esauriti devono ricaricare o sottoscrivere un piano.
- Ogni piano in abbonamento (`starter`/`pro`/`enterprise`) accredita i crediti mensili al checkout e a ogni rinnovo automatico della subscription Stripe (`invoice.paid`).
- La disdetta della subscription (`customer.subscription.deleted`) riporta l'utente al piano free.
- Checkout session → webhook → aggiornamento crediti su DB
- Webhook protetto con signing secret (`STRIPE_WEBHOOK_SECRET`)

### Configurazione Stripe

- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (il checkout è hosted: non serve la chiave pubblica lato client)
- Gli abbonamenti (`starter`/`pro`/`enterprise`) usano `mode: "subscription"` e richiedono il webhook `invoice.paid` per i rinnovi.

---

## Internazionalizzazione

Due lingue complete (IT/EN):

- `src/lib/i18n.js` — tutte le traduzioni
- `LanguageContext.jsx` — provider React con persistenza localStorage + account
- `LanguageSwitcher.jsx` — toggle in navbar
- `PATCH /api/auth/language` — cambio lingua persistente su MongoDB

---

## Variabili d'Ambiente

```bash
# File: .env.local

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-secret-key
NEXT_PUBLIC_URL=http://localhost:3000

# OpenAI (opzionale)
OPENAI_API_KEY=sk-...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Google OAuth (configurato nella dashboard Supabase, nessuna chiave lato app)

# Resend (per notifiche feedback)
RESEND_API_KEY=re_...

# Email ricezione feedback
SUPPORT_EMAIL=gabriele.forestieri0912@gmail.com
```

---

## Sviluppo

```bash
npm install     # Installa dipendenze
npm run dev     # Avvia sviluppo (http://localhost:3000)
npm run build   # Build produzione
npm start       # Avvia produzione
```

---

## Database Supabase (PostgreSQL)

Tabelle (vedi `supabase-migration.sql`):

- `users` — account utente (crediti, piano, lingua, score, contatori pipeline)
- `cvs` — curriculum (con applicationVersions e statusHistory)
- `analyses` — storico analisi con risultati completi
- `payments` — transazioni Stripe
- `feedbacks` — feedback utente

> Nota: i nomi colonna sono camelCase e devono combaciare esattamente con il codice. Il file di migration include le istruzioni `ALTER TABLE` commentate per allineare eventuali DB esistenti creati con lo schema precedente.

---

## API Routes Summary

| Metodo | Route | Descrizione |
|--------|-------|-------------|
| POST | `/api/auth/register` | Registrazione |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Profilo utente |
| PATCH | `/api/auth/language` | Cambio lingua |
| GET/POST | `/api/cv` | Lista/creazione CV |
| GET/PUT/DELETE | `/api/cv/[id]` | CRUD singolo CV |
| PUT/GET | `/api/cv/[id]/status` | Pipeline tracking |
| GET | `/api/cv/[id]/versions` | Versioni per offerta |
| POST | `/api/cv/analyze` | Analisi ATS |
| POST | `/api/cv/generate` | Generazione CV |
| POST | `/api/cv/generate-summary` | AI summary |
| POST | `/api/cv/rewrite-bullet` | AI bullet rewriter |
| POST | `/api/cv/revise` | Revisione CV |
| POST | `/api/cv/career-kit` | Cover letter + skills |
| GET | `/api/cv/history` | Cronologia analisi |
| POST | `/api/interview` | Feedback colloquio |
| POST | `/api/feedback` | Invio feedback |
| POST | `/api/checkout` | Creazione sessione Stripe |
| POST | `/api/webhooks/stripe` | Webhook pagamenti |
