jest.mock("@/data/repositories/settings");

import { dtestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { PublicSettingsRepository } from "@/data/repositories/settings";

import { PublicSettingsService } from "./settings.public.service";

const settingsRepo = new PublicSettingsRepository(prisma);
const settingsRepoMock =
   settingsRepo as DeepMockProxy<PublicSettingsRepository>;

const settingsService = new PublicSettingsService(settingsRepoMock);

describe("getPublicGlobalTemplateFieldsByIds tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("fields retrieved - test", async () => {
      const fields = dtestData.dGlobalTemplateFields();
      settingsRepoMock.pGetPublicGlobalTemplateFieldsByIds.mockResolvedValue(
         fields
      );

      const ids = dtestData.dGlobalTemplateFieldIds();
      const result =
         await settingsService.getPublicGlobalTemplateFieldsByIds(ids);

      expect(result).toEqual(fields);
      expect(
         settingsRepoMock.pGetPublicGlobalTemplateFieldsByIds
      ).toHaveBeenCalledTimes(1);
      expect(
         settingsRepoMock.pGetPublicGlobalTemplateFieldsByIds
      ).toHaveBeenCalledWith(ids);
   });
});
