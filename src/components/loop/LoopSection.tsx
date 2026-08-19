"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { LoopDemoType, LoopStep } from "./types";
import StepTracker from "./StepTracker";
import Step01 from "./Step01";
import Step02 from "./Step02";
import Step03 from "./Step03";
import Step04 from "./Step04";
import Step05 from "./Step05";

/** Static per-step demo type, merged with the translatable content from i18n. */
const DEMO_TYPES: LoopDemoType[] = ["digest", "score", "diff", "letter", "prep"];

const STEP_COMPONENTS = [Step01, Step02, Step03, Step04, Step05];

export default function LoopSection() {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);
  const tLoop = t.loop as Record<string, unknown>;
  const rawSteps = (tLoop.steps as Array<Record<string, string>>) ?? [];

  const steps: LoopStep[] = rawSteps.map((s, i) => ({
    index: s.index ?? "",
    title: s.title ?? "",
    headline: s.headline ?? "",
    description: s.description ?? "",
    demoType: DEMO_TYPES[i] ?? "digest",
  }));

  return (
    <section id="loop" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-fuchsia-400 mb-3 px-3 py-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10">
            {tLoop.eyebrow as string}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {tLoop.title as string}
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            {tLoop.subtitle as string}
          </p>
        </div>

        {/* One vertical section per step */}
        <div className="flex flex-col">
          {steps.map((step, i) => {
            const Step = STEP_COMPONENTS[i];
            return (
              <StepTracker key={step.index || i} index={i} onActive={setActiveStep}>
                <Step step={step} active={activeStep === i} />
              </StepTracker>
            );
          })}
        </div>
      </div>
    </section>
  );
}
