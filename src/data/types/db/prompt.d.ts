import { Page, PageQuery } from "@/data/types/common";
import { Prompt, PromptCategory } from "@/generated/prisma/client";

export type PromptWithCategories = Prompt & {
   categories: PromptCategory[];
};

export type PromptsPageQuery = PageQuery<PromptsFilter>;
export type PromptsPage = Page<PromptWithCategories>;

export declare interface PromptsFilter extends Filter {
   categories?: string[];
}
