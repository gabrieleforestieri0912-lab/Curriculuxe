import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const chips = ["ATS Score", "AI Resume", "Tailoring", "Interview Prep"];

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#07070d",
          backgroundImage:
            "radial-gradient(circle at 12% 8%, rgba(232,121,249,0.28), transparent 42%), radial-gradient(circle at 88% 88%, rgba(129,140,248,0.24), transparent 45%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "linear-gradient(135deg, #e879f9, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 700,
              color: "#0b0b14",
            }}
          >
            C
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, color: "#ffffff", letterSpacing: -1 }}>
            Curriculuxe
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 940,
            }}
          >
            Build the Perfect Resume with AI
          </div>
          <div style={{ fontSize: 30, color: "#a1a1aa", maxWidth: 880, lineHeight: 1.35 }}>
            ATS score, AI resume generation, bullet rewriting and interview prep.
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {chips.map((chip) => (
            <div
              key={chip}
              style={{
                padding: "12px 24px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(255,255,255,0.06)",
                color: "#e4e4e7",
                fontSize: 24,
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
