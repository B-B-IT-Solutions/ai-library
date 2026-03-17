import z from "zod";

import { Filter, Page, PageQuery } from "@/data/types/common";
import { updatePromptSchema } from "@/data/types/validators/prompt";
import { updatePromptFollowUpSchema } from "../validators/prompt/prompt.schema";

export type DPromptFollowUpUpdate = z.infer<typeof updatePromptFollowUpSchema>;

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
   userId?: string;
   search?: string;
   categories?: string[];
   isFavorite?: boolean;
}
