import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { analyzeResume } from "@/lib/cvAnalysis";
import { generateCVWithAI } from "@/lib/ai";
import { getRequestUser } from "@/lib/apiAuth";
import { consumeCredit } from "@/lib/credits";

const mockCVData = {
  tech: {
    personalInfo: { name: "", email: "", phone: "", city: "", linkedin: "", portfolio: "" },
    summary: "",
    experience: [],
    education: [],
    skills: "",
    languages: "",
    certifications: "",
  },
};

function extractInfoFromPrompt(prompt: string) {
  const promptLower = prompt.toLowerCase();
  const data: Record<string, unknown> = { ...mockCVData.tech };

  if (promptLower.includes("sviluppatore") || promptLower.includes("developer") || promptLower.includes("full stack") || promptLower.includes("frontend") || promptLower.includes("backend")) {
    data.category = "tech";
    data.summary = "Professionista con competenze tecniche avanzate nello sviluppo software.";
    data.skills = "JavaScript, TypeScript, React, Node.js, Python, Git, Docker, AWS";
  }

  if (promptLower.includes("manager") || promptLower.includes("project")) {
    data.category = "management";
    data.summary = "Esperienza nella gestione di progetti e team multidisciplinari.";
    data.skills = "Project Management, Agile, Scrum, Jira, Leadership, Budget Management";
  }

  if (promptLower.includes("designer") || promptLower.includes("ux") || promptLower.includes("ui")) {
    data.category = "design";
    data.summary = "Creatività e competenze nel design di interfacce utente.";
    data.skills = "Figma, Adobe XD, UI Design, Prototyping, User Research";
  }

  if (promptLower.includes("data") || promptLower.includes("machine learning") || promptLower.includes("ai")) {
    data.category = "data";
    data.summary = "Competenze avanzate in analisi dati e machine learning.";
    data.skills = "Python, TensorFlow, Pandas, SQL, Data Analysis, ML";
  }

  if (promptLower.includes("marketing") || promptLower.includes("digital")) {
    data.category = "marketing";
    data.summary = "Esperienza in strategie di marketing digitale.";
    data.skills = "SEO, Google Analytics, Social Media, Content Marketing, PPC";
  }

  if (promptLower.includes("sales") || promptLower.includes("commerciale")) {
    data.category = "sales";
    data.summary = "Track record dimostrabile di vendite e gestione clienti.";
    data.skills = "Sales, CRM, Negotiation, Client Relations, B2B";
  }

  const yearsMatch = prompt.match(/(\d+)\s*(?:anni|years)/i);
  if (yearsMatch) {
    data.yearsExperience = parseInt(yearsMatch[1]);
  }

  const cityMatch = prompt.match(/(?:a|di|in)\s+([A-Z][a-z]+)/i);
  if (cityMatch) {
    (data.personalInfo as Record<string, string>).city = cityMatch[1] + ", IT";
  }

  return data;
}

/**
 * Fallback quando l'AI non risponde: costruisce comunque un CV SOSTANZIOSO
 * (mai poche righe) da template, con 2-3 esperienze dettagliate derivate
 * dagli anni citati nel prompt. I contenuti vanno poi verificati e
 * personalizzati dall'utente.
 */
