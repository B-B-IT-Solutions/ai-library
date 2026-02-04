import {
  DTemplateField,
  DTemplateFieldValues,
} from "@/data/types/domain/template.field";

/**
 * Replaces {{variable_name}} placeholders with actual values
 */
export class TemplateEngine {
  static render(template: string, values: DTemplateFieldValues): string {
    let result = template;

    // Replace all {{variable_name}} with values
    Object.entries(values).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g");
      result = result.replace(regex, String(value ?? ""));
    });

    return result;
  }

  /**
   * Validates that all required fields are filled
   */
  static validate(
    fields: DTemplateField[],
    values: DTemplateFieldValues
  ): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    fields.forEach((field) => {
      if (field.required && !values[field.name]) {
        errors[field.name] = `${field.label} ist erforderlich`;
      }

      // Type-specific validation
      if (values[field.name]) {
        switch (field.type) {
          case "EMAIL":
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values[field.name])) {
              errors[field.name] = "Ungültige E-Mail-Adresse";
            }
            break;
          case "NUMBER":
            if (isNaN(Number(values[field.name]))) {
              errors[field.name] = "Muss eine Zahl sein";
            }
            break;
          // Add more validation as needed
        }
      }
    });

    return { valid: Object.keys(errors).length === 0, errors };
  }

  /**
   * Extracts variable names from template text
   */
  static extractVariables(template: string): string[] {
    const regex = /\{\{(\s*[a-zA-Z_][a-zA-Z0-9_]*\s*)\}\}/g;
    const matches = template.matchAll(regex);
    return Array.from(matches, (m) => m[1].trim());
  }
}
