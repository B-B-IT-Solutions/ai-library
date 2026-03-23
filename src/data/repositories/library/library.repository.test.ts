import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { map } from "es-toolkit/compat";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import {
   DLibraryEntriesPage,
   DLibraryEntriesPageQuery,
} from "@/data/types/domain/library";
import {
   LibraryEntryCountArgs,
   LibraryEntryCreateArgs,
   LibraryEntryCreateInput,
   LibraryEntryCreateManyArgs,
   LibraryEntryCreateManyInput,
   LibraryEntryDeleteManyArgs,
   LibraryEntryFindManyArgs,
   LibraryEntryFindUniqueArgs,
} from "@/generated/prisma/models";

import {
   toDLibraryEntries,
   toDLibraryEntryWithPromptTemplate,
} from "./library.mapper";
import { GetLibraryEntryParams, LibraryRepository } from "./library.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const libraryRepository = new LibraryRepository(prismaMock);

describe("pGetLibraryEntriesPage tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   const include = {
      templateDescriptor: {
         include: {
            categories: true,
         },
      },
   };

   test("pGetLibraryEntriesPage - no query - test", async () => {
      const userId = "user-id-1";
      const libraryEntries = ptestData.pLibraryEntriesWithTemplateDescriptor();
      const totalEntries = 15;
      prismaMock.libraryEntry.findMany.mockResolvedValue(libraryEntries);
      prismaMock.libraryEntry.count.mockResolvedValue(totalEntries);

      const result = await libraryRepository.pGetLibraryEntriesPage(userId);

      const expectedResult: DLibraryEntriesPage = {
         content: toDLibraryEntries(libraryEntries),
         pageNumber: 1,
         pageSize: 20,
         numberOfElements: libraryEntries.length,
         totalPages: Math.ceil(totalEntries / 20),
         totalElements: totalEntries,
      };

      const expectedFindManyArgs: LibraryEntryFindManyArgs = {
         where: { userId },
         include,
         orderBy: { createdAt: "desc" },
         skip: 20,
         take: 20,
      };

      const expectedCountArgs: LibraryEntryCountArgs = {
         where: { userId },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.libraryEntry.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryEntry.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.libraryEntry.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryEntry.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });

   test("pGetLibraryEntriesPage - sort createdAt asc - test", async () => {
      const userId = "user-id-1";
      const libraryEntries = ptestData.pLibraryEntriesWithTemplateDescriptor();
      const totalEntries = 25;
      prismaMock.libraryEntry.findMany.mockResolvedValue(libraryEntries);
      prismaMock.libraryEntry.count.mockResolvedValue(totalEntries);

      const query: DLibraryEntriesPageQuery = {
         pagination: { pageNumber: 2, pageSize: 10 },
         sort: { field: "createdAt", order: "asc" },
      };

      const result = await libraryRepository.pGetLibraryEntriesPage(
         userId,
         query
      );

      const expectedResult: DLibraryEntriesPage = {
         content: toDLibraryEntries(libraryEntries),
         pageNumber: 2,
         pageSize: 10,
         numberOfElements: libraryEntries.length,
         totalPages: Math.ceil(totalEntries / 10),
         totalElements: totalEntries,
      };

      const expectedFindManyArgs: LibraryEntryFindManyArgs = {
         where: { userId },
         include,
         orderBy: { createdAt: "asc" },
         skip: 20,
         take: 10,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.libraryEntry.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
   });

   test("pGetLibraryEntriesPage - sort title asc - test", async () => {
      const userId = "user-id-1";
      const libraryEntries = ptestData.pLibraryEntriesWithTemplateDescriptor();
      prismaMock.libraryEntry.findMany.mockResolvedValue(libraryEntries);
      prismaMock.libraryEntry.count.mockResolvedValue(0);

      const query: DLibraryEntriesPageQuery = {
         pagination: { pageNumber: 0, pageSize: 10 },
         sort: { field: "title", order: "asc" },
      };

      await libraryRepository.pGetLibraryEntriesPage(userId, query);

      const expectedFindManyArgs: LibraryEntryFindManyArgs = {
         where: { userId },
         include,
         orderBy: { templateDescriptor: { title: "asc" } },
         skip: 0,
         take: 10,
      };

      expect(prismaMock.libraryEntry.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
   });

   test("pGetLibraryEntriesPage - sort title desc - test", async () => {
      const userId = "user-id-1";
      const libraryEntries = ptestData.pLibraryEntriesWithTemplateDescriptor();
      prismaMock.libraryEntry.findMany.mockResolvedValue(libraryEntries);
      prismaMock.libraryEntry.count.mockResolvedValue(0);

      const query: DLibraryEntriesPageQuery = {
         pagination: { pageNumber: 0, pageSize: 10 },
         sort: { field: "title", order: "desc" },
      };

      await libraryRepository.pGetLibraryEntriesPage(userId, query);

      const expectedFindManyArgs: LibraryEntryFindManyArgs = {
         where: { userId },
         include,
         orderBy: { templateDescriptor: { title: "desc" } },
         skip: 0,
         take: 10,
      };

      expect(prismaMock.libraryEntry.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
   });
});

describe("pGetLibraryEntries tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("pGetLibraryEntries test", async () => {
      const userId = "user-id-1";
      const libraryEntries = ptestData.pLibraryEntriesWithTemplateDescriptor();
      prismaMock.libraryEntry.findMany.mockResolvedValue(libraryEntries);

      const result = await libraryRepository.pGetLibraryEntries(userId);

      const expectedResult = toDLibraryEntries(libraryEntries);

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

      expect(result).toEqual(expectedResult);
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

   it("pGetLibraryEntry - entry null - test", async () => {
      const userId = "user-id-1";
      const entryId = "entry-id-1";
      prismaMock.libraryEntry.findUnique.mockResolvedValue(null);

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
                        globalFields: true,
                     },
                  },
               },
            },
         },
      };

      expect(result).toBeNull();
      expect(prismaMock.libraryEntry.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryEntry.findUnique).toHaveBeenCalledWith(
         expectedFindUniqueArgs
      );
   });

   test("pGetLibraryEntry - entryId defined -  test", async () => {
      const libraryEntry = ptestData.pLibraryEntryWithPromptTemplate();
      prismaMock.libraryEntry.findUnique.mockResolvedValue(libraryEntry);

      const { id: entryId, userId } = libraryEntry;

      const params: GetLibraryEntryParams = { entryId, userId };
      const result = await libraryRepository.pGetLibraryEntry(params);

      const expectedResult = toDLibraryEntryWithPromptTemplate(libraryEntry);

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
                        globalFields: true,
                     },
                  },
               },
            },
         },
      };

      expect(result).toEqual(expectedResult);
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

      const expectedResult = toDLibraryEntryWithPromptTemplate(libraryEntry);

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
                        globalFields: true,
                     },
                  },
               },
            },
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.libraryEntry.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryEntry.findUnique).toHaveBeenCalledWith(
         expectedFindUniqueArgs
      );
   });
});

