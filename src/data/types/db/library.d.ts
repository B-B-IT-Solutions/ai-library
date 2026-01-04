import { LibraryEntry } from "@/generated/prisma/client";

import {
   PromptTemplateDescriptorWithCategories,
   PromptTemplateDescriptorWithPrompt,
} from "./prompt.template";

export type LibraryEntryWithPromptTemplateDescriptor = LibraryEntry & {
   templateDescriptor: PromptTemplateDescriptorWithCategories;
};

export type LibraryEntryWithPromptTemplate = LibraryEntry & {
   templateDescriptor: PromptTemplateDescriptorWithPrompt;
};
