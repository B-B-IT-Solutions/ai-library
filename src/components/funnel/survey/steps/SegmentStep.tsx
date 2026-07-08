import { map } from "es-toolkit/compat";

import { DSurveySegment } from "@/data/types/domain/funnel/survey";

import { SURVEY_SEGMENTS } from "./survey-data";

type Props = {
   onSelect: (segment: DSurveySegment) => void;
};

const SEGMENT_OPTIONS: { segment: DSurveySegment; emoji: string }[] = [
   { segment: "solo", emoji: "🏢" },
   { segment: "employee", emoji: "💼" },
   { segment: "coach", emoji: "🎯" },
   { segment: "default", emoji: "✨" },
];

export const SegmentStep = ({ onSelect }: Props) => {
   return (
      <div data-testid="segment-step">
         <h2 className="mb-2 text-center text-sm font-semibold tracking-widest text-blue-600 uppercase">
            Schritt 1
         </h2>
         <p className="mb-8 text-center text-xl font-semibold text-slate-800">
            Was beschreibt deine Situation am besten?
         </p>
         <div className="grid gap-3 sm:grid-cols-2">
            {map(SEGMENT_OPTIONS, ({ segment, emoji }) => (
               <button
                  key={segment}
                  onClick={() => onSelect(segment)}
                  className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 text-left transition-all hover:border-blue-400 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  data-testid={`segment-option-${segment}`}
               >
                  <span className="text-2xl">{emoji}</span>
                  <span className="text-sm font-medium text-slate-700">
                     {SURVEY_SEGMENTS[segment]}
                  </span>
               </button>
            ))}
         </div>
      </div>
   );
};
