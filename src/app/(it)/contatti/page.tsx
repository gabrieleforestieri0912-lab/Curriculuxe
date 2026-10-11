import type { Metadata } from "next";
import ResourceShell from "@/components/ResourceShell";
import ResourceBreadcrumb from "@/components/resources/ResourceBreadcrumb";
import ContactForm from "@/components/resources/ContactForm";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  lang: "it",
  title: "Contatti",
  description:
    "Scrivici per supporto, segnalazioni o richieste di accesso e cancellazione dei dati del CV. Rispondiamo in italiano e in inglese.",
  path: "/contatti",
  keywords: ["contatti Curriculuxe", "assistenza", "richiesta cancellazione dati"],
});

export default function ContattiPage() {
  return (
    <ResourceShell>
      <div className="max-w-3xl mx-auto">
        <ResourceBreadcrumb
          trail={[
            { label: "Risorse", href: "/about" },
            { label: "Chi siamo", href: "/about" },
            { label: "Contatti" },
          ]}
        />

        <h1 className="text-3xl sm:text-4xl font-bold text-white">Contatti</h1>
        <p className="text-zinc-300 text-lg leading-relaxed mt-3 max-w-2xl">
          Domande sul prodotto, segnalazioni, richieste di accesso o cancellazione dei dati del
          tuo CV: scrivici qui. Le richieste sui dati personali le trattiamo come richieste GDPR e
          rispondiamo entro i tempi previsti.
        </p>

        <div className="mt-10">
          <ContactForm />
        </div>
      </div>
    </ResourceShell>
  );
}