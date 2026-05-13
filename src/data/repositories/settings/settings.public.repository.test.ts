import { PrismaClient } from "@prisma/client";
import { dtestData, ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { GlobalPromptFieldFindManyArgs } from "@/generated/prisma/models";

import { toDGlobalPromptFields } from "./settings.mapper";
import { PublicSettingsRepository } from "./settings.public.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const settingsRepository = new PublicSettingsRepository(prismaMock);

describe("pGetPublicGlobalPromptFieldsByIds tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("global fields - retrieved - test", async () => {
      const fields = ptestData.pGlobalPromptFields();
      prismaMock.globalPromptField.findMany.mockResolvedValue(fields);

      const ids = dtestData.dGlobalPromptFieldIds();
      const result =
         await settingsRepository.pGetPublicGlobalPromptFieldsByIds(ids);

      const expectedResult = toDGlobalPromptFields(fields);

      const expectedArgs: GlobalPromptFieldFindManyArgs = {
         where: {
            id: {
               in: ids,
            },
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.globalPromptField.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.globalPromptField.findMany).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});
