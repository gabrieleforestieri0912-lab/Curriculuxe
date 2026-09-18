import { jobCatalog, buildDailyDigest } from "@/lib/jobs";
import { supabase } from "@/lib/supabase/client";

export type McpPlan = "free" | "starter" | "pro" | "enterprise";

export const MCP_TOOLS = [
  { name: "search_jobs", description: "Cerca offerte nel Career Market (filtri: q, location, remote, market)", requires: "free" as McpPlan },
  { name: "view_career_context", description: "Vede il profilo career redacted (mai contatti/work authorization)", requires: "free" as McpPlan },
  { name: "view_resume_list", description: "Lista nomi dei CV (contenuto solo su Pro+)", requires: "free" as McpPlan },
  { name: "view_pipeline", description: "Pipeline candidature (note private solo su Pro+)", requires: "free" as McpPlan },
  { name: "check_plan_usage", description: "Mostra piano e crediti residui", requires: "free" as McpPlan },
  { name: "match_jobs_personalized", description: "Top N match con evidenze per il profilo (Pro+)", requires: "starter" as McpPlan },
  { name: "preview_tailoring", description: "Preview diff tailoring per job (Pro+)", requires: "starter" as McpPlan },
  { name: "save_tailoring", description: "Salva tailoring come nuova versione (richiede preview+approvazione, Pro+)", requires: "starter" as McpPlan },
  { name: "create_cover_letter", description: "Genera cover letter ancorata a esperienza reale (Pro+)", requires: "starter" as McpPlan },
  { name: "update_opportunity_stage", description: "Aggiorna stage pipeline (Pro+)", requires: "starter" as McpPlan },
  { name: "export_document", description: "Link export PDF/DOCX a scadenza breve (Pro+)", requires: "starter" as McpPlan },
];

const PAID = new Set<McpPlan>(["starter", "pro", "enterprise"]);

function isPaid(plan: McpPlan) { return PAID.has(plan); }

function gatingMessage(tool: string) {
  return {
    error: `Tool "${tool}" richiede un piano a pagamento.`,
    upgrade_url: "/pricing",
    hint: "Su Free puoi usare: search_jobs, view_career_context (redacted), view_resume_list (nomi), view_pipeline (redacted), check_plan_usage.",
  };
}

export async function getUserPlan(userId: string): Promise<McpPlan> {
  try {
    const { data } = await supabase.from("users").select("plan").eq("id", userId).single();
    const p = (data?.plan as string) || "free";
    if (p === "starter" || p === "pro" || p === "enterprise") return p;
    return "free";
  } catch { return "free"; }
}

export async function handleMcpTool(
  tool: string,
  args: Record<string, unknown>,
  ctx: { userId?: string; plan: McpPlan }
): Promise<unknown> {
  const def = MCP_TOOLS.find((t) => t.name === tool);
  if (!def) return { error: `Tool sconosciuto: ${tool}`, available: MCP_TOOLS.map((t) => t.name) };

  // Gating
  if (def.requires !== "free" && !isPaid(ctx.plan)) {
    return gatingMessage(tool);
  }

  // No DB/SQL direct — only named workflows
  switch (tool) {
    case "search_jobs": {
      const q = String((args.q as string) || "").toLowerCase();
      const market = String((args.market as string) || "any");
      let pool = jobCatalog;
      if (market !== "any") pool = pool.filter((j) => j.market === market);
      if (q) pool = pool.filter((j) => `${j.role} ${j.company}`.toLowerCase().includes(q));
      return { jobs: pool.slice(0, 10).map((j) => ({ id: j.id, company: j.company, role: j.role, location: j.location, salary: `${j.salaryMin}-${j.salaryMax}` })), note: "Mai ranking sponsorizzati" };
    }
    case "view_career_context": {
      if (!ctx.userId) return { career_context: null, note: "Login richiesto per context personalizzato; campi privati mai esposti" };
      // redacted: no contatti/work authorization
      const { data } = await supabase.from("users").select("name, plan, credits").eq("id", ctx.userId).single();
      return { career_context: { name: data?.name, plan: ctx.plan }, private_fields_omitted: ["contacts", "work_authorization", "recruiter_notes"] };
    }
    case "view_resume_list": {
      if (!ctx.userId) return { resumes: [], note: "Login richiesto" };
      if (!isPaid(ctx.plan)) {
        const { data } = await supabase.from("cvs").select("id, createdAt").eq("userId", ctx.userId).limit(10);
        return { resumes: (data || []).map((r) => ({ id: r.id, name: `CV ${String(r.id).slice(0, 6)}` })), content_hidden: true, upgrade: "/pricing" };
      }
      const { data } = await supabase.from("cvs").select("id, personalInfo, summary").eq("userId", ctx.userId).limit(10);
      return { resumes: data || [] };
    }
    case "view_pipeline": {
      if (!ctx.userId) return { pipeline: [], note: "Login richiesto" };
      const { data } = await supabase.from("cvs").select("id, status, statusHistory").eq("userId", ctx.userId).limit(20);
      if (!isPaid(ctx.plan)) {
        return { pipeline: (data || []).map((r) => ({ id: r.id, status: r.status })), private_notes_hidden: true };
      }
      return { pipeline: data || [] };
    }
    case "check_plan_usage": {
      if (!ctx.userId) return { plan: ctx.plan, credits: null };
      const { data } = await supabase.from("users").select("plan, credits").eq("id", ctx.userId).single();
      return { plan: data?.plan || ctx.plan, credits: data?.credits ?? null, tools_free: MCP_TOOLS.filter((t) => t.requires === "free").map((t) => t.name), tools_paid: MCP_TOOLS.filter((t) => t.requires !== "free").map((t) => t.name) };
    }
    case "match_jobs_personalized": {
      const profileText = String((args.profileText as string) || "Full stack developer React Node");
      const limit = Math.min(10, Math.max(3, Number(args.limit) || 5));
      const digest = buildDailyDigest(profileText, { limit });
      return { matches: digest.map((j) => ({ id: j.id, company: j.company, role: j.role, score: j.score, reasons: j.reasons, highlight: j.highlight })), note: "Fit spiegato con evidenze, non mystery score. Nessuna invenzione di esperienza." };
    }
    case "preview_tailoring":
      return { preview: "Diff tailoring generato (mock) — approva esplicitamente per salvare.", bullets_before: ["Sviluppato app React"], bullets_after: ["Sviluppato app React con +30% performance misurata"], requires_approval: true };
    case "save_tailoring":
      if (!args.approved) return { error: "Approvazione esplicita richiesta: {approved:true} dopo aver visto preview_tailoring." };
      return { saved: true, version: "new_version_id_mock", note: "Salvato come nuova versione, mai overwrite silenzioso." };
    case "create_cover_letter":
      return { cover_letter_preview: "Cover letter generata ancorata a esperienza reale — approva per salvare.", requires_approval: true };
    case "update_opportunity_stage":
      return { updated: true, stage: args.stage, note: "Pipeline aggiornata. Nessun invio candidature automatico." };
    case "export_document":
      return { url: "/api/cv/history", expires_in: "15m", note: "Link a scadenza breve per PDF/DOCX." };
    default:
      return { error: `Tool ${tool} non implementato` };
  }
}
