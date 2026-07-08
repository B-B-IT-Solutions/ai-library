import type { SurveyRepository } from "@/data/repositories/survey";
import type { Dimension, Segment, SurveyAnswers } from "@/lib/survey-data";
import { calculateLevers, calculateStage } from "@/lib/survey-scoring";

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
}

export class SurveyService {
   private surveyRepository: SurveyRepository;

   constructor(surveyRepository: SurveyRepository) {
      this.surveyRepository = surveyRepository;
   }

   async submitSurvey(input: SubmitSurveyInput): Promise<SurveyResult> {
      const { email, firstName, segment, answers } = input;
      const total = Object.values(answers).reduce((sum, s) => sum + s, 0);
      const stage = calculateStage(total);
      const levers = calculateLevers(answers);

      await this.surveyRepository.pCreate({
         email,
         firstName: firstName ?? null,
         segment,
         answers,
         total,
         stage,
      });

      return { stage, total, levers };
   }
}
