import z from "zod";

import { updateLibraryCollectionSchema } from "@/data/types/validators/library";

import { Page, PageQuery } from "./common";
import {
   DPromptTemplateDescriptor,
   DPromptTemplateDescriptorWithTemplate,
} from "./prompt.template";

// Library Entry Types
export type DLibraryEntry = {
   id: string;
   userId: string;
   templateDescriptorId: string;
   templateDescriptor: DPromptTemplateDescriptor;
   isFavorite: boolean;
   collections: string[]; // Collection IDs (computed)
   createdAt: string;
   updatedAt: string;
};

export type DLibraryEntryWithPromptTemplate = DLibraryEntry & {
   templateDescriptor: DPromptTemplateDescriptorWithTemplate;
};

export type DLibraryCollectionUpdate = z.infer<
   typeof updateLibraryCollectionSchema
>;

export type DLibraryCollection = {
   id: string;
   userId: string;
   name: string;
   description: string | null;
   color: string | null;
   order: number;
   entryCount: number; // Computed
   createdAt: string;
   updatedAt: string;
};

export type DLibraryCollectionWithEntries = DLibraryCollection & {
   entries: DLibraryEntry[];
};

// Filtering Types
export type DLibraryEntriesFilter = {
   search?: string;
   categories?: string[];
   models?: string[];
   isFavorite?: boolean;
   collectionIds?: string[];
   dateRange?: {
      start?: string;
      end?: string;
   };
};

export type DLibraryEntriesPageQuery = PageQuery<DLibraryEntriesFilter>;
export type DLibraryEntriesPage = Page<DLibraryEntry>;

// View State Types
export type LibraryGroupBy =
   | "none"
   | "category"
   | "model"
   | "date"
   | "collection";

export type LibrarySortBy = "date-desc" | "date-asc" | "name-asc" | "name-desc";

// Collection Input Types
export type CreateCollectionInput = {
   name: string;
   description?: string;
   color?: string;
   order?: number;
};

export type UpdateCollectionInput = {
   name?: string;
   description?: string;
   color?: string;
   order?: number;
};
