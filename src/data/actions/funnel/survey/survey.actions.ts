"use server";

import { z } from "zod";

import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import type {
   DSubmitSurveyInput,
   DSurveyResult,
} from "@/data/types/domain/funnel/survey";
import type { ActionResult } from "@/data/types/utils";

const ScoreEnum = z.union([
   z.literal(1),
   z.literal(2),
   z.literal(3),
   z.literal(4),
]);

const SubmitSurveySchema = z.object({
   email: z.string().email("Bitte gib eine gültige E-Mail-Adresse ein."),
   firstName: z.string().optional(),
   segment: z.enum(["solo", "employee", "coach", "default"]),
   answers: z.object({
      freq: ScoreEnum,
      prompting: ScoreEnum,
      tooling: ScoreEnum,
      files: ScoreEnum,
      automation: ScoreEnum,
      integration: ScoreEnum,
      quality: ScoreEnum,
      timesaving: ScoreEnum,
   }),
});

export const submitSurvey = async (
   data: DSubmitSurveyInput
): Promise<ActionResult<DSurveyResult>> => {
   try {
      const validated = SubmitSurveySchema.parse(data);
      const service = getService();
      const result = await service.submitSurvey(validated);
      return {
         success: true,
         message: "Umfrage erfolgreich eingereicht",
         data: result,
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Fehler beim Einreichen der Umfrage",
      };
   }
};

const getService = (dbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getSurveyService();
};
