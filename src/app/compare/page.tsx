import type { Metadata } from "next";
import { compareRows } from "@/lib/seoData";

export const metadata: Metadata = {
  title: "Confronta — Curriculuxe vs altri tool | Curriculuxe",
  description: "Confronto onesto tra Curriculuxe, ResuMax e builder generici su ATS, tailoring, market e MCP.",
  alternates: { canonical: "/compare" },
};

export default function ComparePage() {
  return (
    <div className="pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white">Curriculuxe vs altri</h1>
        <p className="text-zinc-400 mt-2">Niente fumo — solo feature verificabili.</p>
        <div className="mt-8 rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-zinc-400"><tr><th className="text-left p-3">Feature</th><th className="p-3">Curriculuxe</th><th className="p-3">Generic</th></tr></thead>
            <tbody className="divide-y divide-white/5">
              {compareRows.map((r) => (
                <tr key={r.feature} className="text-zinc-300">
                  <td className="p-3">{r.feature}</td><td className="p-3 text-center font-semibold text-emerald-300">{r.curriculuxe}</td><td className="p-3 text-center text-zinc-500">{r.generic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
