import { LibraryEntry } from "@/generated/prisma/client";

import { PromptTemplateDescriptorWithCategories } from "./prompt.template";

export type LibraryEntryWithTemplate = LibraryEntry & {
   template: PromptTemplateDescriptorWithCategories;
};
