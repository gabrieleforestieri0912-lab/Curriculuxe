export const dynamic = "force-static";

const BASE_URL = process.env.NEXT_PUBLIC_URL || "https://curriculuxe.app";

export function GET() {
  const content = `# Curriculuxe

> Piattaforma AI-powered per creare, ottimizzare e monitorare curriculum professionali.

Curriculuxe è un'applicazione web che aiuta a creare, ottimizzare e monitorare curriculum professionali con analisi ATS, generazione CV con AI e preparazione ai colloqui.

## Cosa fa
- Crea CV professionali con 16 template ottimizzati per i sistemi ATS
- Analizza la compatibilità ATS di un curriculum: score, keyword mancanti e suggerimenti
- Genera CV con AI partendo da una job description o da un profilo
- Riscrive i bullet point con metriche d'impatto
- Traccia ogni versione del CV inviata e lo stato delle candidature
- Simula colloqui con domande ancorate ai bullet reali del CV

## Lingue
Interfaccia bilingue: italiano e inglese. Curriculum creabili in entrambe le lingue.

## Piano prezzi
- Free: analisi base + 5 crediti AI di prova
- Starter: 4,99 €/mese — 50 crediti AI al mese
- Pro: 8,99 €/mese — 500 crediti AI al mese
- Enterprise: 28,99 €/mese — 2000 crediti AI al mese

## Link utili
- [Home](${BASE_URL}/)
- [Analisi CV](${BASE_URL}/analyze)
- [Registrazione](${BASE_URL}/register)
- [Prezzi](${BASE_URL}/#pricing)
- [Domande frequenti](${BASE_URL}/#faq)

## Contatti
- Email: gabriele.forestieri0912@gmail.com
`;
  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
