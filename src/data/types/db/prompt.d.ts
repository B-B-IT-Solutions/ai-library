import { Page } from "@/data/types/common";
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

export type PromptDescriptorsPage = Page<PromptDescriptorWithRelations>;
