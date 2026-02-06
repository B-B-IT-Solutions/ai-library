export type DPromptTemplateCategory = {
   name: string;
};

export type DPromptTemplate = {
   id: string;
   detailedDescription: string;
   promptText: string;
   fields: DPromptTemplateField[];
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

export type DPromptTemplateFieldType =
   | "TEXT"
   | "TEXTAREA"
   | "SELECT"
   | "CHECKBOX"
   | "RADIO"
   | "NUMBER"
   | "DATE"
   | "EMAIL";

export type DPromptTemplateFieldValueType = string | number | null | undefined;

export type DPromptTemplateField = {
   id: string;
   promptTemplateId: string;
   name: string;
   label: string;
   description?: string;
   type: DPromptTemplateFieldType;
   required: boolean;
   order: number;
   defaultValue?: string;
   options?: string[];
};

export type DPromptTemplateFieldValues = Record<
   string,
   DPromptTemplateFieldValueType
>;
