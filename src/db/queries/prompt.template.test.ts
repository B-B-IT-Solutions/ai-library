import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import { Prisma } from "@/generated/prisma/client";
import prisma from "../prisma";

import {
   getPromptTemplateCategories,
   getPromptTemplates,
} from "./prompt.template";

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe("db queries tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("getPromptTemplates - prompts retrieved - test", async () => {
      const prompts = ptestData.pPromptTemplates();
      prismaMock.promptTemplate.findMany.mockResolvedValue(prompts);

      const result = await getPromptTemplates();

      expect(result).toEqual(prompts);
   });

   test("getPromptTemplateCategories - categories retrieved - test", async () => {
      const categories = ptestData.pPromptTemplateCategories();
      prismaMock.promptTemplateCategory.findMany.mockResolvedValue(categories);

      const result = await getPromptTemplateCategories();

      const expectedFindMayArgs: Prisma.PromptTemplateCategoryFindManyArgs = {
         select: {
            name: true,
         },
      };

      expect(result).toEqual(categories);
      expect(prismaMock.promptTemplateCategory.findMany).toHaveBeenCalledTimes(
         1
      );
      expect(prismaMock.promptTemplateCategory.findMany).toHaveBeenCalledWith(
         expectedFindMayArgs
      );
   });
});
