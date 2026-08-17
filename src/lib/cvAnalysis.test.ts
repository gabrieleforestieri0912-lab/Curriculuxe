import { describe, it, expect } from "vitest";
import {
  normalizeText,
  cvToText,
  extractKeywords,
  parseResumeText,
  rewriteExperienceBullets,
  analyzeResume,
} from "@/lib/cvAnalysis";

describe("normalizeText", () => {
  it("rimuove carriage return e spazi multipli", () => {
    expect(normalizeText("  Mario\n\r\n  Rossi  ")).toBe("Mario\n\n Rossi");
  });

  it("converte 3+ newline consecutivi in un unico blank line", () => {
    expect(normalizeText("a\n\n\n\n\nb")).toBe("a\n\nb");
  });

  it("gestisce stringhe vuote e undefined", () => {
    expect(normalizeText()).toBe("");
    expect(normalizeText(undefined)).toBe("");
    expect(normalizeText("   ")).toBe("");
  });
});

describe("cvToText", () => {
  it("combina nome, summary ed esperienze in testo normalizzato", () => {
    const text = cvToText({
      personalInfo: { name: "Mario Rossi" },
      summary: "Professionista esperto",
      experience: [{ role: "Developer", company: "Acme", description: "Sviluppo app" }],
    });
    expect(text).toContain("Mario Rossi");
    expect(text).toContain("Professionista esperto");
    expect(text).toContain("Developer Acme Sviluppo app");
  });

  it("gestisce cv vuoto", () => {
    expect(cvToText()).toBe("");
    expect(cvToText({})).toBe("");
  });

  it("ignora campi vuoti nelle esperienze", () => {
    const text = cvToText({
      experience: [{ role: "", company: "Acme", description: "" }],
    });
    expect(text).toBe("Acme");
  });
});

describe("extractKeywords", () => {
  it("estrae keyword ordinate per frequenza", () => {
    const keywords = extractKeywords("React React React TypeScript Node.js");
    expect(keywords[0]).toBe("react");
    expect(keywords).toContain("typescript");
    expect(keywords).toContain("node.js");
  });

  it("rimuove stop words e token troppo corti", () => {
    const keywords = extractKeywords("per il con la the and di un ai");
    expect(keywords).not.toContain("per");
    expect(keywords).not.toContain("the");
    expect(keywords).toEqual([]);
  });

  it("rispetta il limite", () => {
    const keywords = extractKeywords(
      "uno due tre quattro cinque sei sette otto nove dieci undici dodici tredici quattordici quindici sedici diciassette diciotto diciannove venti ventuno ventidue ventitré ventiquattro venticinque",
      10
    );
    expect(keywords.length).toBeLessThanOrEqual(10);
  });

  it("gestisce testo vuoto", () => {
    expect(extractKeywords("")).toEqual([]);
    expect(extractKeywords(undefined)).toEqual([]);
  });
});

describe("parseResumeText", () => {
  const sample = `Mario Rossi
mario.rossi@example.com
+39 333 1234567

Profilo Professionale
Senior software engineer con 10 anni di esperienza.

Esperienza Lavorativa
Developer presso Acme - sviluppo di API.

Istruzione
Laurea in Informatica - Universit\u00e0 di Milano.

Competenze
React, TypeScript, Node.js

Lingue
Inglese C1`;

  it("rileva nome, email e telefono", () => {
    const parsed = parseResumeText(sample);
    expect(parsed.personalInfo.name).toBe("Mario Rossi");
    expect(parsed.personalInfo.email).toContain("mario.rossi@example.com");
    expect(parsed.personalInfo.phone).toBeTruthy();
  });

  it("riconosce le sezioni standard", () => {
    const parsed = parseResumeText(sample);
    expect(parsed.summary).toContain("Senior software engineer");
    expect(parsed.experience).toContain("Acme");
    expect(parsed.education).toContain("Informatica");
    expect(parsed.skills).toContain("React");
    expect(parsed.languages).toContain("Inglese");
  });

  it("gestisce testo vuoto", () => {
    const parsed = parseResumeText("");
    expect(parsed.personalInfo.name).toBe("");
    expect(parsed.summary).toBe("");
    expect(parsed.experience).toBe("");
  });
});

