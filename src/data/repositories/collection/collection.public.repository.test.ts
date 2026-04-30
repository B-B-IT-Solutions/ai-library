import { PrismaClient } from "@prisma/client";
import { dtestData, ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import {
   LibraryCollectionCountArgs,
   LibraryCollectionFindUniqueArgs,
} from "@/generated/prisma/models";

import { toDCollection } from "./collection.mapper";
import { PublicCollectionRepository } from "./collection.public.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const collectionRepository = new PublicCollectionRepository(prismaMock);

describe("pGetPublicCollectionByToken tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("collection - null - test", async () => {
      const publicToken = "non-existent-token";
      prismaMock.libraryCollection.findUnique.mockResolvedValue(null);

      const result =
         await collectionRepository.pGetPublicCollectionByToken(publicToken);

      const expectedArgs: LibraryCollectionFindUniqueArgs = {
         where: {
            publicToken,
            isPublic: true,
         },
         include: {
            _count: {
               select: {
                  entries: true,
               },
            },
         },
      };

      expect(result).toBeNull();
      expect(prismaMock.libraryCollection.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryCollection.findUnique).toHaveBeenCalledWith(
         expectedArgs
      );
   });

   it("collection - retrieved - test", async () => {
      const publicToken = "token-1";
      const collection = ptestData.pTemplateCollection();
      prismaMock.libraryCollection.findUnique.mockResolvedValue(collection);

      const result =
         await collectionRepository.pGetPublicCollectionByToken(publicToken);

      const expectedResult = toDCollection(collection);

      const expectedArgs: LibraryCollectionFindUniqueArgs = {
         where: {
            publicToken,
            isPublic: true,
         },
         include: {
            _count: {
               select: {
                  entries: true,
               },
            },
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.libraryCollection.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryCollection.findUnique).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

describe("pEnsureCollectionsPublic tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("empty array - test", async () => {
      const result = await collectionRepository.pEnsureCollectionsPublic([]);

      expect(result).toBe(false);
      expect(prismaMock.libraryCollection.count).not.toHaveBeenCalled();
   });

   it("not all collections public - test", async () => {
      const collectionIds = dtestData.dCollectionIds();
      prismaMock.libraryCollection.count.mockResolvedValue(
         collectionIds.length - 1
      );

      const result =
         await collectionRepository.pEnsureCollectionsPublic(collectionIds);

      const expectedArgs: LibraryCollectionCountArgs = {
         where: {
            id: { in: collectionIds },
            isPublic: true,
         },
      };

      expect(result).toBe(false);
      expect(prismaMock.libraryCollection.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryCollection.count).toHaveBeenCalledWith(
         expectedArgs
      );
   });

   it("all collections public - test", async () => {
      const collectionIds = dtestData.dCollectionIds();
      prismaMock.libraryCollection.count.mockResolvedValue(
         collectionIds.length
      );

      const result =
         await collectionRepository.pEnsureCollectionsPublic(collectionIds);

      const expectedArgs: LibraryCollectionCountArgs = {
         where: {
            id: { in: collectionIds },
            isPublic: true,
         },
      };

      expect(result).toBe(true);
      expect(prismaMock.libraryCollection.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryCollection.count).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});
