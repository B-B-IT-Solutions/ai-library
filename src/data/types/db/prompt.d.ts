import { Page, PageQuery } from "@/data/types/common";
import { PromptCategory, PromptDescriptor } from "@/generated/prisma/client";

export type PromptDescriptorWithCategories = PromptDescriptor & {
   categories: PromptCategory[];
};

export type PromptDescriptorsPageQuery = PageQuery<PromptDescriptorsFilter>;
export type PromptDescriptorsPage = Page<PromptDescriptorWithCategories>;

export declare interface PromptDescriptorsFilter extends Filter {
   categories?: string[];
}
