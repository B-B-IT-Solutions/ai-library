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

export type DPromptVariableUpdate = z.infer<typeof templateFieldSchema>;

export type DPromptUpdate = z.infer<typeof updateTemplateSchema>;

export type DPromptUpdateCrate = {
   data: DPromptUpdate;
   collectionId?: string;
};

export type DPromptCategory = {
   name: string;
};

export type DPromptGenerationData = {
   template: DPromptWithContent;
   allFields: DPromptVariable[];
};

export type DPrompt = {
   id: string;
   title: string;
   description: string;
   recommendedModel: string;
   isFavorite: boolean;
   categories: DPromptCategory[];
   fields: DPromptVariable[];
   globalFieldIds: string[];
   updatedAt: string;
   createdAt: string;
};

export type DPromptWithContent = DPrompt & {
   content: string;
};

export type DPromptVariableType =
   | "TEXT"
   | "TEXTAREA"
   | "SELECT"
   | "CHECKBOX"
   | "RADIO"
   | "NUMBER"
   | "DATE"
   | "EMAIL";

export type DPromptVariableValueType = string | number | null | undefined;

export type DPromptVariable = {
   id: string;
   promptId: string;
   name: string;
   label: string;
   description: string | null;
   type: DPromptVariableType;
   required: boolean;
   order: number;
   defaultValue: string | null;
   options?: string[];
};

export type DPromptVariableValues = Record<string, DPromptVariableValueType>;

export type DPromptsUsage = {
   current: number;
   limit: number; // -1 = unlimited
};
