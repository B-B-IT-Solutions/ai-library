import z from "zod";

import { Filter, Page, PageQuery } from "@/data/types/common";
import {
   createPromptSchema,
   updatePromptSchema,
} from "@/data/types/validators/prompt.schema";

export type DPromptCreate = z.infer<typeof createPromptSchema>;
export type DPromptUpdate = z.infer<typeof updatePromptSchema>;

export type DPromptCategory = {
   name: string;
};

export type DPromptDescriptor = {
   id: string;
   title: string;
   content: string;
   recommendedModel: string;
   isFavorite: boolean;
   currentVersion: number;
   categories: DPromptCategory[];
   versions: DPromptVersion[];
   followUpPrompts: DPromptFollowUp[];
   updatedAt: string;
   createdAt: string;
};

export type DPrompt = {
   content: string;
};

export type DPromptVersion = {
   id: string;
   version: number;
   content: string;
   title: string;
   categories: string[];
   createdAt: string;
};

export type DPromptFollowUp = {
   id: string;
   content: string;
   order: number;
};

export type DPromptDescriptorsPageQuery = PageQuery<DPromptDescriptorsFilter>;
export type DPromptDescriptorsPage = Page<DPromptDescriptor>;

export interface DPromptDescriptorsFilter extends Filter {
   categories?: string[];
   isFavorite?: boolean;
}
