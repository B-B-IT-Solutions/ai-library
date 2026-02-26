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
      const fields = dtestData.dGlobalFields();
      settingsRepoMock.pGetGlobalFields.mockResolvedValue(fields);

      const result = await settingsService.getGlobalFields(userId);

      expect(result).toEqual(fields);
      expect(settingsRepoMock.pGetGlobalFields).toHaveBeenCalledTimes(1);
      expect(settingsRepoMock.pGetGlobalFields).toHaveBeenCalledWith(userId);
   });
});

describe("createGlobalField tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("createGlobalField - field created - test", async () => {
      const userId = "user-id-1";
      const field = dtestData.dGlobalField();
      settingsRepoMock.pCreateGlobalField.mockResolvedValue(field);

      const data = dtestData.dGlobalFieldUpdate();
      const result = await settingsService.createGlobalField(userId, data);

      expect(result).toEqual(field);
      expect(settingsRepoMock.pCreateGlobalField).toHaveBeenCalledTimes(1);
      expect(settingsRepoMock.pCreateGlobalField).toHaveBeenCalledWith(
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
      const field = dtestData.dGlobalField();
      settingsRepoMock.pUpdateGlobalField.mockResolvedValue(field);

      const id = "global-field-id-1";
      const userId = "user-id-1";
      const data = dtestData.dGlobalFieldUpdate();

      const result = await settingsService.updateGlobalField(userId, id, data);

      expect(result).toEqual(field);
      expect(settingsRepoMock.pUpdateGlobalField).toHaveBeenCalledTimes(1);
      expect(settingsRepoMock.pUpdateGlobalField).toHaveBeenCalledWith(
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

      expect(settingsRepoMock.pDeleteGlobalField).toHaveBeenCalledTimes(1);
      expect(settingsRepoMock.pDeleteGlobalField).toHaveBeenCalledWith(
         userId,
         id
      );
   });
});
