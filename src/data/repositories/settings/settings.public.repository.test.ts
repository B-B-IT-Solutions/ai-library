import { PrismaClient } from "@prisma/client";
import { dtestData, ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { GlobalTemplateFieldFindManyArgs } from "@/generated/prisma/models";

import { toDGlobalTemplateFields } from "./settings.mapper";
import { PublicSettingsRepository } from "./settings.public.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const settingsRepository = new PublicSettingsRepository(prismaMock);

describe("pGetPublicGlobalTemplateFieldsByIds tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("global fields - retrieved - test", async () => {
      const fields = ptestData.pGlobalTemplateFields();
      prismaMock.globalTemplateField.findMany.mockResolvedValue(fields);

      const ids = dtestData.dGlobalTemplateFieldIds();
      const result =
         await settingsRepository.pGetPublicGlobalTemplateFieldsByIds(ids);

      const expectedResult = toDGlobalTemplateFields(fields);

      const expectedArgs: GlobalTemplateFieldFindManyArgs = {
         where: {
            id: {
               in: ids,
            },
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.globalTemplateField.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.globalTemplateField.findMany).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});
