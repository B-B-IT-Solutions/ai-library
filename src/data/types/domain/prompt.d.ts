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
   isFavorite: boolean;
   categories: DPromptCategory[];
   updatedAt: string;
   createdAt: string;
};

export type DPrompt = {
   content: string;
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

export type DPromptDescriptorsPageQuery = PageQuery<DPromptDescriptorsFilter>;
export type DPromptDescriptorsPage = Page<DPromptDescriptor>;

export interface DPromptDescriptorsFilter extends Filter {
   categories?: string[];
}
