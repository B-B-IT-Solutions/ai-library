import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";
import prisma from "../prisma";
import { getPromptTemplates } from "./prompt.template";

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe("getPromptTemplates tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("getPromptTemplates - prompts retrieved - test", async () => {
      const prompts = ptestData.pPromptTemplates();
      prismaMock.promptTemplate.findMany.mockResolvedValue(prompts);

      const result = await getPromptTemplates();

      expect(result).toEqual(prompts);
   });
});
