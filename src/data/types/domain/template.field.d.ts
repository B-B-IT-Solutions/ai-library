export type DTemplateFieldType =
  | "TEXT"
  | "TEXTAREA"
  | "SELECT"
  | "CHECKBOX"
  | "RADIO"
  | "NUMBER"
  | "DATE"
  | "EMAIL";

export type DTemplateField = {
  id: string;
  promptTemplateId: string;
  name: string;
  label: string;
  description?: string;
  type: DTemplateFieldType;
  required: boolean;
  order: number;
  defaultValue?: string;
  options?: string[]; // Parsed from JSON
  validation?: Record<string, any>; // Parsed from JSON
};

export type DTemplateFieldValues = Record<string, any>;
