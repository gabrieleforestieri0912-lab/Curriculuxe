import type { Metadata } from "next";
import { salaries } from "@/lib/seoData";

export const metadata: Metadata = {
  title: "Salaries — Fasce RAL per ruolo e mercato | Curriculuxe",
  description: "Dati salariali aggregati per Italia, Europa e USA. Fasce indicative per negoziare la tua RAL.",
  alternates: { canonical: "/salaries" },
};

export default function SalariesPage() {
  return (
    <div className="pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white">Salaries</h1>
        <p className="text-zinc-400 mt-2">Fasce indicative — usa il negoziatore Atlas per benchmark personalizzati.</p>
        <div className="mt-8 rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-zinc-400">
              <tr><th className="text-left p-3">Ruolo</th><th className="text-left p-3">Mercato</th><th className="text-left p-3">Fascia</th></tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {salaries.map((s) => (
                <tr key={s.role} className="text-zinc-300">
                  <td className="p-3">{s.role}</td><td className="p-3 text-zinc-500">{s.market}</td><td className="p-3 font-semibold text-white">{s.range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-zinc-600 mt-4">Dati aggregati a scopo informativo. Per offerta specifica usa <span className="text-zinc-400">Dashboard → Ricerca & Negoziazione</span>.</p>
      </div>
    </div>
  );
}
