import Link from "next/link";

import { Button } from "@/components/shadcn/button";

const SCORE_MIN = 8;
const SCORE_MAX = 32;

interface ResultScreenProps {
   stage: 1 | 2 | 3 | 4;
   total: number;
   stageLabel: string;
   stageEmoji: string;
   stageText: string;
   ctaText: string;
   ctaHref: string;
   leverTexts: [string, string];
   onRestart: () => void;
}

export const ResultScreen = ({
   stage,
   total,
   stageLabel,
   stageEmoji,
   stageText,
   ctaText,
   ctaHref,
   leverTexts,
   onRestart,
}: ResultScreenProps) => {
   const percent = Math.round(
      ((total - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 100
   );

   return (
      <div className="flex flex-col gap-6" data-testid="result-screen">
         <div className="text-center">
            <span className="text-4xl">{stageEmoji}</span>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
               {stageLabel}
            </h2>
            <p className="mt-1 text-sm font-medium text-blue-600" data-testid="result-score">
               Dein Score: {total}/32
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

         <p className="text-sm leading-relaxed text-slate-700" data-testid="result-text">
            {stageText}
         </p>

         <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
            <p className="mb-3 text-sm font-semibold text-slate-800">
               Deine größten Hebel gerade:
            </p>
            <ul className="flex flex-col gap-2" data-testid="levers-list">
               {leverTexts.map((text, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                     <span className="mt-0.5 text-blue-500">→</span>
                     {text}
                  </li>
               ))}
            </ul>
         </div>

         <Button asChild size="lg" className="w-full" data-testid="cta-button">
            <Link href={ctaHref}>{ctaText}</Link>
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
