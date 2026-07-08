import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import type { SurveyAnswers } from "@/lib/survey-data";

import { SurveyRepository } from "./survey.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const surveyRepository = new SurveyRepository(prismaMock);

const makeAnswers = (): SurveyAnswers => ({
   freq: 3,
   prompting: 2,
   tooling: 4,
   files: 1,
   automation: 2,
   integration: 3,
   quality: 4,
   timesaving: 2,
});

describe("SurveyRepository.pCreate", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("calls prisma.surveySubmission.create with the provided data", async () => {
      const data = {
         email: "test@example.com",
         firstName: "Max",
         segment: "solo" as const,
         answers: makeAnswers(),
         total: 21,
         stage: 3,
      };
      const created = { id: "uuid-1", createdAt: new Date(), ...data };
      prismaMock.surveySubmission.create.mockResolvedValue(created as never);

      const result = await surveyRepository.pCreate(data);

      expect(prismaMock.surveySubmission.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.surveySubmission.create).toHaveBeenCalledWith({
         data,
      });
      expect(result).toEqual(created);
   });

   it("propagates errors from prisma", async () => {
      prismaMock.surveySubmission.create.mockRejectedValue(
         new Error("DB error")
      );

      await expect(
         surveyRepository.pCreate({
            email: "test@example.com",
            firstName: null,
            segment: "default" as const,
            answers: makeAnswers(),
            total: 16,
            stage: 2,
         })
      ).rejects.toThrow("DB error");
   });
});
