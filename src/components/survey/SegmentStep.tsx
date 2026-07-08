import type { Segment } from "@/lib/survey-data";
import { SEGMENT_LABELS } from "@/lib/survey-data";

interface SegmentStepProps {
   onSelect: (segment: Segment) => void;
}

const SEGMENT_OPTIONS: { segment: Segment; emoji: string }[] = [
   { segment: "solo", emoji: "🏢" },
   { segment: "employee", emoji: "💼" },
   { segment: "coach", emoji: "🎯" },
   { segment: "default", emoji: "✨" },
];

export const SegmentStep = ({ onSelect }: SegmentStepProps) => {
   return (
      <div data-testid="segment-step">
         <h2 className="mb-2 text-center text-sm font-semibold uppercase tracking-widest text-blue-600">
            Schritt 1
         </h2>
         <p className="mb-8 text-center text-xl font-semibold text-slate-800">
            Was beschreibt deine Situation am besten?
         </p>
         <div className="grid gap-3 sm:grid-cols-2">
            {SEGMENT_OPTIONS.map(({ segment, emoji }) => (
               <button
                  key={segment}
                  onClick={() => onSelect(segment)}
                  className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 text-left transition-all hover:border-blue-400 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  data-testid={`segment-option-${segment}`}
               >
                  <span className="text-2xl">{emoji}</span>
                  <span className="text-sm font-medium text-slate-700">
                     {SEGMENT_LABELS[segment]}
                  </span>
               </button>
            ))}
         </div>
      </div>
   );
};
