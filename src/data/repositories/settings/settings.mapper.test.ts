import { ptestData } from "@tests";
import { isArray, map } from "es-toolkit/compat";

import { DGlobalTemplateField } from "@/data/types/domain/settings";
import { GlobalTemplateField } from "@/generated/prisma/client";

import {
   toDGlobalTemplateField,
   toDGlobalTemplateFields,
} from "./settings.mapper";

const toDGlobalTemplateFieldsInternal = (
   fields: GlobalTemplateField[]
): DGlobalTemplateField[] => {
   return map(fields, (f) => toDGlobalTemplateFieldInternal(f));
};

const toDGlobalTemplateFieldInternal = (
   field: GlobalTemplateField
): DGlobalTemplateField => {
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

describe("toDGlobalTemplateFields tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("toDGlobalTemplateFields test", async () => {
      const fields = ptestData.pGlobalFields();
      const result = toDGlobalTemplateFields(fields);
      const expectedResult = toDGlobalTemplateFieldsInternal(fields);
      expect(result).toEqual(expectedResult);
   });

   it("toDGlobalTemplateField test", async () => {
      const field = ptestData.pGlobalField();
      const result = toDGlobalTemplateField(field);
      const expectedResult = toDGlobalTemplateFieldInternal(field);
      expect(result).toEqual(expectedResult);
   });

   it("toDGlobalTemplateField - options is null - test", async () => {
      const field = ptestData.pGlobalField();
      field.options = null;
      const result = toDGlobalTemplateField(field);
      const expectedResult = toDGlobalTemplateFieldInternal(field);
      expect(result).toEqual(expectedResult);
   });

   it("toDGlobalTemplateField - options is non-array value - test", async () => {
      const field = ptestData.pGlobalField();
      field.options = "some-string";
      const result = toDGlobalTemplateField(field);
      const expectedResult = toDGlobalTemplateFieldInternal(field);
      expect(result).toEqual(expectedResult);
   });
});
