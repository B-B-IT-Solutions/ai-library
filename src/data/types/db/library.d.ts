import { Library } from "@/generated/prisma/client";

import { PromptTemplateWithCategories } from "./prompt.template";

export type LibraryEntryWithTemplate = Library & {
   template: PromptTemplateWithCategories;
};
