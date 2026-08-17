import { describe, it, expect } from "vitest";
import {
  detectRole,
  suggestSkills,
  generateCoverAssets,
  getTemplateAdvice,
  marketProfiles,
} from "@/lib/careerKit";

describe("detectRole", () => {
  it("rileva ruolo frontend", () => {
    expect(detectRole("Frontend Developer React")).toBe("frontend");
  });

  it("rileva ruolo backend", () => {
    expect(detectRole("Backend engineer API")).toBe("backend");
  });

  it("rileva ruolo full stack", () => {
    expect(detectRole("Full Stack Engineer")).toBe("full stack");
  });

  it("rileva ruolo data", () => {
    expect(detectRole("Data Analyst machine learning")).toBe("data");
  });

  it("rileva ruolo marketing", () => {
    expect(detectRole("SEO Marketing Specialist")).toBe("marketing");
  });

  it("rileva ruolo sales", () => {
    expect(detectRole("Sales commerciale")).toBe("sales");
  });

  it("rileva ruolo manager", () => {
    expect(detectRole("Project Manager")).toBe("manager");
  });

  it("rileva ruolo designer", () => {
    expect(detectRole("UX Designer")).toBe("designer");
  });

  it("restituisce general per input sconosciuto o vuoto", () => {
    expect(detectRole("")).toBe("general");
    expect(detectRole("tassista")).toBe("general");
  });
});

describe("suggestSkills", () => {
  it("suggerisce skill di base del ruolo", () => {
    const res = suggestSkills({ role: "frontend", currentSkills: "" });
    expect(res.role).toBe("frontend");
    expect(res.suggestions).toContain("React");
    expect(res.suggestions.length).toBeLessThanOrEqual(14);
  });

  it("non suggerisce skill già possedute", () => {
    const res = suggestSkills({ role: "frontend", currentSkills: "React TypeScript" });
    expect(res.suggestions).not.toContain("React");
    expect(res.suggestions).not.toContain("typescript");
  });

  it("deduce il ruolo dalla job description", () => {
    const res = suggestSkills({ jobDescription: "Frontend developer con React", currentSkills: "" });
    expect(res.role).toBe("frontend");
  });

  it("gestisce input vuoti", () => {
    const res = suggestSkills();
    expect(res.suggestions).toEqual([]);
  });
});

describe("generateCoverAssets", () => {
  const base = {
    cv: { personalInfo: { name: "Mario Rossi" }, skills: "React, TypeScript" },
    jobDescription: "Frontend developer React",
    company: "Acme",
    role: "Frontend Developer",
  };

  it("genera cover letter con nome e ruolo", () => {
    const res = generateCoverAssets(base);
    expect(res.coverLetter).toContain("Mario Rossi");
    expect(res.coverLetter).toContain("Frontend Developer");
    expect(res.coverLetter).toContain("Acme");
  });

  it("genera email di candidatura", () => {
    const res = generateCoverAssets(base);
    expect(res.applicationEmail).toContain("Oggetto: Candidatura Frontend Developer - Mario Rossi");
    expect(res.applicationEmail).toContain("Mario Rossi");
  });

  it("usa il profilo di mercato corretto", () => {
    const it = generateCoverAssets({ ...base, market: "italia" });
    const usa = generateCoverAssets({ ...base, market: "usa" });
    expect(it.market).toBe(marketProfiles.italia.label);
    expect(usa.market).toBe(marketProfiles.usa.label);
    expect(usa.marketGuidance.length).toBeGreaterThan(0);
  });

  it("fallback sul mercato italia per mercati sconosciuti", () => {
    const res = generateCoverAssets({ ...base, market: "mars" });
    expect(res.market).toBe(marketProfiles.italia.label);
  });

  it("gestisce cv vuoto con candidato generico", () => {
    const res = generateCoverAssets({});
    expect(res.coverLetter).toContain("Candidato");
  });
});

describe("getTemplateAdvice", () => {
  it("classifica template ATS-safe", () => {
    expect(getTemplateAdvice({ id: "ats" }).category).toBe("ATS Standard");
    expect(getTemplateAdvice({ id: "minimal" }).label).toBe("ATS-safe");
  });

  it("classifica template creativi", () => {
    expect(getTemplateAdvice({ id: "creativo" }).label).toBe("Creativo");
    expect(getTemplateAdvice({ id: "tech" }).category).toBe("Tech");
  });

  it("classifica template accademici", () => {
    expect(getTemplateAdvice({ id: "oxford" }).label).toBe("Accademico");
    expect(getTemplateAdvice({ id: "oxford" }).category).toBe("Executive");
    expect(getTemplateAdvice({ id: "accademico" }).category).toBe("Accademico");
  });

  it("gestisce template sconosciuto con layout two-column", () => {
    const res = getTemplateAdvice({ id: "sconosciuto", layout: "two-column" });
    expect(res.label).toBe("Standard");
    expect(res.warning).toContain("ATS");
  });

  it("gestisce input vuoto", () => {
    expect(getTemplateAdvice().label).toBe("Standard");
  });
});