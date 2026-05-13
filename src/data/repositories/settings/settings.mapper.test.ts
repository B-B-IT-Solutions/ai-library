import { ptestData } from "@tests";
import { isArray, map } from "es-toolkit/compat";

import { DGlobalPromptField } from "@/data/types/domain/settings";
import { GlobalPromptField } from "@/generated/prisma/client";

import {
   toDGlobalPromptField,
   toDGlobalPromptFields,
} from "./settings.mapper";

const toDGlobalPromptFieldsInternal = (
   fields: GlobalPromptField[]
): DGlobalPromptField[] => {
   return map(fields, (f) => toDGlobalPromptFieldInternal(f));
};

const toDGlobalPromptFieldInternal = (
   field: GlobalPromptField
): DGlobalPromptField => {
   return {
      id: field.id,
      userId: field.userId,
      name: field.name,
      label: field.label,
      description: field.description,
      type: field.type,
      required: field.required,
      defaultValue: field.defaultValue,
      options: field.options as string[] | undefined,
      order: field.order,
      createdAt: field.createdAt.toISOString(),
      updatedAt: field.updatedAt.toISOString(),
   };
};

describe("toDGlobalPromptFields tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("toDGlobalPromptFields test", async () => {
      const fields = ptestData.pGlobalPromptFields();
      const result = toDGlobalPromptFields(fields);
      const expectedResult = toDGlobalPromptFieldsInternal(fields);
      expect(result).toEqual(expectedResult);
   });

   it("toDGlobalPromptField test", async () => {
      const field = ptestData.pGlobalPromptField();
      const result = toDGlobalPromptField(field);
      const expectedResult = toDGlobalPromptFieldInternal(field);
      expect(result).toEqual(expectedResult);
   });

   it("toDGlobalPromptField - options is null - test", async () => {
      const field = ptestData.pGlobalPromptField();
      field.options = null;
      const result = toDGlobalPromptField(field);
      const expectedResult = toDGlobalPromptFieldInternal(field);
      expect(result).toEqual(expectedResult);
   });

   it("toDGlobalPromptField - options is non-array value - test", async () => {
      const field = ptestData.pGlobalPromptField();
      field.options = "some-string";
      const result = toDGlobalPromptField(field);
      const expectedResult = toDGlobalPromptFieldInternal(field);
      expect(result).toEqual(expectedResult);
   });
});
