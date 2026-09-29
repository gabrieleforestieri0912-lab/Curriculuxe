import Navbar from "@/components/Navbar";

/**
 * Guscio condiviso dalle pagine di risorse.
 *
 * Le pagine pubbliche (/guides, /projects, ...) non hanno una route layout
 * dedicata, quindi senza questo wrapper restavano senza navbar e con lo
 * sfondo del body: sembravano pagine scollegate dal resto del prodotto.
 * Qui diamo loro lo stesso chrome della piattaforma (navbar + page-bg),
 * mentre i figli continuano a gestire il proprio contenuto e larghezza.
 */
export default function ResourceShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-bg relative min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full px-4 sm:px-6 pt-28 pb-16">{children}</main>
    </div>
  );
}