describe("rewriteExperienceBullets", () => {
  it("mantiene i bullet che hanno gi\u00e0 risultato misurabile e verbo d'azione", () => {
    const result = rewriteExperienceBullets("Guidato un team di 5 persone");
    expect(result[0]).toBe("Guidato un team di 5 persone");
  });

  it("aggiunge 'Ottimizzato' ai bullet con metrica ma senza verbo", () => {
    const result = rewriteExperienceBullets("Riduzione costi del 40%");
    expect(result[0]).toContain("Ottimizzato");
  });

  it("segnala i bullet senza numeri", () => {
    const result = rewriteExperienceBullets("Ho sviluppato funzionalit\u00e0 per il cliente");
    expect(result[0]).toContain("Trasformare in risultato misurabile");
  });

  it("ignora righe corte o vuote", () => {
    const result = rewriteExperienceBullets("a\n\nbreve\nLungo testo di lavoro svolto con risultati concreti");
    expect(result.every((line) => line.length > 12)).toBe(true);
  });
});

describe("analyzeResume", () => {
  const goodResume = `Mario Rossi
mario.rossi@example.com
+39 333 1234567

Profilo
Senior full stack developer con esperienza su React, TypeScript e Node.js.

Esperienza
Sviluppato dashboard, implementato API REST e ridotto i tempi del 40% per 5 progetti.

Formazione
Laurea in Informatica.

Competenze
React, TypeScript, Node.js, Docker, REST API, Git`;

  it("restituisce punteggi compresi tra 0 e 100", () => {
    const res = analyzeResume({ text: goodResume, template: "ats" });
    expect(res.score).toBeGreaterThanOrEqual(0);
    expect(res.score).toBeLessThanOrEqual(100);
    expect(res.atsScore).toBeGreaterThanOrEqual(0);
    expect(res.atsScore).toBeLessThanOrEqual(100);
    expect(typeof res.overall).toBe("string");
  });

  it("calcola jobMatchScore quando presente jobDescription", () => {
    const res = analyzeResume({
      text: goodResume,
      jobDescription: "React TypeScript API developer role",
    });
    expect(res.jobMatchScore).not.toBeNull();
    expect(res.matchedKeywords.length).toBeGreaterThan(0);
  });

  it("senza jobDescription jobMatchScore è null", () => {
    const res = analyzeResume({ text: goodResume });
    expect(res.jobMatchScore).toBeNull();
  });

  it("individua keyword mancanti dalla job description", () => {
    const res = analyzeResume({
      text: goodResume,
      jobDescription: "React Kubernetes Cloud AWS",
    });
    expect(res.missingKeywords).toContain("kubernetes");
    expect(res.missingKeywords).toContain("aws");
  });

  it("restituisce 5 check ATS", () => {
    const res = analyzeResume({ text: goodResume });
    expect(res.atsChecks).toHaveLength(5);
  });

  it("restituisce improvements quando il CV è incompleto", () => {
    const res = analyzeResume({ text: "Mario" });
    expect(res.improvements.length).toBeGreaterThan(0);
  });

  it("funziona anche passando un oggetto cv", () => {
    const res = analyzeResume({
      cv: {
        personalInfo: { name: "Mario Rossi" },
        skills: "React, TypeScript",
        experience: [{ role: "Dev", company: "Acme", description: "Lavorato su progetti riducendo costi del 20%" }],
      },
    });
    expect(res.score).toBeGreaterThan(0);
    expect(res.parsed?.personalInfo.name).toBe("Mario Rossi");
  });
});