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

export type DPromptFieldUpdate = z.infer<typeof templateFieldSchema>;

export type DPromptTemplateUpdate = z.infer<typeof updateTemplateSchema>;

export type DPromptTemplateCategory = {
   name: string;
};

export type DPromptTemplate = {
   id: string;
   content: string;
   fields: DPromptField[];
   globalFieldIds: string[];
   updatedAt: string;
   createdAt: string;
};

export type DPromptTemplateDataPromptGeneration = {
   template: DPromptTemplate;
   allFields: DPromptField[];
};

export type DPromptTemplateDescriptor = {
   id: string;
   title: string;
   description: string;
   recommendedModel: string;
   categories: DPromptTemplateCategory[];
   isFavorite: boolean;
   updatedAt: string;
   createdAt: string;
};

export type DPromptFieldType =
   | "TEXT"
   | "TEXTAREA"
   | "SELECT"
   | "CHECKBOX"
   | "RADIO"
   | "NUMBER"
   | "DATE"
   | "EMAIL";

export type DPromptFieldValueType = string | number | null | undefined;

export type DPromptField = {
   id: string;
   promptId: string;
   name: string;
   label: string;
   description: string | null;
   type: DPromptFieldType;
   required: boolean;
   order: number;
   defaultValue: string | null;
   options?: string[];
};

export type DPromptFieldValues = Record<string, DPromptFieldValueType>;
