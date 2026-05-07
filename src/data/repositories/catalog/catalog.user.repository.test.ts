import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import {
   CatalogEntryFindFirstArgs,
   CatalogEntryUpdateArgs,
} from "@/generated/prisma/models";

import { toDCatalogEntryWithContent } from "./catalog.mapper";
import { CatalogRepository } from "./catalog.user.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const catalogRepository = new CatalogRepository(prismaMock);

describe("pGetPublishedEntryById tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("entry null - test", async () => {
      prismaMock.catalogEntry.findFirst.mockResolvedValue(null);

      const entryId = "entry-id-1";

      const result = await catalogRepository.pGetPublishedEntryById(entryId);

      const expectedArgs: CatalogEntryFindFirstArgs = {
         where: {
            id: entryId,
            status: "PUBLISHED",
         },
         include: {
            category: true,
            fields: true,
            content: true,
         },
      };

      expect(result).toBeNull();
      expect(prismaMock.catalogEntry.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.catalogEntry.findFirst).toHaveBeenCalledWith(
         expectedArgs
      );
   });

   it("entry retrieved - test", async () => {
      const entry = ptestData.pCatalogEntryWithContent(1);
      prismaMock.catalogEntry.findFirst.mockResolvedValue(entry);

      const entryId = "entry-id-1";

      const result = await catalogRepository.pGetPublishedEntryById(entryId);

      const expectedResult = toDCatalogEntryWithContent(entry);

      const expectedArgs: CatalogEntryFindFirstArgs = {
         where: {
            id: entryId,
            status: "PUBLISHED",
         },
         include: {
            category: true,
            fields: true,
            content: true,
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.catalogEntry.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.catalogEntry.findFirst).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

describe("pIncrementCopyCount tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("count incremented - test", async () => {
      const catalogEntryId = "entry-id-1";
      await catalogRepository.pIncrementCopyCount(catalogEntryId);

      const expectedArgs: CatalogEntryUpdateArgs = {
         where: { id: catalogEntryId },
         data: {
            copyCount: {
               increment: 1,
            },
         },
      };

      expect(prismaMock.catalogEntry.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.catalogEntry.update).toHaveBeenCalledWith(expectedArgs);
   });
});
