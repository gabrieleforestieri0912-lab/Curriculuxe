"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";

const topics = [
  { value: "supporto", label: "Supporto e problemi" },
  { value: "dati", label: "Richiesta dati o cancellazione" },
  { value: "progetti", label: "Proposte o partnership" },
  { value: "altro", label: "Altro" },
];

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          topic: data.get("topic"),
          message: data.get("message"),
          website: data.get("website"),
        }),
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(payload.error || "Invio non riuscito");
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("sent");
    } catch {
      setError("Connessione non riuscita. Riprova.");
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.07] p-6 text-center">
        <h2 className="text-white font-bold text-lg">Messaggio inviato</h2>
        <p className="text-zinc-400 text-sm mt-2">
          Ti rispondiamo via email. Se riguarda i tuoi dati, la richiesta viene presa in carico
          come richiesta di accesso o cancellazione.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className="block text-sm text-zinc-300 mb-1.5">
            Nome
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            maxLength={120}
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus-visible:border-fuchsia-400/60"
            placeholder="Come ti chiami"
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-sm text-zinc-300 mb-1.5">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={200}
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus-visible:border-fuchsia-400/60"
            placeholder="la.tua@email.com"
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="contact-topic" className="block text-sm text-zinc-300 mb-1.5">
          Tema
        </label>
        <select
          id="contact-topic"
          name="topic"
          className="w-full rounded-xl bg-black/30 border border-white/10 px-3.5 py-2.5 text-sm text-white outline-none focus-visible:border-fuchsia-400/60"
          defaultValue={topics[0].value}
        >
          {topics.map((topic) => (
            <option key={topic.value} value={topic.value} className="bg-zinc-900">
              {topic.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label htmlFor="contact-message" className="block text-sm text-zinc-300 mb-1.5">
          Messaggio
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          maxLength={4000}
          className="w-full rounded-xl bg-black/30 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus-visible:border-fuchsia-400/60 resize-y"
          placeholder="Raccontaci cosa ti serve"
        />
      </div>

      <div className="sr-only" aria-hidden="true">
        <label htmlFor="contact-website">Non compilare</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" && error && (
        <p role="alert" className="mt-4 text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-5 inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-full text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "sending" ? (
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="w-4 h-4" aria-hidden="true" />
        )}
        {status === "sending" ? "Invio in corso" : "Invia messaggio"}
      </button>

      <p className="text-xs text-zinc-600 mt-3">
        Usiamo i dati solo per risponderti. Richieste di accesso o cancellazione dei dati del CV
        sono trattate come richieste GDPR.
      </p>
    </form>
  );
}