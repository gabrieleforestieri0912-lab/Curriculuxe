"use client";

import { useCallback, useEffect, useState } from "react";
import type { ContentType } from "@/content/types";

const STORAGE_PREFIX = "curriculuxe:progress:";

function storageKey(contentType: ContentType, contentSlug: string) {
  return `${STORAGE_PREFIX}${contentType}:${contentSlug}`;
}

function readLocal(contentType: ContentType, contentSlug: string): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(storageKey(contentType, contentSlug));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function isLoggedIn() {
  try {
    return Boolean(localStorage.getItem("user"));
  } catch {
    return false;
  }
}

/**
 * Stato di una checklist di risorsa.
 *
 * Con utente loggato lo stato vive su Supabase (tabella resource_progress)
 * e segue l'utente fra i dispositivi; senza login resta sul dispositivo in
 * localStorage. La UI non cambia in base al canale.
 */
export function useResourceProgress(contentType: ContentType, contentSlug: string) {
  const [items, setItems] = useState<Record<string, boolean>>({});
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      if (!isLoggedIn()) {
        if (!cancelled) {
          setItems(readLocal(contentType, contentSlug));
          setSynced(true);
        }
        return;
      }

      try {
        const res = await fetch(
          `/api/progress?contentType=${encodeURIComponent(contentType)}&contentSlug=${encodeURIComponent(contentSlug)}`
        );
        if (res.ok) {
          const data = (await res.json()) as { rows?: { items?: Record<string, boolean> }[] };
          const row = data.rows?.[0];
          if (!cancelled && row?.items) {
            setItems(row.items);
            setSynced(true);
            return;
          }
        }
      } catch {
        // Rete assente: si continua con la copia locale.
      }

      if (!cancelled) {
        setItems(readLocal(contentType, contentSlug));
        setSynced(true);
      }
    };

    hydrate();
    return () => {
      cancelled = true;
    };
  }, [contentType, contentSlug]);

  const persist = useCallback(
    (next: Record<string, boolean>) => {
      try {
        localStorage.setItem(storageKey(contentType, contentSlug), JSON.stringify(next));
      } catch {
        // quota pieno o storage disabilitato: non blocchiamo l'utente
      }

      if (!isLoggedIn()) return;

      fetch("/api/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, contentSlug, items: next }),
      }).catch(() => {
        // la copia locale resta la fonte immediata
      });
    },
    [contentType, contentSlug]
  );

  const toggle = useCallback(
    (id: string) => {
      setItems((prev) => {
        const next = { ...prev, [id]: !prev[id] };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const reset = useCallback(() => {
    setItems({});
    persist({});
  }, [persist]);

  return { items, toggle, reset, synced };
}