import { PrismaClient } from "@prisma/client";
import { dtestData, ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import {
   GlobalTemplateFieldCreateArgs,
   GlobalTemplateFieldCreateInput,
   GlobalTemplateFieldDeleteArgs,
   GlobalTemplateFieldFindManyArgs,
   GlobalTemplateFieldUpdateArgs,
   GlobalTemplateFieldUpdateInput,
} from "@/generated/prisma/models";

import {
   toDGlobalTemplateField,
   toDGlobalTemplateFields,
} from "./settings.mapper";
import { SettingsRepository } from "./settings.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const settingsRepository = new SettingsRepository(prismaMock);

describe("pGetGlobalFields tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetGlobalTemplateFields test", async () => {
      const fields = ptestData.pGlobalFields();
      prismaMock.globalTemplateField.findMany.mockResolvedValue(fields);

      const userId = "user-id-1";
      const result = await settingsRepository.pGetGlobalTemplateFields(userId);

      const expectedResult = toDGlobalTemplateFields(fields);

      const expectedArgs: GlobalTemplateFieldFindManyArgs = {
         where: { userId },
         orderBy: { order: "asc" },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.globalTemplateField.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.globalTemplateField.findMany).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

describe("pCreateGlobalTemplateField tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pCreateGlobalTemplateField - field created - test", async () => {
      const field = ptestData.pGlobalField();
      prismaMock.globalTemplateField.create.mockResolvedValue(field);

      const userId = "user-id-1";
      const data = dtestData.dGlobalTemplateFieldUpdate();

      const result = await settingsRepository.pCreateGlobalTemplateField(
         userId,
         data
      );

      const expectedResult = toDGlobalTemplateField(field);

      const expectedInput: GlobalTemplateFieldCreateInput = {
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

      const expectedArgs: GlobalTemplateFieldCreateArgs = {
         data: expectedInput,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.globalTemplateField.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.globalTemplateField.create).toHaveBeenCalledWith(
         expectedArgs
      );
   });

   test("pCreateGlobalTemplateField - field created  - options empty - test", async () => {
      const field = ptestData.pGlobalField();
      prismaMock.globalTemplateField.create.mockResolvedValue(field);

      const userId = "user-id-1";
      const data = dtestData.dGlobalTemplateFieldUpdate(11);
      data.options = [];

      const result = await settingsRepository.pCreateGlobalTemplateField(
         userId,
         data
      );

      const expectedResult = toDGlobalTemplateField(field);

      const expectedInput: GlobalTemplateFieldCreateInput = {
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

      const expectedArgs: GlobalTemplateFieldCreateArgs = {
         data: expectedInput,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.globalTemplateField.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.globalTemplateField.create).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

describe("pUpdateGlobalTemplateField tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pUpdateGlobalTemplateField - field updated - all fields - test", async () => {
      const field = ptestData.pGlobalField();
      prismaMock.globalTemplateField.update.mockResolvedValue(field);

      const userId = "user-id-1";
      const id = "global-field-id-1";
      const data = dtestData.dGlobalTemplateFieldUpdate(123);

      const result = await settingsRepository.pUpdateGlobalTemplateField(
         userId,
         id,
         data
      );

      const expectedResult = toDGlobalTemplateField(field);

      const expectedInput: GlobalTemplateFieldUpdateInput = {
         name: data.name,
         label: data.label,
         description: data.description,
         type: data.type,
         required: data.required,
         defaultValue: data.defaultValue,
         options: data.options,
         order: data.order,
      };

      const expectedArgs: GlobalTemplateFieldUpdateArgs = {
         where: { id, userId },
         data: expectedInput,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.globalTemplateField.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.globalTemplateField.update).toHaveBeenCalledWith(
         expectedArgs
      );
   });

   test("pUpdateGlobalTemplateField - field updated - options empty - test", async () => {
      const field = ptestData.pGlobalField();
      prismaMock.globalTemplateField.update.mockResolvedValue(field);

      const userId = "user-id-1";
      const id = "global-field-id-1";
      const data = dtestData.dGlobalTemplateFieldUpdate(123);
      data.options = [];

      const result = await settingsRepository.pUpdateGlobalTemplateField(
         userId,
         id,
         data
      );

      const expectedResult = toDGlobalTemplateField(field);

      const expectedInput: GlobalTemplateFieldUpdateInput = {
         name: data.name,
         label: data.label,
         description: data.description,
         type: data.type,
         required: data.required,
         defaultValue: data.defaultValue,
         options: undefined,
         order: data.order,
      };

      const expectedArgs: GlobalTemplateFieldUpdateArgs = {
         where: { id, userId },
         data: expectedInput,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.globalTemplateField.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.globalTemplateField.update).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

describe("pDeleteGlobalTemplateField tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pDeleteGlobalTemplateField test", async () => {
      const field = ptestData.pGlobalField();
      prismaMock.globalTemplateField.delete.mockResolvedValue(field);

      const id = "global-field-id-1";
      const userId = "user-id-1";

      await settingsRepository.pDeleteGlobalTemplateField(userId, id);

      const expectedArgs: GlobalTemplateFieldDeleteArgs = {
         where: { id, userId },
      };

      expect(prismaMock.globalTemplateField.delete).toHaveBeenCalledTimes(1);
      expect(prismaMock.globalTemplateField.delete).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});
