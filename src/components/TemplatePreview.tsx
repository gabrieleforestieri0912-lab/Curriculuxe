"use client";

import { getTemplateById } from "@/lib/templates/cvTemplates";

interface TemplatePreviewProps {
  templateId: string;
  size?: "sm" | "md" | "lg";
}

interface TemplateData {
  id: string;
  name: string;
  description: string;
  accentColor: string;
  bgColor: string;
  textColor: string;
  secondaryText: string;
  fontFamily: string;
  layout: string;
  headerStyle: string;
  skillsStyle: string;
}

export default function TemplatePreview({ templateId, size = "md" }: TemplatePreviewProps) {
  const t = getTemplateById(templateId) as unknown as TemplateData;
  const isTwoCol = t.layout === "two-column";

  const sizes: Record<string, { h: number; scale: number }> = {
    sm: { h: 130, scale: 0.28 },
    md: { h: 210, scale: 0.45 },
    lg: { h: 300, scale: 0.65 },
  };
  const s = sizes[size] || sizes.md;
  const scale = s.scale;

  return (
    <div
      className="overflow-hidden rounded-lg border"
      style={{
        height: s.h,
        borderColor: t.secondaryText + "30",
        backgroundColor: t.bgColor,
        fontFamily: t.fontFamily,
      } as React.CSSProperties}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${100 / scale}%`,
          height: `${100 / scale}%`,
        }}
      >
        <div style={{ width: 280, padding: 0, backgroundColor: t.bgColor, color: t.textColor, fontSize: 12, lineHeight: 1.4 }}>
          <HeaderPreview template={t} />
          <div style={{ display: "flex", minHeight: isTwoCol ? 280 : "auto" }}>
            {isTwoCol && <SidebarPreview template={t} />}
            <MainContent template={t} />
          </div>
        </div>
      </div>
    </div>
  );
}

function HeaderPreview({ template: t }: { template: TemplateData }) {
  const headerBg = t.headerStyle === "gradient-bar" || t.headerStyle === "highlight" || t.headerStyle === "code-bar" || t.headerStyle === "cardinal-header" || t.headerStyle === "tech-line";

  return (
    <div
      style={{
        padding: headerBg ? "18px 14px 12px" : "14px 14px 10px",
        background: headerBg
          ? t.headerStyle === "gradient-bar"
            ? `linear-gradient(135deg, ${t.accentColor}88 0%, transparent 100%)`
            : t.accentColor + "22"
          : "transparent",
        borderBottom: t.headerStyle === "underline" || t.headerStyle === "elegant-underline" || t.headerStyle === "ivy-underline"
          ? `2px solid ${t.accentColor}`
          : t.headerStyle === "classic-bar" || t.headerStyle === "royal-border"
          ? `3px double ${t.accentColor}`
          : t.headerStyle === "orange-accent"
          ? `2px solid ${t.accentColor}`
          : "1px solid " + t.secondaryText + "30",
        textAlign: t.headerStyle === "classic" || t.headerStyle === "traditional" ? "center" : "left",
      } as React.CSSProperties}
    >
      <div style={{ fontWeight: 700, fontSize: 15, color: t.textColor, letterSpacing: "-0.3px" }}>Mario Rossi</div>
      <div style={{ fontSize: 10, color: t.accentColor, fontWeight: 600, marginTop: 2 }}>
        Senior Full Stack Developer
      </div>
      {t.headerStyle !== "minimal" && t.headerStyle !== "plain" && (
        <div style={{ fontSize: 7, color: t.secondaryText, marginTop: 3, display: "flex", gap: 6 }}>
          <span>m.rossi@email.com</span>
          <span>+39 340 123 4567</span>
          <span>Milano</span>
        </div>
      )}
    </div>
  );
}

function SidebarPreview({ template: t }: { template: TemplateData }) {
  return (
    <div
      style={{
        width: 100,
        minWidth: 100,
        padding: "10px 10px",
        backgroundColor: t.accentColor + "10",
        borderRight: "1px solid " + t.secondaryText + "20",
      } as React.CSSProperties}
    >
      <SectionLabel text="Competenze" color={t.accentColor} />
      <SkillsPreview template={t} compact />
      <div style={{ marginTop: 10 }}>
        <SectionLabel text="Lingue" color={t.accentColor} />
        <div style={{ fontSize: 7, color: t.textColor, marginTop: 3 }}>
          <div>Italiano: Madrelingua</div>
          <div>Inglese: C1</div>
        </div>
      </div>
    </div>
  );
}

function MainContent({ template: t }: { template: TemplateData }) {
  return (
    <div style={{ flex: 1, padding: "10px 14px" }}>
      <SectionLabel text="Profilo" color={t.accentColor} />
      <div style={{ fontSize: 7, color: t.secondaryText, marginTop: 3, lineHeight: 1.5 }}>
        Professionista con oltre 8 anni di esperienza nello sviluppo di applicazioni web enterprise.
      </div>

      <div style={{ marginTop: 10 }}>
        <SectionLabel text="Esperienza" color={t.accentColor} />
        <div style={{ marginTop: 4 }}>
          <ExperienceRow company="TechCorp Italia" role="Senior Developer" period="2021 - Presente" textColor={t.textColor} accentColor={t.accentColor} secondaryText={t.secondaryText} />
          <ExperienceRow company="Digital Agency" role="Full Stack Dev" period="2018 - 2021" textColor={t.textColor} accentColor={t.accentColor} secondaryText={t.secondaryText} />
        </div>
      </div>

      <div style={{ marginTop: 8 }}>
        <SectionLabel text="Istruzione" color={t.accentColor} />
        <div style={{ fontSize: 7, color: t.textColor, marginTop: 3 }}>
          <span style={{ fontWeight: 600 }}>Politecnico di Milano</span>
          <span style={{ color: t.secondaryText }}> — Laurea in Informatica, 2018</span>
        </div>
      </div>

      {t.layout !== "two-column" && (
        <div style={{ marginTop: 8 }}>
          <SectionLabel text="Competenze" color={t.accentColor} />
          <SkillsPreview template={t} />
        </div>
      )}
    </div>
  );
}

function SectionLabel({ text, color }: { text: string; color: string }) {
  return (
    <div
      style={{
        fontSize: 8,
        fontWeight: 700,
        color,
        textTransform: "uppercase",
        letterSpacing: "1px",
        borderBottom: "1px solid " + color + "50",
        paddingBottom: 2,
      } as React.CSSProperties}
    >
      {text}
    </div>
  );
}

function ExperienceRow({ company, role, period, textColor, accentColor, secondaryText }: { company: string; role: string; period: string; textColor: string; accentColor: string; secondaryText: string }) {
  return (
    <div style={{ marginBottom: 5 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontWeight: 600, fontSize: 8, color: textColor }}>{company}</span>
        <span style={{ fontSize: 6.5, color: secondaryText }}>{period}</span>
      </div>
      <div style={{ fontSize: 7, color: accentColor, fontWeight: 500 }}>{role}</div>
    </div>
  );
}

function SkillsPreview({ template: t, compact }: { template: TemplateData; compact?: boolean }) {
  const skills = ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker", "MongoDB"];
  const displaySkills = compact ? skills.slice(0, 4) : skills;

  if (t.skillsStyle === "tags" || t.skillsStyle === "chips" || t.skillsStyle === "badges" || t.skillsStyle === "clean-tags" || t.skillsStyle === "elegant-tags") {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 4 }}>
        {displaySkills.map((s, i) => (
          <span
            key={i}
            style={{
              padding: "1px 5px",
              fontSize: 6.5,
              borderRadius: t.skillsStyle === "badges" || t.skillsStyle === "clean-tags" || t.skillsStyle === "elegant-tags" ? 10 : 3,
              backgroundColor: t.accentColor + "20",
              color: t.accentColor,
              border: t.skillsStyle === "badges" ? `1px solid ${t.accentColor}40` : "none",
              fontWeight: 500,
            } as React.CSSProperties}
          >
            {s}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div style={{ marginTop: 4, fontSize: 7, color: t.textColor, lineHeight: 1.7 }}>
      {displaySkills.map((s, i) => (
        <span key={i}>
          {s}{i < displaySkills.length - 1 ? <span style={{ color: t.secondaryText }}> • </span> : ""}
        </span>
      ))}
    </div>
  );
}
