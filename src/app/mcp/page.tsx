import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Connect AI — MCP per ChatGPT & Claude | Curriculuxe",
  description: "Collega Curriculuxe a ChatGPT/Claude via MCP (Streamable HTTP). Free in lettura, Pro/Premium in scrittura con approvazione.",
  alternates: { canonical: "/mcp" },
};

export default function McpPage() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://curriculuxe.vercel.app";
  return (
    <div className="pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white">Connect AI — MCP</h1>
        <p className="text-zinc-400 mt-2">Il tuo career agent dentro l&apos;AI che già usi. Endpoint: <code className="px-2 py-1 rounded bg-white/10 text-fuchsia-300">{baseUrl}/api/mcp</code></p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-white font-bold">3 step per connettersi</h2>
          <ol className="list-decimal list-inside text-zinc-300 mt-3 space-y-2">
            <li>Copia l&apos;indirizzo MCP: <code className="text-fuchsia-300">{baseUrl}/api/mcp</code></li>
            <li>Fai sign-in dal browser e verifica i permessi richiesti.</li>
            <li>Chiedi in linguaggio naturale: &quot;Trova i 3 ruoli migliori per il mio profilo&quot;.</li>
          </ol>
          <div className="grid sm:grid-cols-2 gap-3 mt-6 text-sm">
            <div className="rounded-xl border border-white/10 p-4">
              <div className="font-bold text-white">ChatGPT</div>
              <p className="text-zinc-500 mt-1">Settings → Connectors → Add MCP Server (Streamable HTTP) → incolla URL → authorize.</p>
            </div>
            <div className="rounded-xl border border-white/10 p-4">
              <div className="font-bold text-white">Claude</div>
              <p className="text-zinc-500 mt-1">Settings → Integrations → Add MCP Server → incolla URL → authorize.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-zinc-400"><tr><th className="text-left p-3">Tool</th><th className="p-3">Free</th><th className="p-3">Pro/Premium</th></tr></thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              <tr><td className="p-3">search_jobs</td><td className="p-3 text-center">✓ lettura</td><td className="p-3 text-center">✓</td></tr>
              <tr><td className="p-3">view_career_context (redacted)</td><td className="p-3 text-center">✓</td><td className="p-3 text-center">✓</td></tr>
              <tr><td className="p-3">check_plan_usage</td><td className="p-3 text-center">✓</td><td className="p-3 text-center">✓</td></tr>
              <tr><td className="p-3">match_jobs_personalized / tailor / cover letter</td><td className="p-3 text-center text-zinc-600">upsell</td><td className="p-3 text-center text-emerald-300">✓ write</td></tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
          <h3 className="text-white font-bold">Trust & Safety</h3>
          <ul className="list-disc list-inside text-sm text-zinc-300 mt-2 space-y-1">
            <li>Nessun accesso diretto a DB/SQL — solo workflow nominati.</li>
            <li>Nessun salvataggio a sorpresa — preview + approvazione esplicita.</li>
            <li>Mai invio candidature per conto tuo.</li>
            <li>Disconnessione one-click da <Link href="/dashboard/settings" className="text-fuchsia-400">Impostazioni</Link>, con log attività.</li>
          </ul>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 gap-3">
          {[
            "Trova i 3 ruoli migliori per il mio profilo e spiega il fit con evidenze",
            "Fai lo score del mio ultimo CV e dimmi 2 gap ad alto impatto",
            "Prepara il tailoring per Bending Spoons — mostra il diff prima di salvare",
            "Aggiorna la pipeline: sposta Frontend Senior in 'Colloquio' con follow-up tra 7gg",
          ].map((p) => (
            <div key={p} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-300">&quot;{p}&quot;</div>
          ))}
        </div>
      </div>
    </div>
  );
}
