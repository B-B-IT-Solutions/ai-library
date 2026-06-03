import { dtestData } from "@tests";

import { DPromptVariable } from "@/data/types/domain/prompt";

import { requiredVariables, requiredVariablesWithValue } from "./utils";

const createVariable = (
   overrides: Partial<DPromptVariable> = {}
): DPromptVariable => {
   return {
      ...dtestData.dPromptVariable(),
      ...overrides,
   };
};

describe("requiredVariables", () => {
   it("returns empty array when no variables given", () => {
      expect(requiredVariables([])).toEqual([]);
   });

   it("returns all variables when all are required", () => {
      const vars = [
         createVariable({ required: true }),
         createVariable({ required: true }),
      ];

      expect(requiredVariables(vars)).toEqual(vars);
      expect(requiredVariables(vars)).toHaveLength(2);
   });

   it("returns empty array when no variables are required", () => {
      const vars = [
         createVariable({ required: false }),
         createVariable({ required: false }),
      ];
      expect(requiredVariables(vars)).toEqual([]);
   });

   it("returns only required variables from a mixed list", () => {
      const required = createVariable({ name: "a", required: true });
      const optional = createVariable({ name: "b", required: false });
      const result = requiredVariables([required, optional]);

      expect(result).toEqual([required]);
      expect(result).toHaveLength(1);
   });
});

describe("requiredVariablesWithValue", () => {
   it("returns empty array when no variables given", () => {
      expect(requiredVariablesWithValue([], {})).toEqual([]);
   });

   it("counts a TEXT field with a non-empty string value", () => {
      const required = createVariable({ name: "name", type: "TEXT" });
      const vars = [required];
      const result = requiredVariablesWithValue(vars, { name: "John" });

      expect(result).toEqual([required]);
   });

   it("does not count a TEXT field with an empty string", () => {
      const required = createVariable({ name: "name", type: "TEXT" });
      const vars = [required];
      const result = requiredVariablesWithValue(vars, { name: "" });

      expect(result).toEqual([]);
   });

   it("does not count a TEXT field with undefined value", () => {
      const required = createVariable({ name: "name", type: "TEXT" });
      const vars = [required];
      const result = requiredVariablesWithValue(vars, {});

      expect(result).toEqual([]);
   });

   it("does not count a TEXT field with null value", () => {
      const required = createVariable({ name: "name", type: "TEXT" });
      const vars = [required];
      const result = requiredVariablesWithValue(vars, { name: null });

      expect(result).toEqual([]);
   });

   it("counts a CHECKBOX field only when value is true", () => {
      const required = createVariable({ name: "checked", type: "CHECKBOX" });
      const vars = [required];

      const result1 = requiredVariablesWithValue(vars, { checked: true });
      expect(result1).toEqual([required]);

      const result2 = requiredVariablesWithValue(vars, { checked: false });
      expect(result2).toEqual([]);
   });

   it("counts mixed fields that all have values", () => {
      const required1 = createVariable({ name: "name", type: "TEXT" });
      const required2 = createVariable({ name: "checked", type: "CHECKBOX" });
      const required3 = createVariable({ name: "bio", type: "TEXTAREA" });

      const vars = [required1, required2, required3];
      const values = { name: "John", checked: true, bio: "Some text" };
      const result = requiredVariablesWithValue(vars, values);

      expect(result).toEqual([required1, required2, required3]);
   });

   it("counts only the fields that have values in a mixed list", () => {
      const required1 = createVariable({ name: "name", type: "TEXT" });
      const required2 = createVariable({ name: "checked", type: "CHECKBOX" });
      const required3 = createVariable({ name: "bio", type: "TEXTAREA" });

      const vars = [required1, required2, required3];
      const values = { name: "John", checked: false, bio: "" };
      const result = requiredVariablesWithValue(vars, values);

      expect(result).toEqual([required1]);
   });
});
