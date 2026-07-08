"use client";

import { useCallback, useReducer } from "react";
import { toast } from "sonner";

import { submitSurvey } from "@/data/actions/funnel/survey";
import {
   DSubmitSurveyInput,
   DSurveyAnswers,
   DSurveyData,
   DSurveyDimension,
   DSurveyQuestion,
   DSurveyResult,
   DSurveyScore,
   DSurveySegment,
} from "@/data/types/domain/funnel/survey";

import { AnalysisLoader } from "./AnalysisLoader";
import { EmailGateStep } from "./EmailGateStep";
import { IntroScreen } from "./intro-screen";
import { QuestionStep } from "./QuestionStep";
import { ResultScreen } from "./ResultScreen";
import { SegmentStep } from "./SegmentStep";

type Step =
   | { kind: "intro" }
   | { kind: "segment" }
   | { kind: "question"; index: number }
   | { kind: "analysis" }
   | { kind: "email" }
   | { kind: "result" };

type State = {
   step: Step;
   segment: DSurveySegment | null;
   questions: DSurveyQuestion[];
   answers: Partial<DSurveyAnswers>;
   result: DSurveyResult | null;
};

type Action =
   | { type: "START" }
   | {
        type: "SEGMENT_SELECTED";
        segment: DSurveySegment;
        questions: DSurveyQuestion[];
     }
   | { type: "ANSWERED"; dimension: DSurveyDimension; score: DSurveyScore }
   | { type: "BACK" }
   | { type: "ANALYSIS_DONE" }
   | { type: "SUBMITTED"; result: DSurveyResult }
   | { type: "RESTART" };

const initialState: State = {
   step: { kind: "intro" },
   segment: null,
   questions: [],
   answers: {},
   result: null,
};

const surveyReducer = (state: State, action: Action): State => {
   switch (action.type) {
      case "START":
         return { ...initialState, step: { kind: "segment" } };

      case "SEGMENT_SELECTED":
         return {
            ...state,
            segment: action.segment,
            questions: action.questions,
            answers: {},
            step: { kind: "question", index: 0 },
         };

      case "ANSWERED": {
         if (state.step.kind !== "question") return state;
         const answers = { ...state.answers, [action.dimension]: action.score };
         const nextIndex = state.step.index + 1;
         const step: Step =
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
         return initialState;

      default:
         return state;
   }
};

type Props = {
   data: DSurveyData;
};

export const SurveyContainer = ({ data }: Props) => {
   const [state, dispatch] = useReducer(surveyReducer, initialState);

   const handleStart = useCallback(() => dispatch({ type: "START" }), []);

   const handleSegmentSelect = useCallback(
      (selected: DSurveySegment) => {
         dispatch({
            type: "SEGMENT_SELECTED",
            segment: selected,
            questions: data[selected],
         });
      },
      [data]
   );

   const handleAnswer = useCallback(
      (score: DSurveyScore) => {
         if (state.step.kind !== "question") return;
         const dimension = state.questions[state.step.index].id;
         dispatch({ type: "ANSWERED", dimension, score });
      },
      [state.step, state.questions]
   );

   const handleBack = useCallback(() => dispatch({ type: "BACK" }), []);

   const handleAnalysisDone = useCallback(
      () => dispatch({ type: "ANALYSIS_DONE" }),
      []
   );

   const handleEmailSubmit = useCallback(
      async (email: string, firstName: string) => {
         if (!state.segment) return;
         const payload: DSubmitSurveyInput = {
            email,
            firstName: firstName || undefined,
            segment: state.segment,
            answers: state.answers as DSurveyAnswers,
         };
         const actionResult = await submitSurvey(payload);
         if (actionResult.success && actionResult.data) {
            dispatch({ type: "SUBMITTED", result: actionResult.data });
         } else {
            toast.error(actionResult.message);
         }
      },
      [state.segment, state.answers]
   );

   const handleRestart = useCallback(() => dispatch({ type: "RESTART" }), []);

   const { step, questions, answers, result } = state;
   const questionStep = step.kind === "question" ? step : null;
   const currentQuestion = questionStep ? questions[questionStep.index] : null;

   return (
      <div
         className="mx-auto w-full max-w-lg px-4 py-12"
         data-testid="survey-container"
      >
         {step.kind === "intro" && <IntroScreen onStart={handleStart} />}
         {step.kind === "segment" && (
            <SegmentStep
               segmentLabels={segments}
               onSelect={handleSegmentSelect}
            />
         )}
         {currentQuestion && questionStep && (
            <QuestionStep
               question={currentQuestion}
               questionIndex={questionStep.index}
               totalQuestions={questions.length}
               currentAnswer={answers[currentQuestion.id]}
               onAnswer={handleAnswer}
               onBack={handleBack}
            />
         )}
         {step.kind === "analysis" && (
            <AnalysisLoader onDone={handleAnalysisDone} />
         )}
         {step.kind === "email" && (
            <EmailGateStep onSubmit={handleEmailSubmit} />
         )}
         {step.kind === "result" && result && (
            <ResultScreen
               stage={result.stage}
               total={result.total}
               stageLabel={result.stageLabel}
               stageEmoji={result.stageEmoji}
               stageText={result.stageText}
               ctaText={result.ctaText}
               ctaHref={result.ctaHref}
               leverTexts={result.leverTexts}
               onRestart={handleRestart}
            />
         )}
      </div>
   );
};
