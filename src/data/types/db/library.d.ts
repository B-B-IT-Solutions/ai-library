import { LibraryEntry } from "@/generated/prisma/client";

import { PromptTemplateWithCategories } from "./prompt.template";

export type LibraryEntryWithTemplate = LibraryEntry & {
   template: PromptTemplateWithCategories;
};
