import type { SurveyRepository } from "@/data/repositories/funnel/survey";
import {
   DSubmitSurveyInput,
   DSurveyQuestion,
   DSurveyResult,
   DSurveySegment,
} from "@/data/types/domain/funnel/survey";

import { SEGMENT_LABELS, SURVEY_DATA } from "./survey-data";
import { LEVER_TEXTS, STAGE_RESULTS } from "./survey-results";
import { calculateLevers, calculateStage } from "./survey-scoring";

export class SurveyService {
   private surveyRepository: SurveyRepository;

   constructor(surveyRepository: SurveyRepository) {
      this.surveyRepository = surveyRepository;
   }

   getSegmentLabels(): Record<DSurveySegment, string> {
      return SEGMENT_LABELS;
   }

   getQuestionsForSegment(segment: DSurveySegment): DSurveyQuestion[] {
      return [...SURVEY_DATA[segment]];
   }

   async submitSurvey(input: DSubmitSurveyInput): Promise<DSurveyResult> {
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
