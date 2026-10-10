# Istruzioni di progetto

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
