"use client";

import {
   DSurveyAnswers,
   DSurveyDimension,
   DSurveyQuestion,
   DSurveyResult,
   DSurveyScore,
   DSurveySegment,
} from "@/data/types/domain/funnel/survey";

export type DSurveyStep =
   | { kind: "intro" }
   | { kind: "segment" }
   | { kind: "question"; index: number }
   | { kind: "analysis" }
   | { kind: "email" }
   | { kind: "result" };

export type DSurveyState = {
   step: DSurveyStep;
   segment: DSurveySegment | null;
   questions: DSurveyQuestion[];
   answers: Partial<DSurveyAnswers>;
   result: DSurveyResult | null;
};

export type DSurveyAction =
   | { type: "START" }
   | {
        type: "SEGMENT_SELECTED";
        segment: DSurveySegment;
        questions: DSurveyQuestion[];
     }
   | {
        type: "ANSWERED";
        dimension: DSurveyDimension;
        score: DSurveyScore;
     }
   | { type: "BACK" }
   | { type: "ANALYSIS_DONE" }
   | {
        type: "SUBMITTED";
        result: DSurveyResult;
     }
   | { type: "RESTART" };

export const initialSurveyState: DSurveyState = {
   step: { kind: "intro" },
   segment: null,
   questions: [],
   answers: {},
   result: null,
};

export const surveyStateReducer = (
   state: DSurveyState,
   action: DSurveyAction
): DSurveyState => {
   switch (action.type) {
      case "START":
         return { ...initialSurveyState, step: { kind: "segment" } };

      case "SEGMENT_SELECTED":
         return {
            ...state,
            segment: action.segment,
            questions: action.questions,
            answers: {},
            step: { kind: "question", index: 0 },
         };

      case "ANSWERED": {
         if (state.step.kind !== "question") {
            return state;
         }
         const answers = {
            ...state.answers,
            [action.dimension]: action.score,
         };
         const nextIndex = state.step.index + 1;
         const step: DSurveyStep =
            nextIndex < state.questions.length
               ? { kind: "question", index: nextIndex }
               : { kind: "analysis" };
         return { ...state, answers, step };
      }

      case "BACK": {
         if (state.step.kind !== "question") return state;
         return {
            ...state,
            step: {
               kind: "question",
               index: Math.max(0, state.step.index - 1),
            },
         };
      }

      case "ANALYSIS_DONE":
         return { ...state, step: { kind: "email" } };

      case "SUBMITTED":
         return { ...state, result: action.result, step: { kind: "result" } };

      case "RESTART":
         return initialSurveyState;

      default:
         return state;
   }
};
