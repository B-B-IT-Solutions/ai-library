"use client";

import { useCallback, useState } from "react";

import { submitSurvey } from "@/data/actions/survey";
import type { Dimension, Score, Segment, SurveyAnswers } from "@/lib/survey-data";
import { SURVEY_DATA } from "@/lib/survey-data";

import { AnalysisLoader } from "./AnalysisLoader";
import { EmailGateStep } from "./EmailGateStep";
import { IntroScreen } from "./IntroScreen";
import { QuestionStep } from "./QuestionStep";
import { ResultScreen } from "./ResultScreen";
import { SegmentStep } from "./SegmentStep";

const TOTAL_QUESTIONS = 8;

// Steps: 0=intro, 1=segment, 2-9=questions, 10=analysis, 11=email, 12=result
const QUESTION_START = 2;
const QUESTION_END = 9;
const ANALYSIS_STEP = 10;
const EMAIL_STEP = 11;
const RESULT_STEP = 12;

interface SurveyState {
   step: number;
   segment: Segment | null;
   answers: Partial<SurveyAnswers>;
   result: {
      stage: 1 | 2 | 3 | 4;
      total: number;
      levers: [Dimension, Dimension];
   } | null;
   isLoading: boolean;
}

const INITIAL_STATE: SurveyState = {
   step: 0,
   segment: null,
   answers: {},
   result: null,
   isLoading: false,
};

export const SurveyContainer = () => {
   const [state, setState] = useState<SurveyState>(INITIAL_STATE);

   const handleStart = useCallback(() => {
      setState((s) => ({ ...s, step: 1 }));
   }, []);

   const handleSegmentSelect = useCallback((segment: Segment) => {
      setState((s) => ({ ...s, segment, step: QUESTION_START }));
   }, []);

   const handleAnswer = useCallback((score: Score) => {
      setState((s) => {
         const questionIndex = s.step - QUESTION_START;
         const dimension = SURVEY_DATA[s.segment!][questionIndex].id;
         const newAnswers = { ...s.answers, [dimension]: score };
         const nextStep = s.step < QUESTION_END ? s.step + 1 : ANALYSIS_STEP;
         return { ...s, answers: newAnswers, step: nextStep };
      });
   }, []);

   const handleBack = useCallback(() => {
      setState((s) => ({ ...s, step: Math.max(QUESTION_START, s.step - 1) }));
   }, []);

   const handleAnalysisDone = useCallback(() => {
      setState((s) => ({ ...s, step: EMAIL_STEP }));
   }, []);

   const handleEmailSubmit = useCallback(
      async (email: string, firstName: string) => {
         setState((s) => ({ ...s, isLoading: true }));
         try {
            const result = await submitSurvey({
               email,
               firstName: firstName || undefined,
               segment: state.segment,
               answers: state.answers as SurveyAnswers,
            });
            setState((s) => ({
               ...s,
               result,
               step: RESULT_STEP,
               isLoading: false,
            }));
         } catch {
            setState((s) => ({ ...s, isLoading: false }));
         }
      },
      [state.segment, state.answers]
   );

   const handleRestart = useCallback(() => {
      setState(INITIAL_STATE);
   }, []);

   const { step, segment, answers, result, isLoading } = state;

   const renderStep = () => {
      if (step === 0) {
         return <IntroScreen onStart={handleStart} />;
      }
      if (step === 1) {
         return <SegmentStep onSelect={handleSegmentSelect} />;
      }
      if (step >= QUESTION_START && step <= QUESTION_END && segment) {
         const questionIndex = step - QUESTION_START;
         const question = SURVEY_DATA[segment][questionIndex];
         return (
            <QuestionStep
               question={question}
               questionIndex={questionIndex}
               totalQuestions={TOTAL_QUESTIONS}
               currentAnswer={answers[question.id]}
               onAnswer={handleAnswer}
               onBack={handleBack}
            />
         );
      }
      if (step === ANALYSIS_STEP) {
         return <AnalysisLoader onDone={handleAnalysisDone} />;
      }
      if (step === EMAIL_STEP) {
         return <EmailGateStep onSubmit={handleEmailSubmit} isLoading={isLoading} />;
      }
      if (step === RESULT_STEP && result && segment) {
         return (
            <ResultScreen
               stage={result.stage}
               total={result.total}
               levers={result.levers}
               segment={segment}
               onRestart={handleRestart}
            />
         );
      }
      return null;
   };

   return (
      <div
         className="mx-auto w-full max-w-lg px-4 py-12"
         data-testid="survey-container"
      >
         {renderStep()}
      </div>
   );
};
