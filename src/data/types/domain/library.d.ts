import z from "zod";

import { Page, PageQuery } from "@/data/types/common";
import { updateLibraryCollectionSchema } from "@/data/types/validators/library";

import {
   DPromptTemplateDescriptor,
   DPromptTemplateDescriptorWithTemplate,
} from "./prompt.template";

export type DLibraryEntriesPageQuery = PageQuery<DLibraryEntriesFilter>;
export type DLibraryEntriesPage = Page<DLibraryEntry>;

export type DLibraryEntriesFilter = {
   search?: string;
   categories?: string[];
   models?: string[];
   isFavorite?: boolean;
   collectionIds?: string[];
};

export type DLibraryEntry = {
   id: string;
   userId: string;
   templateDescriptorId: string;
   templateDescriptor: DPromptTemplateDescriptor;
   isFavorite: boolean;
   collections: string[]; // Collection IDs
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

export type DCollectionUpdate = {
   name?: string;
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
