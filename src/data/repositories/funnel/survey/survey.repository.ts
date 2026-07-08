import type { DbClient } from "@/data/types/db/common";
import type { DSurveyAnswers, DSurveySegment } from "@/data/types/domain/funnel/survey";

export interface FunnelSurveyCreateData {
   email: string;
   firstName: string | null;
   segment: DSurveySegment;
   answers: DSurveyAnswers;
   total: number;
   stage: number;
}

export class SurveyRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pCreate(data: FunnelSurveyCreateData) {
      return this.prisma.funnelSurvey.create({ data });
   }
}
