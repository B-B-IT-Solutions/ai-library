import {
   CatalogCategory,
   CatalogEntry,
   CatalogEntryField,
} from "@/generated/prisma/client";

export type CatalogEntryWithRelations = CatalogEntry & {
   category: CatalogCategory | null;
   fields: CatalogEntryField[];
};
