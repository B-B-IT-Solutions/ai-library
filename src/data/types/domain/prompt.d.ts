import z from "zod";

import { Filter, Page, PageQuery } from "@/data/types/common";
import { createPromptSchema } from "@/data/types/validators/prompt.schema";

export type DPromptCreate = z.infer<typeof createPromptSchema>;

export type DPromptCategory = {
   name: string;
};

export type DPromptDescriptor = {
   id: string;
   title: string;
   recommendedModel: string;
   currentVersion: number;
   isFavorite: boolean;
   categories: DPromptCategory[];
   updatedAt: string;
   createdAt: string;
};

export type DPrompt = DPromptDescriptor & {
   content: string;
   followUpPrompts: string[];
};

export type DPromptVersion = {
   version: number;
   content: string;
   createdAt: string;
};

export type DPromptUpdate = {
   id: string;
   title: string;
   content: string;
   categories: string[];
   recommendedModel: string;
   followUpPrompts: string[];
};

export type DPromptsPageQuery = PageQuery<DPromptsFilter>;
export type DPromptsPage = Page<DPromptDescriptor>;

export interface DPromptsFilter extends Filter {
   categories?: string[];
}
