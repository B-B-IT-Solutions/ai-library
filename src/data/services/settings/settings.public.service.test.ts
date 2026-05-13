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

describe("getPublicGlobalPromptFieldsByIds tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("fields retrieved - test", async () => {
      const fields = dtestData.dGlobalPromptFields();
      settingsRepoMock.pGetPublicGlobalPromptFieldsByIds.mockResolvedValue(
         fields
      );

      const ids = dtestData.dGlobalPromptFieldIds();
      const result =
         await settingsService.getPublicGlobalPromptFieldsByIds(ids);

      expect(result).toEqual(fields);
      expect(
         settingsRepoMock.pGetPublicGlobalPromptFieldsByIds
      ).toHaveBeenCalledTimes(1);
      expect(
         settingsRepoMock.pGetPublicGlobalPromptFieldsByIds
      ).toHaveBeenCalledWith(ids);
   });
});
