import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { map } from "es-toolkit/compat";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import {
   LibraryEntryCreateManyArgs,
   LibraryEntryDeleteManyArgs,
   LibraryEntryFindManyArgs,
   LibraryEntryFindUniqueArgs,
} from "@/generated/prisma/models";

import { GetLibraryEntryParams, LibraryRepository } from "./library";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const libraryRepository = new LibraryRepository(prismaMock);

describe("pGetLibraryEntries tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("pGetLibraryEntries test", async () => {
      const userId = "user-id-1";
      const libraryEntries = ptestData.pLibraryEntriesWithTemplateDescriptor();
      prismaMock.libraryEntry.findMany.mockResolvedValue(libraryEntries);

      const result = await libraryRepository.pGetLibraryEntries(userId);

      const expectedFindManyArgs: LibraryEntryFindManyArgs = {
         where: { userId },
         include: {
            templateDescriptor: {
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

describe("pGetLibraryEntry tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("pGetLibraryEntry - entryId defined -  test", async () => {
      const libraryEntry = ptestData.pLibraryEntryWithPromptTemplate();
      prismaMock.libraryEntry.findUnique.mockResolvedValue(libraryEntry);

      const { id: entryId, userId } = libraryEntry;

      const params: GetLibraryEntryParams = { entryId, userId };
      const result = await libraryRepository.pGetLibraryEntry(params);

      const expectedFindUniqueArgs: LibraryEntryFindUniqueArgs = {
         where: {
            id: entryId,
            userId,
         },
         include: {
            templateDescriptor: {
               include: {
                  categories: true,
                  promptTemplate: {
                     include: {
                        fields: true,
                     },
                  },
               },
            },
         },
      };

      expect(result).toEqual(libraryEntry);
      expect(prismaMock.libraryEntry.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryEntry.findUnique).toHaveBeenCalledWith(
         expectedFindUniqueArgs
      );
   });

   test("pGetLibraryEntry - templateDescriptorId defined -  test", async () => {
      const libraryEntry = ptestData.pLibraryEntryWithPromptTemplate();
      prismaMock.libraryEntry.findUnique.mockResolvedValue(libraryEntry);

      const { templateDescriptorId, userId } = libraryEntry;

      const params: GetLibraryEntryParams = { templateDescriptorId, userId };
      const result = await libraryRepository.pGetLibraryEntry(params);

      const expectedFindUniqueArgs: LibraryEntryFindUniqueArgs = {
         where: {
            userId_templateDescriptorId: {
               userId,
               templateDescriptorId,
            },
         },
         include: {
            templateDescriptor: {
               include: {
                  categories: true,
                  promptTemplate: {
                     include: {
                        fields: true,
                     },
                  },
               },
            },
         },
      };

      expect(result).toEqual(libraryEntry);
      expect(prismaMock.libraryEntry.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryEntry.findUnique).toHaveBeenCalledWith(
         expectedFindUniqueArgs
      );
   });
});

describe("pCreateLibraryEntries tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("pCreateLibraryEntries test", async () => {
      const orderId = "order-id-1";
      const userId = "user-id-1";
      const productId = "product-id-1";
      const templateDescriptorIds = ["1", "2", "3"];

      await libraryRepository.pCreateLibraryEntries(
         orderId,
         userId,
         productId,
         templateDescriptorIds
      );

      const expectedEntries = map(
         templateDescriptorIds,
         (templateDescriptorId) => ({
            orderId,
            userId,
            productId,
            templateDescriptorId,
         })
      );

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

describe("pDeleteLibraryEntries tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("pDeleteLibraryEntries test", async () => {
      const userId = "user-id-1";
      await libraryRepository.pDeleteLibraryEntries(userId);

      const expectedDeleteManyArgs: LibraryEntryDeleteManyArgs = {
         where: { userId },
      };

      expect(prismaMock.libraryEntry.deleteMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryEntry.deleteMany).toHaveBeenCalledWith(
         expectedDeleteManyArgs
      );
   });
});
