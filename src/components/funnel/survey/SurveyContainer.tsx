"use client";

import { useCallback, useReducer } from "react";
import { toast } from "sonner";

import { submitSurvey } from "@/data/actions/funnel/survey";
import {
   DSubmitSurveyInput,
   DSurveyAnswers,
   DSurveyData,
   DSurveyScore,
   DSurveySegment,
} from "@/data/types/domain/funnel/survey";

import { AnalysisLoader } from "./AnalysisLoader";
import { EmailGateStep } from "./EmailGateStep";
import { IntroScreen } from "./intro-screen";
import { QuestionStep } from "./QuestionStep";
import { ResultScreen } from "./ResultScreen";
import { SegmentStep } from "./SegmentStep";
import {
   initialSurveyState,
   surveyReducer as surveyStateReducer,
} from "./survey-state";

type Props = {
   data: DSurveyData;
};

export const SurveyContainer = ({ data }: Props) => {
   const [state, dispatch] = useReducer(surveyStateReducer, initialSurveyState);

   const startSurvey = useCallback(() => dispatch({ type: "START" }), []);

   const restartSurvey = useCallback(() => dispatch({ type: "RESTART" }), []);

   const previousQuestion = useCallback(() => dispatch({ type: "BACK" }), []);

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

   const { step, questions, answers, result } = state;
   const questionStep = step.kind === "question" ? step : null;
   const currentQuestion = questionStep ? questions[questionStep.index] : null;

   return (
      <div
         className="mx-auto w-full max-w-lg px-4 py-12"
         data-testid="survey-container"
      >
         {step.kind === "intro" && <IntroScreen onStart={startSurvey} />}
         {step.kind === "segment" && (
            <SegmentStep onSelect={handleSegmentSelect} />
         )}
         {currentQuestion && questionStep && (
            <QuestionStep
               question={currentQuestion}
               questionIndex={questionStep.index}
               totalQuestions={questions.length}
               currentAnswer={answers[currentQuestion.id]}
               onAnswer={handleAnswer}
               onBack={previousQuestion}
            />
         )}
         {step.kind === "analysis" && (
            <AnalysisLoader onDone={handleAnalysisDone} />
         )}
         {step.kind === "email" && (
            <EmailGateStep onSubmit={handleEmailSubmit} />
         )}
         {step.kind === "result" && result && (
            <ResultScreen result={result} onRestart={restartSurvey} />
         )}
      </div>
   );
};
