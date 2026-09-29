"use client";

import { motion } from "framer-motion";
import { cvTemplates, getTemplateById } from "@/lib/templates/cvTemplates";
import { getTemplateAdvice } from "@/lib/careerKit";
import TemplatePreview from "@/components/TemplatePreview";
import { useLanguage } from "@/context/LanguageContext";

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelect: (id: string) => void;
  showDetails?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function TemplateSelector({ selectedTemplate, onSelect, showDetails = true, size = "md" }: TemplateSelectorProps) {
  const { t, lang } = useLanguage();
  const tTemplates = t.templates as Record<string, string>;
  return (
    <div className="space-y-4">
      {showDetails && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-1">{tTemplates.chooseTitle}</h3>
          <p className="text-zinc-400 text-sm">{tTemplates.chooseDesc}</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {cvTemplates.map((template, index: number) => {
          const advice = getTemplateAdvice(template, lang);
          return (
            <motion.button
              key={template.id as string}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(template.id as string)}
              className={`relative group rounded-xl overflow-hidden transition-all duration-300 ${
                selectedTemplate === template.id
                  ? "ring-2 ring-indigo-500 shadow-lg shadow-indigo-500/20"
                  : "hover:ring-1 hover:ring-white/20 hover:shadow-lg hover:shadow-black/20"
              }`}
            >
              <TemplatePreview templateId={template.id as string} size={size} />

              <div
                className="p-2 text-center"
                style={{ backgroundColor: template.id === "creativo" ? "#2d1f3d" : template.id === "tech" ? "#1e293b" : "#1f2937" } as React.CSSProperties}
              >
                <p className="text-white text-xs font-medium">{template.name as string}</p>
                <p className={advice.label === "ATS-safe" ? "text-emerald-300 text-[10px]" : "text-zinc-400 text-[10px]"}>
                  {advice.label}
                </p>
              </div>

              {selectedTemplate === template.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {showDetails && selectedTemplate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: (getTemplateById(selectedTemplate) as unknown as Record<string, unknown>).accentColor as string + "20" } as React.CSSProperties}
            >
              <svg
                className="w-5 h-5"
                style={{ color: (getTemplateById(selectedTemplate) as unknown as Record<string, unknown>).accentColor as string } as React.CSSProperties}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6 m-6 4 h6 m2 5 H7 a2 2 0 01 -2 -2 V5 a2 2 0 01 2 -2 h5.586 a1 1 0 01 .707 .293 l5.414 5.414 a1 1 0 01 .293 .707 V19 a2 2 0 01 -2 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">{(getTemplateById(selectedTemplate) as unknown as Record<string, unknown>).name as string}</p>
              <p className="text-zinc-400 text-sm">{(getTemplateById(selectedTemplate) as unknown as Record<string, unknown>).description as string}</p>
              <p className="text-zinc-500 text-xs mt-1">
                {getTemplateAdvice(getTemplateById(selectedTemplate), lang).warning}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
