import { describe, it, expect } from "vitest";
import { cvTemplates, getTemplateById, generateTemplateStyles } from "@/lib/templates/cvTemplates";

describe("cvTemplates", () => {
  it("espone almeno 15 template", () => {
    expect(cvTemplates.length).toBeGreaterThanOrEqual(15);
  });

  it("ogni template ha id univoco", () => {
    const ids = cvTemplates.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ogni template ha colori e font validi", () => {
    for (const t of cvTemplates) {
      expect(t.accentColor).toMatch(/^#/);
      expect(t.bgColor).toMatch(/^#/);
      expect(t.textColor).toMatch(/^#/);
      expect(t.secondaryText).toMatch(/^#/);
      expect(t.fontFamily).toBeTruthy();
      expect(["single-column", "two-column"]).toContain(t.layout);
    }
  });
});

describe("getTemplateById", () => {
  it("restituisce il template richiesto", () => {
    expect(getTemplateById("ats").name).toBe("ATS Friendly");
    expect(getTemplateById("moderno").id).toBe("moderno");
  });

  it("fallback sul primo template per id sconosciuto", () => {
    expect(getTemplateById("inesistente")).toBe(cvTemplates[0]);
  });
});

describe("generateTemplateStyles", () => {
  it("restituisce gli stili del template (incluse accent e secondary)", () => {
    const styles = generateTemplateStyles("harvard");
    expect(styles.backgroundColor).toMatch(/^#/);
    expect(styles.color).toMatch(/^#/);
    expect(styles.accentColor).toMatch(/^#/);
    expect(styles.secondaryText).toMatch(/^#/);
    expect(styles.fontFamily).toBeTruthy();
  });

  it("non fallisce con id inesistente", () => {
    const styles = generateTemplateStyles("sconosciuto");
    expect(styles).toBeTruthy();
  });
});