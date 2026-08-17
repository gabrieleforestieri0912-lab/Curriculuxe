import type { AnalysisResult } from "@/lib/supabase/types";
import { getTemplateById } from "@/lib/templates/cvTemplates";

export const generateTxtContent = (res: AnalysisResult): string => {
  let content = `ANALISI CURRICULUM VITAE\n`;
  content += `========================\n\n`;
  content += `PUNTEGGIO: ${res.score}/100\n`;
  content += `${res.overall}\n\n`;
  content += `PUNTI DI FORZA:\n`;
  res.strengths.forEach((s, i) => {
    content += `${i + 1}. ${s}\n`;
  });
  content += `\nAREE DI MIGLIORAMENTO:\n`;
  res.improvements.forEach((imp, i) => {
    content += `${i + 1}. [${imp.impact.toUpperCase()}] ${imp.area}: ${imp.description}\n`;
  });
  content += `\nREVISIONE COMPLETA:\n${res.review}`;
  return content;
};

export const exportToTxt = async (res: AnalysisResult, selectedTemplate: string, file: File | undefined, setIsExporting: (v: boolean) => void): Promise<void> => {
  setIsExporting(true);
  const template = getTemplateById(selectedTemplate);
  const content = generateTxtContent(res) + `\n\n--- Template: ${template.name} | Curriculuxe AI ---`;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cv-review-${template.id}-${file?.name || "curriculum"}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  setIsExporting(false);
};

export const exportToDoc = async (res: AnalysisResult, selectedTemplate: string, file: File | undefined, setIsExporting: (v: boolean) => void): Promise<void> => {
  setIsExporting(true);
  const template = getTemplateById(selectedTemplate);
  const content = generateTxtContent(res);
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8"><title>CV Review - ${template.name}</title></head>
    <body style="font-family: ${template.fontFamily}; color: ${template.textColor}; background-color: ${template.bgColor}; padding: 40px;">
      <h1 style="color: ${template.accentColor}; border-bottom: 2px solid ${template.accentColor}; padding-bottom: 10px;">Analisi Curriculum Vitae</h1>
      <hr>
      <h2 style="color: ${template.accentColor};">Punteggio: <span style="color: ${template.accentColor};">${res.score}/100</span></h2>
      <p><strong>${res.overall}</strong></p>
      <h3 style="color: ${template.textColor};">Punti di forza:</h3>
      <ul>${res.strengths.map(s => `<li>${s}</li>`).join("")}</ul>
      <h3 style="color: ${template.textColor};">Aree di miglioramento:</h3>
      <ul>${res.improvements.map(imp => `<li><strong>[${imp.impact}]</strong> ${imp.area}: ${imp.description}</li>`).join("")}</ul>
      <h3 style="color: ${template.textColor};">Revisione completa:</h3>
      <p>${res.review}</p>
      <p style="margin-top: 30px; font-size: 12px; color: ${template.secondaryText}; border-top: 1px solid ${template.secondaryText}; padding-top: 10px;">
        Template: ${template.name} | Analisi generata da Curriculuxe AI - ${new Date().toLocaleDateString("it-IT")}
      </p>
    </body>
    </html>
  `;
  const blob = new Blob([html], { type: "application/vnd.ms-word;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cv-review-${template.id}-${file?.name || "curriculum"}.doc`;
  a.click();
  URL.revokeObjectURL(url);
  setIsExporting(false);
};

export const exportToPdf = async (res: AnalysisResult, selectedTemplate: string, file: File | undefined, setIsExporting: (v: boolean) => void, showToast?: (msg: string) => void): Promise<void> => {
  setIsExporting(true);
  try {
    const html2pdf = (await import('html2pdf.js')).default;
    const template = getTemplateById(selectedTemplate);
    
    const container = document.createElement("div");
    container.innerHTML = `
      <div style="font-family: ${template.fontFamily}; padding: 40px; color: ${template.textColor}; background-color: ${template.bgColor}; line-height: 1.6; max-width: 800px; margin: 0 auto;">
        <h1 style="color: ${template.accentColor}; border-bottom: 2px solid ${template.accentColor}; padding-bottom: 10px;">Analisi Curriculum Vitae</h1>
        <p style="font-size: 28px; font-weight: bold; color: ${template.accentColor};">Punteggio: ${res.score}/100</p>
        <p style="font-size: 16px;"><strong>${res.overall}</strong></p>
        
        <div style="background: ${template.accentColor}10; padding: 15px; border-radius: 8px; border-left: 4px solid #22c55e; margin-top: 20px;">
          <h2 style="color: ${template.accentColor}; margin-top: 0;">Punti di forza:</h2>
          <ul style="margin-left: 20px;">${res.strengths.map(s => `<li>${s}</li>`).join("")}</ul>
        </div>
        
        <div style="background: ${template.accentColor}10; padding: 15px; border-radius: 8px; border-left: 4px solid #eab308; margin-top: 20px;">
          <h2 style="color: ${template.accentColor}; margin-top: 0;">Aree di miglioramento:</h2>
          <ul style="margin-left: 20px;">${res.improvements.map(imp => `<li><strong>[${imp.impact.toUpperCase()}] ${imp.area}:</strong> ${imp.description}</li>`).join("")}</ul>
        </div>
        
        <h2 style="color: ${template.accentColor}; margin-top: 20px;">Revisione completa:</h2>
        <p>${res.review}</p>
        
        <p style="margin-top: 40px; font-size: 12px; color: ${template.secondaryText}; border-top: 1px solid ${template.secondaryText}; padding-top: 10px;">
          Template: ${template.name} | Analisi generata da Curriculuxe AI - ${new Date().toLocaleDateString("it-IT")}
        </p>
      </div>
    `;

    const opt = {
      margin:       0.5,
      filename:     `cv-review-${template.id}-${file?.name || "curriculum"}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const }
    };

    await html2pdf().set(opt).from(container).save();
  } catch (e) {
    console.error(e);
    showToast?.("Errore esportazione PDF");
  } finally {
    setIsExporting(false);
  }
};
