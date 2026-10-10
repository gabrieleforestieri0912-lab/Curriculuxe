export const dynamic = "force-static";

import { guides } from "@/lib/guides";
import { absUrl, supportEmail } from "@/lib/seo";

export function GET() {
  const content = `# Curriculuxe

> Piattaforma AI-powered per creare, ottimizzare e monitorare curriculum professionali.

Curriculuxe è un'applicazione web che aiuta a creare, ottimizzare e monitorare curriculum professionali con analisi ATS, generazione CV con AI e preparazione ai colloqui.

## Cosa fa
- Crea CV professionali con template ottimizzati per i sistemi ATS
- Analizza la compatibilità ATS di un curriculum: score 0-100, keyword mancanti e suggerimenti
- Genera CV con AI partendo da una job description o da un profilo
- Riscrive i bullet point in formato Azione + Strumento + Risultato
- Traccia ogni versione del CV inviata e lo stato delle candidature
- Simula colloqui con domande ancorate ai bullet reali del CV

## Lingue
Interfaccia bilingue: italiano (URL canonici, \`hreflang=it\`) e inglese (\`/en\`, \`hreflang=en\`).
Le guide, il Career Market e i dati salariali sono disponibili solo in italiano.

## Prezzi
- Free: analisi base + 3 crediti AI di prova
- Starter: 4,99 €/mese — 50 crediti AI al mese (3,99 €/anno)
- Pro: 6,99 €/mese — 500 crediti AI al mese (4,99 €/anno)
- Enterprise: 9,99 €/mese — 2000 crediti AI al mese (6,99 €/anno)

## Funzionalita (loop)
1. Discover — digest giornaliero di offerte tra aziende verificate, con score 0-100
2. Assess — ATS score + job match + keyword mancanti con evidenze testuali
3. Tailor — diff before/after dei bullet, preview approvata, mai overwrite automatico
4. Prepare — simulazione colloqui comportamentali/STAR e system design ancorati al CV
5. Track — pipeline draft→sent→interview→offer con next action e follow-up

## Pagine principali (IT)
- [Home](${absUrl("/")})
- [Resume Score — analisi ATS gratuita](${absUrl("/resume-score")})
- [Career Market — offerte verificate](${absUrl("/career-market")})
- [Template CV ATS-friendly](${absUrl("/templates")})
- [Guide CV e colloqui](${absUrl("/guides")})
- [Roadmap di carriera](${absUrl("/roadmaps")})
- [Progetti da portfolio](${absUrl("/projects")})
- [Fasce salariali](${absUrl("/salaries")})
- [Confronta i tool](${absUrl("/compare")})
- [Prezzi](${absUrl("/pricing")})
- [MCP — Connect AI](${absUrl("/mcp")})
- [Chi siamo](${absUrl("/about")})
- [Registrati gratis](${absUrl("/register")})
- [Privacy Policy](${absUrl("/privacy")})
- [Termini di Servizio](${absUrl("/terms")})

## Guide
${guides.map((g) => `- [${g.title}](${absUrl(`/guides/${g.slug}`)})`).join("\n")}

## Pagine in inglese (EN)
- [Home (EN)](${absUrl("/en")})
- [Free ATS Resume Checker](${absUrl("/en/resume-score")})
- [Pricing](${absUrl("/en/pricing")})
- [ATS-Friendly Resume Templates](${absUrl("/en/templates")})
- [MCP — Connect AI](${absUrl("/en/mcp")})
- [About](${absUrl("/about")})
- [Sign up free](${absUrl("/en/register")})

## MCP (Model Context Protocol)
Endpoint: ${absUrl("/api/mcp")} (Streamable HTTP, auth via browser OAuth)
Tool read-only su Free (search_jobs, view_career_context) e write su Pro/Premium (tailor, cover letter, pipeline). Nessun invio massivo di candidature.

## Contatti
- Email: ${supportEmail}
`;
  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
