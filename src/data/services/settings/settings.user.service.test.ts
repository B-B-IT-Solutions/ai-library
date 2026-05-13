jest.mock("@/data/repositories/settings");

import { dtestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { SettingsRepository } from "@/data/repositories/settings";

import { SettingsService } from "./settings.user.service";

const settingsRepo = new SettingsRepository(prisma);
const settingsRepoMock = settingsRepo as DeepMockProxy<SettingsRepository>;

const settingsService = new SettingsService(settingsRepoMock);

describe("getGlobalFields tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getGlobalPromptFields - fields retrieved - test", async () => {
      const userId = "user-id-1";
      const fields = dtestData.dGlobalPromptFields();
      settingsRepoMock.pGetGlobalPromptFields.mockResolvedValue(fields);

      const result = await settingsService.getGlobalPromptFields(userId);

      expect(result).toEqual(fields);
      expect(settingsRepoMock.pGetGlobalPromptFields).toHaveBeenCalledTimes(
         1
      );
      expect(settingsRepoMock.pGetGlobalPromptFields).toHaveBeenCalledWith(
         userId
      );
   });
});

describe("getGlobalPromptFieldsByIds tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getGlobalPromptFieldsByIds - fields retrieved - test", async () => {
      const userId = "user-id-1";
      const fields = dtestData.dGlobalPromptFields();
      settingsRepoMock.pGetGlobalPromptFieldsByIds.mockResolvedValue(fields);

      const ids = dtestData.dGlobalPromptFieldIds();
      const result = await settingsService.getGlobalPromptFieldsByIds(
         userId,
         ids
      );

      expect(result).toEqual(fields);
      expect(
         settingsRepoMock.pGetGlobalPromptFieldsByIds
      ).toHaveBeenCalledTimes(1);
      expect(
         settingsRepoMock.pGetGlobalPromptFieldsByIds
      ).toHaveBeenCalledWith(userId, ids);
   });
});

describe("createGlobalPromptField tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("createGlobalPromptField - field created - test", async () => {
      const userId = "user-id-1";
      const field = dtestData.dGlobalPromptField();
      settingsRepoMock.pCreateGlobalPromptField.mockResolvedValue(field);

      const data = dtestData.dGlobalPromptFieldUpdate();
      const result = await settingsService.createGlobalPromptField(
         userId,
         data
      );

      expect(result).toEqual(field);
      expect(settingsRepoMock.pCreateGlobalPromptField).toHaveBeenCalledTimes(
         1
      );
      expect(settingsRepoMock.pCreateGlobalPromptField).toHaveBeenCalledWith(
         userId,
         data
      );
   });
});

describe("updateGlobalPromptField tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("updateGlobalPromptField - field updated - test", async () => {
      const field = dtestData.dGlobalPromptField();
      settingsRepoMock.pUpdateGlobalPromptField.mockResolvedValue(field);

      const id = "global-field-id-1";
      const userId = "user-id-1";
      const data = dtestData.dGlobalPromptFieldUpdate();

      const result = await settingsService.updateGlobalPromptField(
         userId,
         id,
         data
      );

      expect(result).toEqual(field);
      expect(settingsRepoMock.pUpdateGlobalPromptField).toHaveBeenCalledTimes(
         1
      );
      expect(settingsRepoMock.pUpdateGlobalPromptField).toHaveBeenCalledWith(
         userId,
         id,
         data
      );
   });
});

describe("deleteGlobalPromptField tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("deleteGlobalPromptField - field deleted - test", async () => {
      const id = "global-field-id-1";
      const userId = "user-id-1";

      await settingsService.deleteGlobalPromptField(userId, id);

      expect(settingsRepoMock.pDeleteGlobalPromptField).toHaveBeenCalledTimes(
         1
      );
      expect(settingsRepoMock.pDeleteGlobalPromptField).toHaveBeenCalledWith(
         userId,
         id
      );
   });
});
