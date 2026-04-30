import z from "zod";

import {
   templateFieldSchema,
   updateTemplateSchema,
} from "@/data/types/validators/template";
import { Page, PageQuery } from "../common";

export type DTemplateDescriptorsPageQuery =
   PageQuery<DTemplateDescriptorsFilter>;
export type DTemplateDescriptorsPage = Page<DPromptTemplateDescriptor>;

export type DTemplateDescriptorsFilter = {
   search?: string;
   categories?: string[];
   models?: string[];
   isFavorite?: boolean;
   collectionIds?: string[];
};

export type DPromptTemplateFieldUpdate = z.infer<typeof templateFieldSchema>;

export type DPromptTemplateUpdate = z.infer<typeof updateTemplateSchema>;

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
   isFavorite: boolean;
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
