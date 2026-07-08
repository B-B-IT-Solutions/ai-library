import type { SurveyRepository } from "@/data/repositories/survey";

import { SEGMENT_LABELS, SURVEY_DATA } from "./survey-data";
import type { Dimension, Question, Segment, SurveyAnswers } from "./survey-data";
import { LEVER_TEXTS, STAGE_RESULTS } from "./survey-results";
import { calculateLevers, calculateStage } from "./survey-scoring";

export interface SubmitSurveyInput {
   email: string;
   firstName?: string;
   segment: Segment;
   answers: SurveyAnswers;
}

export interface SurveyResult {
   stage: 1 | 2 | 3 | 4;
   total: number;
   levers: [Dimension, Dimension];
   stageLabel: string;
   stageEmoji: string;
   stageText: string;
   ctaText: string;
   ctaHref: string;
   leverTexts: [string, string];
}

export class SurveyService {
   private surveyRepository: SurveyRepository;

   constructor(surveyRepository: SurveyRepository) {
      this.surveyRepository = surveyRepository;
   }

   getSegmentLabels(): Record<Segment, string> {
      return SEGMENT_LABELS;
   }

   getQuestionsForSegment(segment: Segment): Question[] {
      return [...SURVEY_DATA[segment]];
   }

   async submitSurvey(input: SubmitSurveyInput): Promise<SurveyResult> {
      const { email, firstName, segment, answers } = input;
      const total = Object.values(answers).reduce((sum, s) => sum + s, 0);
      const stage = calculateStage(total);
      const levers = calculateLevers(answers);
      const stageResult = STAGE_RESULTS[stage];

      await this.surveyRepository.pCreate({
         email,
         firstName: firstName ?? null,
         segment,
         answers,
         total,
         stage,
      });

      return {
         stage,
         total,
         levers,
         stageLabel: stageResult.label,
         stageEmoji: stageResult.emoji,
         stageText: stageResult.text,
         ctaText: stageResult.ctaText,
         ctaHref: stageResult.ctaHref,
         leverTexts: [
            LEVER_TEXTS[levers[0]][segment],
            LEVER_TEXTS[levers[1]][segment],
         ],
      };
   }
}