describe("pCreateLibraryEntry tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("pCreateLibraryEntry test", async () => {
      const userId = "user-id-1";
      const templateDescriptorId = "template-descriptor-id-1";
      const newEntry = ptestData.pLibraryEntry();
      prismaMock.libraryEntry.create.mockResolvedValue(newEntry);

      const result = await libraryRepository.pCreateLibraryEntry(
         userId,
         templateDescriptorId
      );

      const expectedInput: LibraryEntryCreateInput = {
         templateDescriptor: {
            connect: {
               id: templateDescriptorId,
            },
         },
         user: {
            connect: {
               id: userId,
            },
         },
      };
      const expectedCreateArgs: LibraryEntryCreateArgs = {
         data: expectedInput,
      };

      expect(result).toEqual(newEntry);
      expect(prismaMock.libraryEntry.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryEntry.create).toHaveBeenCalledWith(
         expectedCreateArgs
      );
   });
});

describe("pCreateLibraryEntries tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("pCreateLibraryEntries test", async () => {
      const userId = "user-id-1";
      const templateDescriptorIds = ["1", "2", "3"];

      await libraryRepository.pCreateLibraryEntries(
         userId,
         templateDescriptorIds
      );

      const expectedEntries = map(
         templateDescriptorIds,
         (templateDescriptorId) => {
            const entry: LibraryEntryCreateManyInput = {
               userId,
               templateDescriptorId,
            };
            return entry;
         }
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
