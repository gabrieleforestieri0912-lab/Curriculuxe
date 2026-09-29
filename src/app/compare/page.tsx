import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";
import { compareRows } from "@/lib/seoData";
import ResourceShell from "@/components/ResourceShell";

export const metadata: Metadata = {
  title: "Confronta — Curriculuxe vs altri tool | Curriculuxe",
  description: "Confronto onesto tra Curriculuxe, ResuMax e builder generici su ATS, tailoring, market e MCP.",
  alternates: { canonical: "/compare" },
};

function CellValue({ value, highlight }: { value: string; highlight?: boolean }) {
  if (value === "✓") {
    return (
      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${highlight ? "bg-emerald-500/20 border border-emerald-500/40" : "bg-white/5 border border-white/10"}`}>
        <Check className={`w-4 h-4 ${highlight ? "text-emerald-300" : "text-zinc-400"}`} />
      </span>
    );
  }
  if (value === "—") {
    return <Minus className="w-4 h-4 text-zinc-700 inline" />;
  }
  return <span className={highlight ? "font-semibold text-emerald-300" : "text-zinc-500"}>{value}</span>;
}

export default function ComparePage() {
  return (
    <ResourceShell>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-fuchsia-400 mb-3 px-3 py-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10">
            Risorse
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Curriculuxe <span className="text-gradient">vs altri</span>
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto">Niente fumo — solo feature verificabili.</p>
        </div>
        <div className="rounded-2xl border border-fuchsia-500/25 overflow-hidden bg-white/[0.02]">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-zinc-400">
              <tr>
                <th className="text-left p-4 font-semibold">Feature</th>
                <th className="p-4 font-bold text-white bg-fuchsia-500/10">Curriculuxe</th>
                <th className="p-4 font-semibold">Generic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {compareRows.map((r) => (
                <tr key={r.feature} className="text-zinc-300 hover:bg-white/[0.03] transition-colors">
                  <td className="p-4 font-medium">{r.feature}</td>
                  <td className="p-4 text-center bg-fuchsia-500/[0.06]"><CellValue value={r.curriculuxe} highlight /></td>
                  <td className="p-4 text-center"><CellValue value={r.generic} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-10 text-center">
          <Link href="/pricing" className="btn-primary inline-flex items-center gap-2 text-white px-8 py-3.5 rounded-full font-semibold text-sm">
            Vedi i piani
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </ResourceShell>
  );
}
