import z from "zod";

import { Filter, Page, PageQuery } from "@/data/types/common";
import { createPromptSchema } from "@/data/types/validators/prompt.schema";

export type DPromptCreate = z.infer<typeof createPromptSchema>;

export type DPrompt = DPromptCreate & {
   id: string;
   currentVersion: number;
   versions: DPromptVersion[];
   isFavorite: boolean;
   updatedAt: string;
   createdAt: string;
};

export type DPromptVersion = {
   version: number;
   content: string;
   createdAt: string;
};

export type DPromptUdapte = {
   id: stirng;
   title: stirng;
   content: string;
   categories: string[];
   recommendedModel: string;
   followUpPrompts: string[];
};

export type DPromptsPageQuery = PageQuery<DPromptsFilter>;
export type DPromptsPage = Page<DPrompt>;

export interface DPromptsFilter extends Filter {
   categories?: string[];
}
