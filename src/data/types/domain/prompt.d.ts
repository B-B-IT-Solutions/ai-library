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
   template: DPromptWithContent;
   allFields: DPromptField[];
};

export type DPrompt = {
   id: string;
   title: string;
   description: string;
   recommendedModel: string;
   isFavorite: boolean;
   categories: DPromptCategory[];
   fields: DPromptField[];
   globalFieldIds: string[];
   updatedAt: string;
   createdAt: string;
};

export type DPromptWithContent = DPrompt & {
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

export type DTemplateUsage = {
   current: number;
   limit: number; // -1 = unlimited
};
