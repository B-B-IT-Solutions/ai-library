import z from "zod";

import {
   templateFieldSchema,
   updateTemplateSchema,
} from "@/data/types/validators/template";
import { Page, PageQuery } from "../common";

export type DPromptsPageQuery = PageQuery<DPromptsFilter>;
export type DPromptsPage = Page<DPrompt>;

export type DPromptsFilter = {
   search?: string;
   categories?: string[];
   models?: string[];
   isFavorite?: boolean;
   collectionIds?: string[];
};

export type DPromptFieldUpdate = z.infer<typeof templateFieldSchema>;

export type DPromptUpdate = z.infer<typeof updateTemplateSchema>;

export type DPromptCategory = {
   name: string;
};

export type DPromptGenerationData = {
   template: DPromptContent;
   allFields: DPromptField[];
};

export type DPrompt = {
   id: string;
   title: string;
   description: string;
   recommendedModel: string;
   categories: DPromptCategory[];
   fields: DPromptField[];
   globalFieldIds: string[];
   isFavorite: boolean;
   updatedAt: string;
   createdAt: string;
};

export type DPromptContent = {
   content: string;
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
