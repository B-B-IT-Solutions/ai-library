import { PrismaClient } from "@prisma/client";
import { dtestData, ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import {
   GlobalPromptFieldCreateArgs,
   GlobalPromptFieldCreateInput,
   GlobalPromptFieldDeleteArgs,
   GlobalPromptFieldFindManyArgs,
   GlobalPromptFieldUpdateArgs,
   GlobalPromptFieldUpdateInput,
} from "@/generated/prisma/models";

import {
   toDGlobalPromptField,
   toDGlobalPromptFields,
} from "./settings.mapper";
import { SettingsRepository } from "./settings.user.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const settingsRepository = new SettingsRepository(prismaMock);

describe("pGetGlobalFields tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetGlobalPromptFields test", async () => {
      const fields = ptestData.pGlobalPromptFields();
      prismaMock.globalPromptField.findMany.mockResolvedValue(fields);

      const userId = "user-id-1";
      const result = await settingsRepository.pGetGlobalPromptFields(userId);

      const expectedResult = toDGlobalPromptFields(fields);

      const expectedArgs: GlobalPromptFieldFindManyArgs = {
         where: { userId },
         orderBy: { order: "asc" },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.globalPromptField.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.globalPromptField.findMany).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

describe("pGetGlobalPromptFieldsByIds tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("global fields - retrieved - test", async () => {
      const fields = ptestData.pGlobalPromptFields();
      prismaMock.globalPromptField.findMany.mockResolvedValue(fields);

      const userId = "user-id-1";
      const ids = dtestData.dGlobalPromptFieldIds();
      const result = await settingsRepository.pGetGlobalPromptFieldsByIds(
         userId,
         ids
      );

      const expectedResult = toDGlobalPromptFields(fields);

      const expectedArgs: GlobalPromptFieldFindManyArgs = {
         where: {
            userId,
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

describe("pCreateGlobalPromptField tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pCreateGlobalPromptField - field created - test", async () => {
      const field = ptestData.pGlobalPromptField();
      prismaMock.globalPromptField.create.mockResolvedValue(field);

      const userId = "user-id-1";
      const data = dtestData.dGlobalPromptFieldUpdate();

      const result = await settingsRepository.pCreateGlobalPromptField(
         userId,
         data
      );

      const expectedResult = toDGlobalPromptField(field);

      const expectedInput: GlobalPromptFieldCreateInput = {
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

      const expectedArgs: GlobalPromptFieldCreateArgs = {
         data: expectedInput,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.globalPromptField.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.globalPromptField.create).toHaveBeenCalledWith(
         expectedArgs
      );
   });

   test("pCreateGlobalPromptField - field created  - options empty - test", async () => {
      const field = ptestData.pGlobalPromptField();
      prismaMock.globalPromptField.create.mockResolvedValue(field);

      const userId = "user-id-1";
      const data = dtestData.dGlobalPromptFieldUpdate(11);
      data.options = [];

      const result = await settingsRepository.pCreateGlobalPromptField(
         userId,
         data
      );

      const expectedResult = toDGlobalPromptField(field);

      const expectedInput: GlobalPromptFieldCreateInput = {
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

      const expectedArgs: GlobalPromptFieldCreateArgs = {
         data: expectedInput,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.globalPromptField.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.globalPromptField.create).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

describe("pUpdateGlobalPromptField tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pUpdateGlobalPromptField - field updated - all fields - test", async () => {
      const field = ptestData.pGlobalPromptField();
      prismaMock.globalPromptField.update.mockResolvedValue(field);

      const userId = "user-id-1";
      const id = "global-field-id-1";
      const data = dtestData.dGlobalPromptFieldUpdate(123);

      const result = await settingsRepository.pUpdateGlobalPromptField(
         userId,
         id,
         data
      );

      const expectedResult = toDGlobalPromptField(field);

      const expectedInput: GlobalPromptFieldUpdateInput = {
         name: data.name,
         label: data.label,
         description: data.description,
         type: data.type,
         required: data.required,
         defaultValue: data.defaultValue,
         options: data.options,
         order: data.order,
      };

      const expectedArgs: GlobalPromptFieldUpdateArgs = {
         where: { id, userId },
         data: expectedInput,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.globalPromptField.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.globalPromptField.update).toHaveBeenCalledWith(
         expectedArgs
      );
   });

   test("pUpdateGlobalPromptField - field updated - options empty - test", async () => {
      const field = ptestData.pGlobalPromptField();
      prismaMock.globalPromptField.update.mockResolvedValue(field);

      const userId = "user-id-1";
      const id = "global-field-id-1";
      const data = dtestData.dGlobalPromptFieldUpdate(123);
      data.options = [];

      const result = await settingsRepository.pUpdateGlobalPromptField(
         userId,
         id,
         data
      );

      const expectedResult = toDGlobalPromptField(field);

      const expectedInput: GlobalPromptFieldUpdateInput = {
         name: data.name,
         label: data.label,
         description: data.description,
         type: data.type,
         required: data.required,
         defaultValue: data.defaultValue,
         options: undefined,
         order: data.order,
      };

      const expectedArgs: GlobalPromptFieldUpdateArgs = {
         where: { id, userId },
         data: expectedInput,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.globalPromptField.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.globalPromptField.update).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

describe("pDeleteGlobalPromptField tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pDeleteGlobalPromptField test", async () => {
      const field = ptestData.pGlobalPromptField();
      prismaMock.globalPromptField.delete.mockResolvedValue(field);

      const id = "global-field-id-1";
      const userId = "user-id-1";

      await settingsRepository.pDeleteGlobalPromptField(userId, id);

      const expectedArgs: GlobalPromptFieldDeleteArgs = {
         where: { id, userId },
      };

      expect(prismaMock.globalPromptField.delete).toHaveBeenCalledTimes(1);
      expect(prismaMock.globalPromptField.delete).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});
