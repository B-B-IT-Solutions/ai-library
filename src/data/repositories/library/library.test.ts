import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { map } from "es-toolkit/compat";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import {
   LibraryEntryCreateManyArgs,
   LibraryEntryFindManyArgs,
   LibraryEntryFindUniqueArgs,
} from "@/generated/prisma/models";

import { LibraryRepository } from "./library";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const libraryRepository = new LibraryRepository(prismaMock);

describe("pGetLibraryEntries tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetLibraryEntries test", async () => {
      const userId = "user-id-1";
      const libraryEntries = ptestData.pLibraryEntriesWithTemplate();
      prismaMock.libraryEntry.findMany.mockResolvedValue(libraryEntries);

      const result = await libraryRepository.pGetLibraryEntries(userId);

      const expectedFindManyArgs: LibraryEntryFindManyArgs = {
         where: { userId },
         include: {
            template: {
               include: {
                  categories: true,
               },
            },
         },
         orderBy: {
            createdAt: "desc",
         },
      };

      expect(result).toEqual(libraryEntries);
      expect(prismaMock.libraryEntry.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryEntry.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
   });
});

describe("pCreateLibraryEntries tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pCreateLibraryEntries test", async () => {
      const orderId = "order-id-1";
      const userId = "user-id-1";
      const productId = "product-id-1";
      const templateIds = ["1", "2", "3"];

      await libraryRepository.pCreateLibraryEntries(
         orderId,
         userId,
         productId,
         templateIds
      );

      const expectedEntries = map(templateIds, (templateId) => ({
         orderId,
         userId,
         productId,
         templateId,
      }));

      const expectedCreateManyArgs: LibraryEntryCreateManyArgs = {
         data: expectedEntries,
         skipDuplicates: true,
      };

      expect(prismaMock.libraryEntry.createMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryEntry.createMany).toHaveBeenCalledWith(
         expectedCreateManyArgs
      );
   });
});

describe("pCheckUserHasTemplate tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pCheckUserHasTemplate - template not found - test", async () => {
      const userId = "user-id-123";
      const templateId = "template-id-123";
      prismaMock.libraryEntry.findUnique.mockResolvedValue(null);

      const result = await libraryRepository.pCheckUserHasTemplate(
         userId,
         templateId
      );

      const expectedFindUniqueArgs: LibraryEntryFindUniqueArgs = {
         where: {
            userId_templateId: {
               userId,
               templateId,
            },
         },
      };

      expect(result).toEqual(false);
      expect(prismaMock.libraryEntry.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryEntry.findUnique).toHaveBeenCalledWith(
         expectedFindUniqueArgs
      );
   });

   test("pCheckUserHasTemplate - template found - test", async () => {
      const userId = "user-id-456";
      const templateId = "template-id-456";
      const entry = ptestData.pLibraryEntry();
      prismaMock.libraryEntry.findUnique.mockResolvedValue(entry);

      const result = await libraryRepository.pCheckUserHasTemplate(
         userId,
         templateId
      );

      const expectedFindUniqueArgs: LibraryEntryFindUniqueArgs = {
         where: {
            userId_templateId: {
               userId,
               templateId,
            },
         },
      };

      expect(result).toEqual(true);
      expect(prismaMock.libraryEntry.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryEntry.findUnique).toHaveBeenCalledWith(
         expectedFindUniqueArgs
      );
   });
});
