import z from "zod";

import { Filter, Page, PageQuery } from "@/data/types/common";
import { updatePromptSchema } from "@/data/types/validators/prompt";
import { updatePromptFollowUpSchema } from "../validators/prompt/prompt.schema";

export type DPrompt0FollowUpUpdate = z.infer<typeof updatePromptFollowUpSchema>;

export type DPrompt0Update = z.infer<typeof updatePromptSchema>;

export type DPrompt0Category = {
   name: string;
};

export type DPrompt0 = {
   id: string;
   title: string;
   content: string;
   recommendedModel: string;
   isFavorite: boolean;
   currentVersion: number;
   categories: DPrompt0Category[];
   versions: DPrompt0Version[];
   followUpPrompts: DPrompt0FollowUp[];
   updatedAt: string;
   createdAt: string;
};

export type DPrompt0Content = {
   content: string;
};

export type DPrompt0Version = {
   id: string;
   version: number;
   content: string;
   createdAt: string;
};

export type DPrompt0FollowUp = {
   id: string;
   content: string;
   order: number;
};

export type DPrompt0sPageQuery = PageQuery<DPrompt0sFilter>;
export type DPrompt0sPage = Page<DPrompt0>;

export interface DPrompt0sFilter extends Filter {
   search?: string;
   categories?: string[];
   isFavorite?: boolean;
}
