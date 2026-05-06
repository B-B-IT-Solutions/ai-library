import {
   CatalogCategory,
   CatalogEntry,
   CatalogEntryContent,
   CatalogEntryField,
} from "@/generated/prisma/client";

export type CatalogEntryWithRelations = CatalogEntry & {
   category: CatalogCategory | null;
   fields: CatalogEntryField[];
};

export type CatalogEntryWithContent = CatalogEntryWithRelations & {
   content: CatalogEntryContent;
};
