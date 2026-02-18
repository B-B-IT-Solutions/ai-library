import { Prisma } from "@/generated/prisma/models";
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

// New types for Collections
export type LibraryCollectionWithCount = Prisma.LibraryCollectionGetPayload<{
   include: {
      _count: {
         select: { entries: true };
      };
   };
}>;

export type LibraryEntryWithCollections = Prisma.LibraryEntryGetPayload<{
   include: {
      templateDescriptor: {
         include: { categories: true };
      };
      collectionEntries: {
         select: { collectionId: true };
      };
   };
}>;
