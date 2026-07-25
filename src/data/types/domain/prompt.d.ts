import z from "zod";

import {
   promptVariableSchema,
   promptVersionOptionsSchema,
   updatePromptCategorySchema,
   updatePromptModelSchema,
   updatePromptSchema,
} from "@/data/types/validators/prompt";
import { Page, PageQuery, Pagination } from "../common";

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

export type DPromptModelsPageQuery = PageQuery<DPromptModelsFilter>;
export type DPromptModelsPage = Page<string>;

export type DPromptModelsFilter = {
   search?: string;
};

export type DPromptVariableUpdate = z.infer<typeof promptVariableSchema>;

export type DPromptUpdate = z.infer<typeof updatePromptSchema>;

export type DPromptUpdateCrate = {
   data: DPromptUpdate;
   collectionId?: string;
};

export type DPromptCategory = {
   name: string;
};

export type DPromptCategoryWithUsage = {
   id: number;
   name: string;
   count: number;
};

export type DPromptCategoryUpdate = z.infer<typeof updatePromptCategorySchema>;

export type DPromptModelWithUsage = {
   id: number;
   name: string;
   count: number;
};

export type DPromptModelUpdate = z.infer<typeof updatePromptModelSchema>;

export type DPromptTemplatingData = {
   prompt: DPromptWithContent;
   allVariables: DPromptVariable[];
};

export type DPrompt = {
   id: string;
   title: string;
   description: string;
   model: string;
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

// DPromptUpdateOptions ist bewusst GETRENNT von DPromptUpdate: DPromptUpdate bildet
// ausschließlich die editierbaren Prompt-Felder ab (Titel, Beschreibung, Content, Fields, ...);
// ob ein Save zusätzlich einen Versions-Snapshot auslöst, ist keine Eigenschaft des
// Prompts, sondern eine Verhaltensoption des jeweiligen Funktionsaufrufs.
export type DPromptUpdateOptions = z.infer<typeof promptVersionOptionsSchema>;

export type DPromptVersion = {
   id: string;
   promptId: string;
   versionNumber: number;
   content: string;
   note: string | null;
   createdAt: string;
};

export type DPromptVersionSummary = Omit<DPromptVersion, "content">;

export type DPromptVersionsPageQuery = {
   pagination?: Pagination;
};

export type DPromptVersionsPage = Page<DPromptVersionSummary>;

export type DPromptVersionsResult =
   | { locked: true }
   | { locked: false; page: DPromptVersionsPage; hasUnversionedChanges: boolean };
