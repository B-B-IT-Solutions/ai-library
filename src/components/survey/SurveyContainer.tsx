"use client";

import { useCallback, useEffect, useState } from "react";

import {
   getSurveyQuestions,
   getSurveySegmentLabels,
   submitSurvey,
} from "@/data/actions/survey";
import {
   DSurveyAnswers,
   DSurveyQuestion,
   DSurveyResult,
   DSurveyScore,
   DSurveySegment,
} from "@/data/types/domain/survey";

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
   segment: DSurveySegment | null;
   answers: Partial<DSurveyAnswers>;
   questions: DSurveyQuestion[] | null;
   segmentLabels: Record<DSurveySegment, string> | null;
   result: DSurveyResult | null;
   isLoading: boolean;
}

const INITIAL_STATE: SurveyState = {
   step: 0,
   segment: null,
   answers: {},
   questions: null,
   segmentLabels: null,
   result: null,
   isLoading: false,
};

export const SurveyContainer = () => {
   const [state, setState] = useState<SurveyState>(INITIAL_STATE);

   useEffect(() => {
      getSurveySegmentLabels().then((labels) => {
         setState((s) => ({ ...s, segmentLabels: labels }));
      });
   }, []);

   const handleStart = useCallback(() => {
      setState((s) => ({ ...s, step: 1 }));
   }, []);

   const handleSegmentSelect = useCallback(async (segment: DSurveySegment) => {
      const questions = await getSurveyQuestions(segment);
      setState((s) => ({ ...s, segment, questions, step: QUESTION_START }));
   }, []);

   const handleAnswer = useCallback((score: DSurveyScore) => {
      setState((s) => {
         const questionIndex = s.step - QUESTION_START;
         const dimension = s.questions![questionIndex].id;
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
         const payload: DSubmitSurveyInput = {
            email,
            firstName: firstName || undefined,
            segment: state.segment!,
            answers: state.answers as DSurveyAnswers,
         };
         const actionResult = await submitSurvey(payload);
         if (actionResult.success && actionResult.data) {
            setState((s) => ({
               ...s,
               result: actionResult.data!,
               step: RESULT_STEP,
               isLoading: false,
            }));
         } else {
            setState((s) => ({ ...s, isLoading: false }));
         }
      },
      [state.segment, state.answers]
   );

   const handleRestart = useCallback(() => {
      setState(INITIAL_STATE);
   }, []);

   const {
      step,
      segment,
      answers,
      questions,
      segmentLabels,
      result,
      isLoading,
   } = state;

   const renderStep = () => {
      if (step === 0) {
         return <IntroScreen onStart={handleStart} />;
      }
      if (step === 1) {
         return (
            <SegmentStep
               segmentLabels={segmentLabels ?? {}}
               onSelect={handleSegmentSelect}
            />
         );
      }
      if (
         step >= QUESTION_START &&
         step <= QUESTION_END &&
         segment &&
         questions
      ) {
         const questionIndex = step - QUESTION_START;
         const question = questions[questionIndex];
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
         return (
            <EmailGateStep onSubmit={handleEmailSubmit} isLoading={isLoading} />
         );
      }
      if (step === RESULT_STEP && result) {
         return (
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
