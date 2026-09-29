export const dynamic = "force-static";

const BASE_URL = process.env.NEXT_PUBLIC_URL || "https://curriculuxe.vercel.app";

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
 - Free: analisi base + 3 crediti AI di prova
  - Starter: 4,99 €/mese — 50 crediti AI al mese (3,99€/anno)
  - Pro: 6,99 €/mese — 500 crediti AI al mese (4,99€/anno)
  - Enterprise: 9,99 €/mese — 2000 crediti AI al mese (6,99€/anno)

## Funzionalità (Loop)
1. Discover — digest giornaliero di 5-10 offerte tra 34+ aziende con score 0-100
2. Assess — ATS score + job match + keyword mancanti con evidenze testuali
3. Tailor — diff before/after dei bullet, preview approvata, mai overwrite automatico
4. Prepare — simulazione colloqui comportamentali/STAR e system design ancorati al CV
5. Track — pipeline draft→sent→interview→offer con next-action e follow-up

## Link utili
- [Home](${BASE_URL}/)
- [Analisi CV](${BASE_URL}/analyze)
- [Resume Score](${BASE_URL}/resume-score)
- [Career Market](${BASE_URL}/career-market)
- [Template CV](${BASE_URL}/templates)
- [Roadmap Carriera](${BASE_URL}/roadmaps)
- [Guide](${BASE_URL}/guides)
- [Progetti Portfolio](${BASE_URL}/projects)
- [Salaries](${BASE_URL}/salaries)
- [Confronta](${BASE_URL}/compare)
- [Prezzi](${BASE_URL}/pricing)
- [MCP - Connect AI](${BASE_URL}/mcp)
- [About](${BASE_URL}/about)
- [Registrazione](${BASE_URL}/register)
- [Domande frequenti](${BASE_URL}/#faq)

## MCP (Model Context Protocol)
Endpoint: ${BASE_URL}/api/mcp (Streamable HTTP, auth via browser OAuth)
Tool read-only su Free (search_jobs, view_career_context) e write su Pro/Premium (tailor, cover letter, pipeline). Nessun invio massivo candidature.

## Contatti
- Email: gabriele.forestieri0912@gmail.com
`;
  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
