import { PrismaClient } from "@prisma/client";
import { dtestData, ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { DGlobalFieldUpdate } from "@/data/types/domain/global-field";
import {
   GlobalFieldCreateArgs,
   GlobalFieldCreateInput,
   GlobalFieldDeleteArgs,
   GlobalFieldFindManyArgs,
   GlobalFieldUpdateArgs,
   GlobalFieldUpdateInput,
} from "@/generated/prisma/models";

import { SettingsRepository } from "./settings";
import { toDGlobalField, toDGlobalFields } from "./settings.mapper";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const settingsRepository = new SettingsRepository(prismaMock);

describe("pGetGlobalFields tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetGlobalFields test", async () => {
      const fields = ptestData.pGlobalFields();
      prismaMock.globalField.findMany.mockResolvedValue(fields);

      const userId = "user-id-1";
      const result = await settingsRepository.pGetGlobalFields(userId);

      const expectedResult = toDGlobalFields(fields);

      const expectedArgs: GlobalFieldFindManyArgs = {
         where: { userId },
         orderBy: { order: "asc" },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.globalField.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.globalField.findMany).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

describe("pCreateGlobalField tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pCreateGlobalField - field created - test", async () => {
      const field = ptestData.pGlobalField();
      prismaMock.globalField.create.mockResolvedValue(field);

      const userId = "user-id-1";
      const data = dtestData.dGlobalFieldUpdate();

      const result = await settingsRepository.pCreateGlobalField(userId, data);

      const expectedResult = toDGlobalField(field);

      const expectedInput: GlobalFieldCreateInput = {
         name: data.name,
         label: data.label,
         description: data.description,
         type: data.type,
         required: data.required,
         defaultValue: data.defaultValue,
         options: data.options,
         order: data.order,
         user: {
            connect: {
               id: userId,
            },
         },
      };

      const expectedArgs: GlobalFieldCreateArgs = {
         data: expectedInput,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.globalField.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.globalField.create).toHaveBeenCalledWith(expectedArgs);
   });

   test("pCreateGlobalField - field created  - options empty - test", async () => {
      const field = ptestData.pGlobalField();
      prismaMock.globalField.create.mockResolvedValue(field);

      const userId = "user-id-1";
      const data = dtestData.dGlobalFieldUpdate(11);
      data.options = [];

      const result = await settingsRepository.pCreateGlobalField(userId, data);

      const expectedResult = toDGlobalField(field);

      const expectedInput: GlobalFieldCreateInput = {
         name: data.name,
         label: data.label,
         description: data.description,
         type: data.type,
         required: data.required,
         defaultValue: data.defaultValue,
         options: undefined,
         order: data.order,
         user: {
            connect: {
               id: userId,
            },
         },
      };

      const expectedArgs: GlobalFieldCreateArgs = {
         data: expectedInput,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.globalField.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.globalField.create).toHaveBeenCalledWith(expectedArgs);
   });
});

describe("pUpdateGlobalField tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pUpdateGlobalField - field updated - all fields - test", async () => {
      const field = ptestData.pGlobalField();
      prismaMock.globalField.update.mockResolvedValue(field);

      const userId = "user-id-1";
      const id = "global-field-id-1";
      const data = dtestData.dGlobalFieldUpdate(123);

      const result = await settingsRepository.pUpdateGlobalField(
         userId,
         id,
         data
      );

      const expectedResult = toDGlobalField(field);

      const expectedInput: GlobalFieldUpdateInput = {
         name: data.name,
         label: data.label,
         description: data.description,
         type: data.type,
         required: data.required,
         defaultValue: data.defaultValue,
         options: data.options,
         order: data.order,
      };

      const expectedArgs: GlobalFieldUpdateArgs = {
         where: { id, userId },
         data: expectedInput,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.globalField.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.globalField.update).toHaveBeenCalledWith(expectedArgs);
   });

   test("pUpdateGlobalField - field updated - options empty - test", async () => {
      const field = ptestData.pGlobalField();
      prismaMock.globalField.update.mockResolvedValue(field);

      const userId = "user-id-1";
      const id = "global-field-id-1";
      const data = dtestData.dGlobalFieldUpdate(123);
      data.options = [];

      const result = await settingsRepository.pUpdateGlobalField(
         userId,
         id,
         data
      );

      const expectedResult = toDGlobalField(field);

      const expectedInput: GlobalFieldUpdateInput = {
         name: data.name,
         label: data.label,
         description: data.description,
         type: data.type,
         required: data.required,
         defaultValue: data.defaultValue,
         options: undefined,
         order: data.order,
      };

      const expectedArgs: GlobalFieldUpdateArgs = {
         where: { id, userId },
         data: expectedInput,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.globalField.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.globalField.update).toHaveBeenCalledWith(expectedArgs);
   });
});

describe("pDeleteGlobalField tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pDeleteGlobalField test", async () => {
      const field = ptestData.pGlobalField();
      prismaMock.globalField.delete.mockResolvedValue(field);

      const id = "global-field-id-1";
      const userId = "user-id-1";

      await settingsRepository.pDeleteGlobalField(id, userId);

      const expectedArgs: GlobalFieldDeleteArgs = {
         where: { id, userId },
      };

      expect(prismaMock.globalField.delete).toHaveBeenCalledTimes(1);
      expect(prismaMock.globalField.delete).toHaveBeenCalledWith(expectedArgs);
   });
});
