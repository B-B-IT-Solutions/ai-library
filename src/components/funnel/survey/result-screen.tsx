import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { DSurveyResult } from "@/data/types/domain/funnel/survey";

const SCORE_MIN = 8;
const SCORE_MAX = 32;

type Props = {
   result: DSurveyResult;
   onRestart: () => void;
};

export const ResultScreen = ({ result, onRestart }: Props) => {
   const percent = Math.round(
      ((result.total - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 100
   );

   return (
      <div className="flex flex-col gap-6" data-testid="result-screen">
         <div className="text-center">
            <span className="text-4xl">{result.stageEmoji}</span>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
               {result.stageLabel}
            </h2>
            <p
               className="mt-1 text-sm font-medium text-blue-600"
               data-testid="result-score"
            >
               Dein Score: {result.total}/32
            </p>
         </div>

         <div>
            <div className="mb-1 flex justify-between text-xs text-slate-400">
               <span>8</span>
               <span>32</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
               <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-700"
                  style={{ width: `${percent}%` }}
                  data-testid="score-bar"
               />
            </div>
         </div>

         <p
            className="text-sm leading-relaxed text-slate-700"
            data-testid="result-text"
         >
            {result.stageText}
         </p>

         <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
            <p className="mb-3 text-sm font-semibold text-slate-800">
               Deine größten Hebel gerade:
            </p>
            <ul className="flex flex-col gap-2" data-testid="levers-list">
               {result.leverTexts.map((text, i) => (
                  <li
                     key={i}
                     className="flex items-start gap-2 text-sm text-slate-700"
                  >
                     <span className="mt-0.5 text-blue-500">→</span>
                     {text}
                  </li>
               ))}
            </ul>
         </div>

         <Button asChild size="lg" className="w-full" data-testid="cta-button">
            <Link href={result.ctaHref}>{result.ctaText}</Link>
         </Button>

         <button
            onClick={onRestart}
            className="text-center text-sm text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline"
            data-testid="restart-button"
         >
            Check nochmal machen
         </button>
      </div>
   );
};
