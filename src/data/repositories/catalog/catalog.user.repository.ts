import { CatalogEntryWithContent } from "@/data/types/db/catalog";
import { DbClient } from "@/data/types/db/common";
import { DCatalogEntryWithContent } from "@/data/types/domain/catalog";
import {
   CatalogEntryFindFirstArgs,
   CatalogEntryUpdateArgs,
} from "@/generated/prisma/models";

import { toDCatalogEntryWithContent } from "./catalog.mapper";

export class CatalogRepository {
   constructor(private readonly prisma: DbClient) {}

   async pGetPublishedEntryById(
      id: string
   ): Promise<DCatalogEntryWithContent | null> {
      const args = {
         where: {
            id,
            status: "PUBLISHED",
         },
         include: {
            category: true,
            fields: true,
            content: true,
         },
      } satisfies CatalogEntryFindFirstArgs;

      const entry = (await this.prisma.catalogEntry.findFirst(
         args
      )) as CatalogEntryWithContent;

      if (entry) {
         return toDCatalogEntryWithContent(entry);
      }
      return null;
   }

   async pIncrementCopyCount(catalogEntryId: string): Promise<void> {
      const args = {
         where: { id: catalogEntryId },
         data: {
            copyCount: {
               increment: 1,
            },
         },
      } satisfies CatalogEntryUpdateArgs;

      await this.prisma.catalogEntry.update(args);
   }
}
