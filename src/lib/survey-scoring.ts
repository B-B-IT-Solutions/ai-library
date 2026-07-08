import type { Dimension, SurveyAnswers } from "./survey-data";

const DIMENSION_ORDER: Dimension[] = [
   "freq",
   "prompting",
   "tooling",
   "files",
   "automation",
   "integration",
   "quality",
   "timesaving",
];

export function calculateStage(total: number): 1 | 2 | 3 | 4 {
   if (total <= 14) return 1;
   if (total <= 20) return 2;
   if (total <= 26) return 3;
   return 4;
}

// Returns the 2 dimensions with the lowest score.
// Ties are broken by fixed dimension order (earlier position wins).
export function calculateLevers(answers: SurveyAnswers): [Dimension, Dimension] {
   const sorted = DIMENSION_ORDER.map((dim) => ({
      dim,
      score: answers[dim],
   })).sort((a, b) => a.score - b.score);
   return [sorted[0].dim, sorted[1].dim];
}
