"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * Guscio risorse sensibile al login.
 *
 * Da anonimi mostra lo stesso chrome pubblico di `ResourceShell` (navbar,
 * footer, `pt-28` per l'header fisso). Da loggati rimonta i figli dentro
 * `DashboardShell`, così le risorse vivono dentro la dashboard con sidebar
 * e header. Il server renderizza sempre la variante pubblica: SEO e pagine
 * statiche restano intatte.
 */
export default function ShellSwitch({ children }: { children: React.ReactNode }) {
  // Lettura sincrona della cache: niente setState in effect per il valore iniziale.
  const [loggedIn, setLoggedIn] = useState(() => {
    try {
      return Boolean(localStorage.getItem("user"));
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!loggedIn) return;
    let cancelled = false;
    // Conferma server: se il cookie non è più valido, torna al guscio pubblico.
    fetch("/api/auth/me")
      .then((res) => {
        if (!cancelled && !res.ok) setLoggedIn(false);
      })
      .catch(() => {
        // offline: resta il guscio scelto dalla cache
      });
    return () => {
      cancelled = true;
    };
  }, [loggedIn]);

  if (!loggedIn) {
    return (
      <div className="page-bg relative min-h-screen flex flex-col">
        <Navbar />
        <main id="main-content" className="flex-1 w-full px-4 sm:px-6 pt-28 pb-16">
          {children}
        </main>
        <Footer />
      </div>
    );
  }
  return <DashboardShell>{children}</DashboardShell>;
}
