import { ptestData } from "@tests";
import { isArray, map } from "es-toolkit/compat";

import { DGlobalField } from "@/data/types/domain/global-field";
import { GlobalField } from "@/generated/prisma/client";

import { toDGlobalField, toDGlobalFields } from "./settings.mapper";

const toDGlobalFieldsInternal = (fields: GlobalField[]): DGlobalField[] => {
   return map(fields, (f) => toDGlobalFieldInternal(f));
};

const toDGlobalFieldInternal = (field: GlobalField): DGlobalField => {
   return {
      id: field.id,
      userId: field.userId,
      name: field.name,
      label: field.label,
      description: field.description,
      type: field.type,
      required: field.required,
      defaultValue: field.defaultValue,
      options: isArray(field.options) ? (field.options as string[]) : null,
      order: field.order,
      createdAt: field.createdAt.toISOString(),
      updatedAt: field.updatedAt.toISOString(),
   };
};

describe("toDGlobalFields tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("toDGlobalFields test", async () => {
      const fields = ptestData.pGlobalFields();
      const result = toDGlobalFields(fields);
      const expectedResult = toDGlobalFieldsInternal(fields);
      expect(result).toEqual(expectedResult);
   });

   it("toDGlobalField test", async () => {
      const field = ptestData.pGlobalField();
      const result = toDGlobalField(field);
      const expectedResult = toDGlobalFieldInternal(field);
      expect(result).toEqual(expectedResult);
   });

   it("toDGlobalField - options is null - test", async () => {
      const field = ptestData.pGlobalField();
      field.options = null;
      const result = toDGlobalField(field);
      const expectedResult = toDGlobalFieldInternal(field);
      expect(result).toEqual(expectedResult);
   });

   it("toDGlobalField - options is non-array value - test", async () => {
      const field = ptestData.pGlobalField();
      field.options = "some-string";
      const result = toDGlobalField(field);
      const expectedResult = toDGlobalFieldInternal(field);
      expect(result).toEqual(expectedResult);
   });
});
