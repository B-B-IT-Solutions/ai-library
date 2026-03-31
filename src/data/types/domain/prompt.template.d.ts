import z from "zod";

import {
   promptTemplateFieldSchema,
   updatePromptTemplateSchema,
} from "@/data/types/validators/prompt-template";

export type DPromptTemplateFieldUpdate = z.infer<
   typeof promptTemplateFieldSchema
>;

export type DPromptTemplateUpdate = z.infer<typeof updatePromptTemplateSchema>;

export type DPromptTemplateCategory = {
   name: string;
};

export type DPromptTemplate = {
   id: string;
   content: string;
   fields: DPromptTemplateField[];
   globalFieldIds: string[];
   updatedAt: string;
   createdAt: string;
};

export type DPromptTemplateDataPromptGeneration = {
   template: DPromptTemplate;
   allFields: DPromptTemplateField[];
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

export type DPromptTemplateDescriptorWithTemplate =
   DPromptTemplateDescriptor & {
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
   description: string | null;
   type: DPromptTemplateFieldType;
   required: boolean;
   order: number;
   defaultValue: string | null;
   options?: string[];
};

export type DPromptTemplateFieldValues = Record<
   string,
   DPromptTemplateFieldValueType
>;
