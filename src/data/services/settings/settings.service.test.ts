jest.mock("@/data/repositories/settings");

import { dtestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { SettingsRepository } from "@/data/repositories/settings";

import { SettingsService } from "./settings.service";

const settingsRepo = new SettingsRepository(prisma);
const settingsRepoMock = settingsRepo as DeepMockProxy<SettingsRepository>;

const settingsService = new SettingsService(settingsRepoMock);

describe("getGlobalFields tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getGlobalFields - fields retrieved - test", async () => {
      const userId = "user-id-1";
      const fields = dtestData.dGlobalTemplateFields();
      settingsRepoMock.pGetGlobalTemplateFields.mockResolvedValue(fields);

      const result = await settingsService.getGlobalFields(userId);

      expect(result).toEqual(fields);
      expect(settingsRepoMock.pGetGlobalTemplateFields).toHaveBeenCalledTimes(
         1
      );
      expect(settingsRepoMock.pGetGlobalTemplateFields).toHaveBeenCalledWith(
         userId
      );
   });
});

describe("createGlobalField tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("createGlobalField - field created - test", async () => {
      const userId = "user-id-1";
      const field = dtestData.dGlobalTemplateField();
      settingsRepoMock.pCreateGlobalTemplateField.mockResolvedValue(field);

      const data = dtestData.dGlobalTemplateFieldUpdate();
      const result = await settingsService.createGlobalField(userId, data);

      expect(result).toEqual(field);
      expect(settingsRepoMock.pCreateGlobalTemplateField).toHaveBeenCalledTimes(
         1
      );
      expect(settingsRepoMock.pCreateGlobalTemplateField).toHaveBeenCalledWith(
         userId,
         data
      );
   });
});

describe("updateGlobalField tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("updateGlobalField - field updated - test", async () => {
      const field = dtestData.dGlobalTemplateField();
      settingsRepoMock.pUpdateGlobalTemplateField.mockResolvedValue(field);

      const id = "global-field-id-1";
      const userId = "user-id-1";
      const data = dtestData.dGlobalTemplateFieldUpdate();

      const result = await settingsService.updateGlobalField(userId, id, data);

      expect(result).toEqual(field);
      expect(settingsRepoMock.pUpdateGlobalTemplateField).toHaveBeenCalledTimes(
         1
      );
      expect(settingsRepoMock.pUpdateGlobalTemplateField).toHaveBeenCalledWith(
         userId,
         id,
         data
      );
   });
});

describe("deleteGlobalField tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("deleteGlobalField - field deleted - test", async () => {
      const id = "global-field-id-1";
      const userId = "user-id-1";

      await settingsService.deleteGlobalField(userId, id);

      expect(settingsRepoMock.pDeleteGlobalTemplateField).toHaveBeenCalledTimes(
         1
      );
      expect(settingsRepoMock.pDeleteGlobalTemplateField).toHaveBeenCalledWith(
         userId,
         id
      );
   });
});
