"use server";

import { z } from "zod";

import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import type { Dimension } from "@/lib/survey-data";

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

export interface SurveyResult {
   stage: 1 | 2 | 3 | 4;
   total: number;
   levers: [Dimension, Dimension];
}

export const submitSurvey = async (raw: unknown): Promise<SurveyResult> => {
   try {
      const { email, firstName, segment, answers } =
         SubmitSurveySchema.parse(raw);

      const service = getService();
      return await service.submitSurvey({
         email,
         firstName,
         segment,
         answers,
      });
   } catch (error) {
      console.error(formatError(error));
      throw error;
   }
};

const getService = (dbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getSurveyService();
};
