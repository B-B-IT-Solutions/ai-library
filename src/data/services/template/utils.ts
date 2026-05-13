import { filter, map } from "es-toolkit/compat";

import {
   DPromptField,
   DPromptTemplate,
} from "@/data/types/domain/prompt.template";
import { DGlobalTemplateField } from "@/data/types/domain/settings";
import { TemplateEngine } from "@/lib/template";

export const resolveAllTemplateFields = (
   template: DPromptTemplate,
   globalFields: DGlobalTemplateField[]
) => {
   const allFieldNames = new Set([
      ...map(template.fields, (f) => f.name),
      ...map(globalFields, (f) => f.name),
   ]);
   const allVariableNames = TemplateEngine.extractVariables(template.content);
   const missingVariableNames = filter(
      allVariableNames,
      (name) => !allFieldNames.has(name)
   );

   return [
      ...template.fields,
      ...globalFieldsToTemplateFields(globalFields),
      ...missingVariablesToTemplateFields(missingVariableNames),
   ];
};

const globalFieldsToTemplateFields = (
   gfs: DGlobalTemplateField[]
): DPromptField[] => {
   return map(gfs, globalFieldToTemplateField);
};

const globalFieldToTemplateField = (gf: DGlobalTemplateField): DPromptField => {
   return {
      id: gf.id,
      promptTemplateId: "",
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

const missingVariablesToTemplateFields = (
   variableNames: string[]
): DPromptField[] => {
   return map(variableNames, (v, idx) =>
      missingVariableToTemplateField(v, idx)
   );
};

const missingVariableToTemplateField = (
   name: string,
   index: number
): DPromptField => {
   return {
      id: name,
      promptTemplateId: "",
      name,
      label: name,
      description: null,
      type: "TEXT" as const,
      required: true,
      order: 100 + index,
      defaultValue: null,
   };
};
