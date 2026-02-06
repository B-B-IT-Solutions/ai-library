import { LibraryEntry } from "@/generated/prisma/client";

import {
   PromptTemplateDescriptorWithCategories,
   PromptTemplateDescriptorWithTemplate,
} from "./prompt.template";

export type LibraryEntryWithPromptTemplateDescriptor = LibraryEntry & {
   templateDescriptor: PromptTemplateDescriptorWithCategories;
};

export type LibraryEntryWithPromptTemplate = LibraryEntry & {
   templateDescriptor: PromptTemplateDescriptorWithTemplate;
};
