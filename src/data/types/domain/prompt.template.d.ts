export type DPromptTemplateCategory = {
   name: string;
};

export type DPromptTemplate = {
   id: string;
   detailedDescription: string;
   promptText: string;
   fields: DTemplateField[];
   updatedAt: string;
   createdAt: string;
};

export type DPromptTemplateDescriptor = {
   id: string;
   title: string;
   description: string;
   recommendedModel: string;
   categories: DPromptTemplateCategory[];
   promptTemplateId: string;
   updatedAt: string;
   createdAt: string;
};

export type DPromptTemplateDescriptorWithPrompt = DPromptTemplateDescriptor & {
   promptTemplate: DPromptTemplate;
};

export type DTemplateFieldType =
   | "TEXT"
   | "TEXTAREA"
   | "SELECT"
   | "CHECKBOX"
   | "RADIO"
   | "NUMBER"
   | "DATE"
   | "EMAIL";

export type DTemplateFieldValueType = string | number | null | undefined;

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

export type DTemplateFieldValues = Record<string, DTemplateFieldValueType>;
