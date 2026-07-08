"use client";

import { useCallback, useState } from "react";

import { getSurveyQuestions, submitSurvey } from "@/data/actions/funnel/survey";
import {
   DSubmitSurveyInput,
   DSurveyAnswers,
   DSurveyQuestion,
   DSurveyResult,
   DSurveyScore,
   DSurveySegment,
   DSurveySegments,
} from "@/data/types/domain/funnel/survey";

import { AnalysisLoader } from "./AnalysisLoader";
import { EmailGateStep } from "./EmailGateStep";
import { IntroScreen } from "./intro-screen";
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

type Props = {
   segments: DSurveySegments;
};

export const SurveyContainer = ({ segments }: Props) => {
   const [step, setStep] = useState(0);
   const [segment, setSegment] = useState<DSurveySegment | null>(null);
   const [answers, setAnswers] = useState<Partial<DSurveyAnswers>>({});
   const [questions, setQuestions] = useState<DSurveyQuestion[] | null>(null);

   const [result, setResult] = useState<DSurveyResult | null>(null);

   const handleStart = useCallback(() => setStep(1), []);

   const handleSegmentSelect = useCallback(async (selected: DSurveySegment) => {
      const qs = await getSurveyQuestions(selected);
      setSegment(selected);
      setQuestions(qs);
      setStep(QUESTION_START);
   }, []);

   const handleAnswer = useCallback(
      (score: DSurveyScore) => {
         const questionIndex = step - QUESTION_START;
         const dimension = questions![questionIndex].id;
         setAnswers((prev) => ({ ...prev, [dimension]: score }));
         setStep((prev) => (prev < QUESTION_END ? prev + 1 : ANALYSIS_STEP));
      },
      [step, questions]
   );

   const handleBack = useCallback(
      () => setStep((prev) => Math.max(QUESTION_START, prev - 1)),
      []
   );

   const handleAnalysisDone = useCallback(() => setStep(EMAIL_STEP), []);

   const handleEmailSubmit = useCallback(
      async (email: string, firstName: string) => {
         const payload: DSubmitSurveyInput = {
            email,
            firstName: firstName || undefined,
            segment: segment!,
            answers: answers as DSurveyAnswers,
         };
         const actionResult = await submitSurvey(payload);
         if (actionResult.success && actionResult.data) {
            setResult(actionResult.data);
            setStep(RESULT_STEP);
         }
      },
      [segment, answers]
   );

   const handleRestart = useCallback(() => {
      setStep(0);
      setSegment(null);
      setAnswers({});
      setQuestions(null);
      setResult(null);
   }, []);

   const questionIndex = step - QUESTION_START;
   const currentQuestion =
      step >= QUESTION_START && step <= QUESTION_END && questions
         ? questions[questionIndex]
         : null;

   return (
      <div
         className="mx-auto w-full max-w-lg px-4 py-12"
         data-testid="survey-container"
      >
         {step === 0 && <IntroScreen onStart={handleStart} />}
         {step === 1 && (
            <SegmentStep
               segmentLabels={segments}
               onSelect={handleSegmentSelect}
            />
         )}
         {currentQuestion && (
            <QuestionStep
               question={currentQuestion}
               questionIndex={questionIndex}
               totalQuestions={TOTAL_QUESTIONS}
               currentAnswer={answers[currentQuestion.id]}
               onAnswer={handleAnswer}
               onBack={handleBack}
            />
         )}
         {step === ANALYSIS_STEP && (
            <AnalysisLoader onDone={handleAnalysisDone} />
         )}
         {step === EMAIL_STEP && <EmailGateStep onSubmit={handleEmailSubmit} />}
         {step === RESULT_STEP && result && (
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
