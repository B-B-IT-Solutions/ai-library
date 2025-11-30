import { Page, PageQuery } from "@/data/types/common";
import {
   PromptTemplate,
   PromptTemplateCategory,
} from "@/generated/prisma/client";

export type PromptTemplateWithCategories = PromptTemplate & {
   categories: PromptTemplateCategory[];
};

export type PromptsPageQuery = PageQuery<PromptsFilter>;
export type PromptsPage = Page<Prompt>;

export declare interface PromptsFilter extends Filter {
   categories?: string[];
}
