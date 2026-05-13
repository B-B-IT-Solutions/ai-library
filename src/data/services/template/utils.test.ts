jest.mock("@/lib/template");

import { dtestData } from "@tests";

import { DPromptField } from "@/data/types/domain/prompt";
import { DGlobalPromptField } from "@/data/types/domain/settings";
import { TemplateEngine } from "@/lib/template";

import { resolveAllTemplateFields } from "./utils";

const sExtractVariables = TemplateEngine.extractVariables;

const sExtractVariablesMock = sExtractVariables as jest.MockedFunction<
   typeof sExtractVariables
>;

describe("resolveAllTemplateFields tests", () => {
   const globalFieldToTemplateFieldInternal = (
      gf: DGlobalPromptField
   ): DPromptField => {
      return {
         id: gf.id,
         promptId: "",
         name: gf.name,
         label: gf.label,
         description: gf.description,
         type: gf.type,
         required: gf.required,
         order: gf.order,
         defaultValue: gf.defaultValue,
         options: gf.options,
      };
   };

   const missingVariableToTemplateFieldInternal = (
      name: string,
      index: number
   ): DPromptField => {
      return {
         id: name,
         promptId: "",
         name,
         label: name,
         description: null,
         type: "TEXT" as const,
         required: true,
         order: 100 + index,
         defaultValue: null,
      };
   };

   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("returns only template fields when all variables have matching fields - test", () => {
      const fields = dtestData.dPromptFields(2);
      const field1 = fields[0];
      const field2 = fields[1];

      const template = dtestData.dPromptWithContent();
      template.fields = fields;

      sExtractVariablesMock.mockReturnValue([field1.name, field2.name]);

      const result = resolveAllTemplateFields(template, []);

      expect(result).toEqual(fields);
   });

   it("returns dummy TEXT fields for all variables when no template fields are defined - test", () => {
      const template = dtestData.dPromptWithContent();
      template.fields = [];
      sExtractVariablesMock.mockReturnValue(["var_a", "var_b"]);

      const result = resolveAllTemplateFields(template, []);

      const expectedResult = [
         missingVariableToTemplateFieldInternal("var_a", 0),
         missingVariableToTemplateFieldInternal("var_b", 1),
      ];

      expect(result).toEqual(expectedResult);
   });

   it("adds dummy fields only for variables without a matching template field - test", () => {
      const fields = dtestData.dPromptFields(1);
      const template = dtestData.dPromptWithContent();
      template.fields = fields;

      sExtractVariablesMock.mockReturnValue([fields[0].name, "missing_var"]);

      const result = resolveAllTemplateFields(template, []);

      const expectedResult = [
         ...fields,
         missingVariableToTemplateFieldInternal("missing_var", 0),
      ];

      expect(result).toEqual(expectedResult);
   });

   it("does not add a dummy field for a variable covered by a global field - test", () => {
      const globalField = {
         ...dtestData.dGlobalPromptField(1),
         name: "global_var",
      };
      const template = dtestData.dPromptWithContent();
      template.fields = [];

      sExtractVariablesMock.mockReturnValue(["global_var"]);

      const result = resolveAllTemplateFields(template, [globalField]);

      const expectedResult = [globalFieldToTemplateFieldInternal(globalField)];

      expect(result).toEqual(expectedResult);
   });

   it("returns empty array when content has no variables and no fields exist - test", () => {
      const template = dtestData.dPromptWithContent();
      template.fields = [];

      sExtractVariablesMock.mockReturnValue([]);

      const result = resolveAllTemplateFields(template, []);

      expect(result).toEqual([]);
   });

   it("merges template fields, global fields, and dummy fields in correct order - test", () => {
      const templateField = dtestData.dPromptField(1);
      const globalField = dtestData.dGlobalPromptField(2);
      globalField.name = "global_field";

      const template = dtestData.dPromptWithContent();
      template.fields = [templateField];

      sExtractVariablesMock.mockReturnValue([
         templateField.name,
         "global_field",
         "extra_var",
      ]);

      const result = resolveAllTemplateFields(template, [globalField]);

      const expectedResult = [
         templateField,
         globalFieldToTemplateFieldInternal(globalField),
         missingVariableToTemplateFieldInternal("extra_var", 0),
      ];

      expect(result).toEqual(expectedResult);
   });
});