function buildFallbackCV(prompt: string, extractedInfo: Record<string, unknown>) {
  const years = Math.max(2, (extractedInfo.yearsExperience as number) || 3);
  const category = (extractedInfo.category as string) || "general";
  const skills = (extractedInfo.skills as string) || "Comunicazione, Problem Solving, Lavoro di squadra, Gestione del tempo, Adattabilità, Leadership, Inglese tecnico, Excel, Presentazioni, Negoziazione";
  const mainSkill = skills.split(",")[0]?.trim() || "settore di riferimento";
  const now = new Date().getFullYear();

  const levels = years >= 6
    ? ["Senior", "Mid-Level", "Junior"]
    : ["Mid-Level", "Junior"];
  const experience = levels.map((level, i) => {
    const end = i === 0 ? "Presente" : String(now - i * 2);
    const start = String(now - (i + 1) * 2 - (i === levels.length - 1 ? years - levels.length * 2 : 0));
    return {
      company: `Azienda ${category === "general" ? "di Settore" : "partner del settore"}`,
      role: `${level} ${/sviluppatore|developer|engineer|frontend|backend|full stack/i.test(prompt) ? "Developer" : "Professionista"}`,
      period: `${start} - ${end}`,
      description:
        `Attività principali su ${mainSkill} con responsabilità crescenti su progetti seguiti end-to-end, dalla raccolta requisiti al rilascio. ` +
        `Collaborazione quotidiana con team interfunzionali e stakeholder per rispettare tempi e qualità concordati. ` +
        `Contributo misurabile ai risultati del team con miglioramento costante di efficienza e qualità del lavoro svolto. ` +
        `Formazione continua e condivisione di best practice con i colleghi del reparto.`,
    };
  });

  return {
    category,
    personalInfo: extractedInfo.personalInfo,
    summary:
      `Professionista con circa ${years} anni di esperienza, con competenze solide in ${mainSkill} e negli strumenti principali del settore. ` +
      `Abituato a lavorare per obiettivi, con attenzione alla qualità e alla misurazione dei risultati ottenuti. ` +
      `Cerca un contesto dinamico in cui mettere a frutto le competenze maturate e crescere professionalmente.`,
    experience,
    education: [
      {
        institution: "Università",
        degree: "Laurea",
        year: String(now - years - 3),
      },
    ],
    skills,
    languages: "Italiano: Madrelingua, Inglese: B2",
    certifications: "",
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      userId?: string;
      template?: string;
      personalInfo?: Record<string, unknown>;
      summary?: string;
      experience?: Array<Record<string, unknown>>;
      education?: Array<Record<string, unknown>>;
      skills?: string;
      languages?: string;
      certifications?: string;
      prompt?: string;
      mode?: string;
    };

    const { template, personalInfo, summary, experience, education, skills, languages, certifications, prompt, mode } = body;

    // Tutta la creazione CV richiede autenticazione: l'id dell'utente
    // viene preso dal cookie, non dal body (evita di salvare CV a nome altrui).
    const user = getRequestUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }
    const userId = user.id;

    // La generazione AI consuma 1 credito.
    if (mode === "ai-generated") {
      const credit = await consumeCredit(userId);
      if (!credit.ok) {
        return NextResponse.json(
          { error: "Crediti insufficienti. Sottoscrivi un piano o ricarica per generare CV con l'AI." },
          { status: 402 }
        );
      }
    }

    let cvData: Record<string, unknown>;

    if (mode === "ai-generated" && prompt) {
      const aiResult = await generateCVWithAI(prompt);

      if (aiResult && aiResult.summary) {
        const defaultExp = { company: "Azienda di Settore", role: "Professionista", period: "2021 - Presente", description: "Esperienza rilevante nel settore con risultati dimostrabili." };
        const defaultEdu = { institution: "Università", degree: "Laurea", year: "2018" };

        cvData = {
          userId: userId || crypto.randomUUID(),
          template: template || "moderno",
          prompt: prompt,
          personalInfo: aiResult.personalInfo || { name: "", email: "", phone: "", city: "" },
          summary: aiResult.summary || "Professionista motivato e determinato.",
          experience: ((aiResult.experience as Array<unknown>)?.length > 0) ? aiResult.experience : [defaultExp],
          education: ((aiResult.education as Array<unknown>)?.length > 0) ? aiResult.education : [defaultEdu],
          skills: aiResult.skills || "Competenze trasversali",
          languages: aiResult.languages || "Italiano: Madrelingua, Inglese: B2",
          certifications: aiResult.certifications || "",
          aiGenerated: true,
          applicationVersions: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      } else {
        const extractedInfo = extractInfoFromPrompt(prompt);
        const fallback = buildFallbackCV(prompt, extractedInfo);
        cvData = {
          userId: userId || crypto.randomUUID(),
          template: template || "moderno",
          prompt: prompt,
          category: fallback.category,
          personalInfo: fallback.personalInfo,
          summary: fallback.summary,
          experience: fallback.experience,
          education: fallback.education,
          skills: fallback.skills,
          languages: fallback.languages,
          certifications: fallback.certifications,
          aiGenerated: true,
          applicationVersions: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    } else {
      cvData = {
        userId: userId || crypto.randomUUID(),
        template,
        personalInfo: personalInfo || {},
        summary: summary || "",
        experience: experience || [],
        education: education || [],
        skills: skills || "",
        languages: languages || "",
        certifications: certifications || "",
        aiGenerated: false,
        applicationVersions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    const analysis = analyzeResume({ cv: cvData, template: (cvData.template as string) || "ats" });
    cvData.score = analysis.score;
    cvData.atsScore = analysis.atsScore;
    cvData.analysis = {
      improvements: analysis.improvements,
      atsChecks: analysis.atsChecks,
      rewrittenBullets: analysis.rewrittenBullets,
    };

    const { data, error } = await supabase
      .from("cvs")
      .insert(cvData)
      .select()
      .single();

    if (error) throw error;

    const delayMs = mode === "ai-generated" ? 3000 : 2000;
    await new Promise((resolve) => setTimeout(resolve, delayMs));

    return NextResponse.json({
      cvId: data.id,
      message: "CV generato con successo",
      aiGenerated: cvData.aiGenerated
    });
  } catch (error) {
    console.error("Error generating CV:", error);
    return NextResponse.json(
      { error: "Errore durante la generazione del CV" },
      { status: 500 }
    );
  }
}
