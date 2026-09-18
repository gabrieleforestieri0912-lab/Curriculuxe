import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chi siamo — Curriculuxe | Curriculuxe",
  description: "Curriculuxe nasce per portare il job search copilot in Italia: ATS, tailoring e preparazione colloqui senza spam-apply.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="pt-20 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white">Chi siamo</h1>
        <p className="text-zinc-300 mt-4 leading-relaxed">
          Curriculuxe è un job-search copilot AI per l&apos;Italia e l&apos;Europa. Niente invio massivo di candidature, niente
          invenzioni di esperienza: preview → approvazione → salvataggio. Il Loop Discover→Assess→Tailor→Prepare→Track
          guida ogni opportunità come workspace persistente.
        </p>
        <p className="text-zinc-400 mt-3">Contatto: <a href="mailto:gabriele.forestieri0912@gmail.com" className="text-fuchsia-400">gabriele.forestieri0912@gmail.com</a></p>
        <p className="text-xs text-zinc-600 mt-8">Ispirato al modello ResuMax/Atlas, adattato al mercato italiano con 16 template ATS e negoziazione RAL.</p>
      </div>
    </div>
  );
}
