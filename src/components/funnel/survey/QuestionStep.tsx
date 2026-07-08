import { FC } from "react";

import { Button } from "@/components/shadcn/button";
import { DSurveyQuestion, DSurveyScore } from "@/data/types/domain/funnel/survey";

import { ProgressBar } from "./ProgressBar";

type QuestionStepProps = {
   question: DSurveyQuestion;
   questionIndex: number;
   totalQuestions: number;
   currentAnswer: DSurveyScore | undefined;
   onAnswer: (score: DSurveyScore) => void;
   onBack: () => void;
};

export const QuestionStep: FC<QuestionStepProps> = ({
   question,
   questionIndex,
   totalQuestions,
   currentAnswer,
   onAnswer,
   onBack,
}) => {
   return (
      <div data-testid="question-step">
         <ProgressBar current={questionIndex + 1} total={totalQuestions} />
         <p className="mb-6 text-xl font-semibold text-slate-800">
            {question.text}
         </p>
         <div className="flex flex-col gap-3">
            {question.answers.map((option) => {
               const isSelected = currentAnswer === option.score;
               return (
                  <button
                     key={option.score}
                     onClick={() => onAnswer(option.score)}
                     className={`rounded-xl border p-4 text-left text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                        isSelected
                           ? "border-blue-500 bg-blue-50 text-blue-800"
                           : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-slate-50"
                     }`}
                     data-testid={`answer-option-${option.score}`}
                  >
                     {option.label}
                  </button>
               );
            })}
         </div>
         <div className="mt-6">
            <Button
               variant="ghost"
               size="sm"
               onClick={onBack}
               data-testid="back-button"
            >
               ← Zurück
            </Button>
         </div>
      </div>
   );
};
