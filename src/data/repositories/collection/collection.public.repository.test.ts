import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { LibraryCollectionFindUniqueArgs } from "@/generated/prisma/models";

import { toDCollection } from "./collection.mapper";
import { PublicCollectionRepository } from "./collection.public.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const collectionRepository = new PublicCollectionRepository(prismaMock);

describe("pGetCollectionByPublicToken tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("collection - null - test", async () => {
      const publicToken = "non-existent-token";
      prismaMock.libraryCollection.findUnique.mockResolvedValue(null);

      const result =
         await collectionRepository.pGetCollectionByPublicToken(publicToken);

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
         await collectionRepository.pGetCollectionByPublicToken(publicToken);

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
