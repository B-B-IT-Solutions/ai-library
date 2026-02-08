import { forEach, keys, uniq } from "es-toolkit/compat";

import {
   DPromptTemplateField,
   DPromptTemplateFieldValues,
} from "@/data/types/domain/prompt.template";

export type FieldsValidationResult = {
   valid: boolean;
   errors: Record<string, string>;
};

export class TemplateEngine {
   /**
    * Replaces all {{variable_name}} placeholders with actual values
    */
   static replace(
      template: string,
      values: DPromptTemplateFieldValues
   ): string {
      let result = template;

      const variables = Object.entries(values);

      forEach(variables, ([key, value]) => {
         const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g");
         const replaceValue = String(value ?? "");
         result = result.replace(regex, replaceValue);
      });

      return result;
   }

   /**
    * Validates that all required fields are filled
    */
   static validate(
      fields: DPromptTemplateField[],
      values: DPromptTemplateFieldValues
   ): FieldsValidationResult {
      const errors: Record<string, string> = {};

      forEach(fields, (field) => {
         const value = values[field.name];
         if (field.required && !value) {
            errors[field.name] = `${field.label} ist erforderlich`;
         }

         if (value) {
            switch (field.type) {
               case "EMAIL":
                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
                     errors[field.name] = "Ungültige E-Mail-Adresse";
                  }
                  break;
               case "NUMBER":
                  if (isNaN(Number(value))) {
                     errors[field.name] = "Muss eine Zahl sein";
                  }
                  break;
            }
         }
      });

      const valid = keys(errors).length === 0;

      return {
         valid,
         errors,
      };
   }

   /**
    * Extracts variable names from template text
    */
   static extractVariables(template: string): string[] {
      const regex = /\{\{(\s*[a-zA-Z_][a-zA-Z0-9_]*\s*)\}\}/g;
      const matches = template.matchAll(regex);
      const variables = Array.from(matches, (m) => m[1].trim());
      return uniq(variables);
   }
}
