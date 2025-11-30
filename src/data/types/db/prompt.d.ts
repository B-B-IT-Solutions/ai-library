import {
   PromptTemplate,
   PromptTemplateCategory,
} from "@/generated/prisma/client";
import { Page, PageQuery } from "../common";

export type PromptTemplateWithCategories = PromptTemplate & {
   categories: PromptTemplateCategory[];
};

export type PromptsPageQuery = PageQuery<PromptsFilter>;
export type PromptsPage = Page<Prompt>;

export declare interface PromptsFilter extends Filter {
   categories?: string[];
}
