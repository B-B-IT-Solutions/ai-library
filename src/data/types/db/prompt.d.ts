import { Filter, Page, PageQuery } from "@/data/types/common";
import {
   PromptCategory,
   PromptDescriptor,
   PromptFollowUp,
   PromptVersion,
} from "@/generated/prisma/client";

export type PromptDescriptorWithRelations = PromptDescriptor & {
   categories: PromptCategory[];
   versions: PromptVersion[];
   followUpPrompts: PromptFollowUp[];
};

export type PromptDescriptorsPageQuery = PageQuery<PromptDescriptorsFilter>;
export type PromptDescriptorsPage = Page<PromptDescriptorWithRelations>;

export declare interface PromptDescriptorsFilter extends Filter {
   categories?: string[];
   isFavorite?: boolean;
}
