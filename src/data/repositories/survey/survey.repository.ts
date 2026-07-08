import type { DbClient } from "@/data/types/db/common";
import type { Segment, SurveyAnswers } from "@/lib/survey-data";

export interface SurveySubmissionCreateData {
   email: string;
   firstName: string | null;
   segment: Segment;
   answers: SurveyAnswers;
   total: number;
   stage: number;
}

export class SurveyRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pCreate(data: SurveySubmissionCreateData) {
      return this.prisma.surveySubmission.create({ data });
   }
}
