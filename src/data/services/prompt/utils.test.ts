jest.mock("@/lib/template");

import { dtestData } from "@tests";

import { DPromptVariable } from "@/data/types/domain/prompt";
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
   ): DPromptVariable => {
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
   ): DPromptVariable => {
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
      const variables = dtestData.dPromptVariables(2);
      const variable1 = variables[0];
      const variable2 = variables[1];

      const prompt = dtestData.dPromptWithContent();
      prompt.fields = variables;

      sExtractVariablesMock.mockReturnValue([variable1.name, variable2.name]);

      const result = resolveAllTemplateFields(prompt, []);

      expect(result).toEqual(variables);
   });

   it("returns dummy TEXT fields for all variables when no template fields are defined - test", () => {
      const promt = dtestData.dPromptWithContent();
      promt.fields = [];
      sExtractVariablesMock.mockReturnValue(["var_a", "var_b"]);

      const result = resolveAllTemplateFields(promt, []);

      const expectedResult = [
         missingVariableToTemplateFieldInternal("var_a", 0),
         missingVariableToTemplateFieldInternal("var_b", 1),
      ];

      expect(result).toEqual(expectedResult);
   });

   it("adds dummy fields only for variables without a matching template field - test", () => {
      const variables = dtestData.dPromptVariables(1);
      const prompt = dtestData.dPromptWithContent();
      prompt.fields = variables;

      sExtractVariablesMock.mockReturnValue([variables[0].name, "missing_var"]);

      const result = resolveAllTemplateFields(prompt, []);

      const expectedResult = [
         ...variables,
         missingVariableToTemplateFieldInternal("missing_var", 0),
      ];

      expect(result).toEqual(expectedResult);
   });

   it("does not add a dummy field for a variable covered by a global field - test", () => {
      const globalField = {
         ...dtestData.dGlobalPromptField(1),
         name: "global_var",
      };
      const prompt = dtestData.dPromptWithContent();
      prompt.fields = [];

      sExtractVariablesMock.mockReturnValue(["global_var"]);

      const result = resolveAllTemplateFields(prompt, [globalField]);

      const expectedResult = [globalFieldToTemplateFieldInternal(globalField)];

      expect(result).toEqual(expectedResult);
   });

   it("returns empty array when content has no variables and no fields exist - test", () => {
      const prompt = dtestData.dPromptWithContent();
      prompt.fields = [];

      sExtractVariablesMock.mockReturnValue([]);

      const result = resolveAllTemplateFields(prompt, []);

      expect(result).toEqual([]);
   });

   it("merges template fields, global fields, and dummy fields in correct order - test", () => {
      const variable = dtestData.dPromptVariable(1);
      const globalField = dtestData.dGlobalPromptField(2);
      globalField.name = "global_field";

      const prompt = dtestData.dPromptWithContent();
      prompt.fields = [variable];

      sExtractVariablesMock.mockReturnValue([
         variable.name,
         "global_field",
         "extra_var",
      ]);

      const result = resolveAllTemplateFields(prompt, [globalField]);

      const expectedResult = [
         variable,
         globalFieldToTemplateFieldInternal(globalField),
         missingVariableToTemplateFieldInternal("extra_var", 0),
      ];

      expect(result).toEqual(expectedResult);
   });
});
