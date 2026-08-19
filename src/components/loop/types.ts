export type LoopDemoType = "digest" | "diff" | "score" | "letter" | "prep";

export interface LoopStep {
  /** Progress label shown above the title, e.g. "01 / 05" */
  index: string;
  /** Short step name, e.g. "Crea" */
  title: string;
  /** One-line summary under the title */
  headline: string;
  /** 1-2 sentences expanding the step */
  description: string;
  /** Which visual demo the step renders */
  demoType: LoopDemoType;
}
