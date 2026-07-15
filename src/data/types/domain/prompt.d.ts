import z from "zod";

import {
   promptVariableSchema,
   renameCategorySchema,
   updateTemplateSchema,
} from "@/data/types/validators/template";
import { Page, PageQuery } from "../common";

export type DPromptsPageQuery = PageQuery<DPromptsFilter>;
export type DPromptsPage = Page<DPrompt>;

export type DPromptPreviewsPageQuery = PageQuery<DPromptsFilter>;
export type DPromptPreviewsPage = Page<DPromptPreview>;

export type DPromptsFilter = {
   search?: string;
   categories?: string[];
   models?: string[];
   isFavorite?: boolean;
   collectionIds?: string[];
};

export type DPromptCategoriesPageQuery = PageQuery<DPromptCategoriesFilter>;
export type DPromptCategoriesPage = Page<string>;

export type DPromptCategoriesFilter = {
   search?: string;
};

export type DPromptVariableUpdate = z.infer<typeof promptVariableSchema>;

export type DPromptUpdate = z.infer<typeof updateTemplateSchema>;

export type DPromptUpdateCrate = {
   data: DPromptUpdate;
   collectionId?: string;
};

export type DPromptCategory = {
   name: string;
};

export type DPromptCategoryUsage = {
   id: number;
   name: string;
   count: number;
};

export type DRenameCategory = z.infer<typeof renameCategorySchema>;

export type DPromptTemplatingData = {
   prompt: DPromptWithContent;
   allVariables: DPromptVariable[];
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

export type DPromptPreview = Pick<DPrompt, "id" | "title">;

export type DPromptVariableType =
   | "TEXT"
   | "TEXTAREA"
   | "SELECT"
   | "CHECKBOX"
   | "RADIO"
   | "NUMBER"
   | "DATE"
   | "EMAIL";

export type DPromptVariableValueType =
   | string
   | number
   | boolean
   | null
   | undefined;

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
