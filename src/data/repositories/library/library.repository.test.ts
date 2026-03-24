import { PrismaClient } from "@prisma/client";
import { dtestData, ptestData } from "@tests";
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
   LibraryEntryDeleteArgs,
   LibraryEntryDeleteManyArgs,
   LibraryEntryFindManyArgs,
   LibraryEntryFindUniqueArgs,
   LibraryEntryWhereInput,
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

   test("pGetLibraryEntriesPage - no query - test", async () => {
      const userId = "user-id-1";
      const libraryEntries = ptestData.pLibraryEntriesWithTemplateDescriptor();
      const totalEntries = 15;
      prismaMock.libraryEntry.findMany.mockResolvedValue(libraryEntries);
      prismaMock.libraryEntry.count.mockResolvedValue(totalEntries);

      const result = await libraryRepository.pGetLibraryEntriesPage(userId);

      const expectedResult: DLibraryEntriesPage = {
         content: toDLibraryEntries(libraryEntries),
         pageNumber: 0,
         pageSize: 20,
         numberOfElements: libraryEntries.length,
         totalPages: Math.ceil(totalEntries / 20),
         totalElements: totalEntries,
      };

      const expectedFindManyArgs: LibraryEntryFindManyArgs = {
         where: { userId },
         include: {
            templateDescriptor: {
               include: {
                  categories: true,
               },
            },
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
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
         include: {
            templateDescriptor: {
               include: {
                  categories: true,
               },
            },
         },
         orderBy: { createdAt: "asc" },
         skip: 20,
         take: 10,
      };

      const expectedCountArgs: LibraryEntryCountArgs = {
         where: { userId },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.libraryEntry.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.libraryEntry.count).toHaveBeenCalledWith(
         expectedCountArgs
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
         include: {
            templateDescriptor: {
               include: {
                  categories: true,
               },
            },
         },
         orderBy: { templateDescriptor: { title: "asc" } },
         skip: 0,
         take: 10,
      };

      const expectedCountArgs: LibraryEntryFindManyArgs = {
         where: { userId },
      };

      expect(prismaMock.libraryEntry.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.libraryEntry.count).toHaveBeenCalledWith(
         expectedCountArgs
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
         include: {
            templateDescriptor: {
               include: {
                  categories: true,
               },
            },
         },
         orderBy: { templateDescriptor: { title: "desc" } },
         skip: 0,
         take: 10,
      };

      const expectedCountArgs: LibraryEntryFindManyArgs = {
         where: { userId },
      };

      expect(prismaMock.libraryEntry.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.libraryEntry.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });
});

describe("pGetLibraryEntriesPage - resolveWhereInput tests", () => {
   const userId = "user-id-1";

   beforeEach(() => {
      jest.clearAllMocks();

      const libraryEntries = ptestData.pLibraryEntriesWithTemplateDescriptor();
      prismaMock.libraryEntry.findMany.mockResolvedValue(libraryEntries);
      prismaMock.libraryEntry.count.mockResolvedValue(0);
   });

   test("resolveWhereInput - no filter - test", async () => {
      await libraryRepository.pGetLibraryEntriesPage(userId);

      const expectedWhere: LibraryEntryWhereInput = { userId };

      const expectedFindManyArgs: LibraryEntryFindManyArgs = {
         where: expectedWhere,
         include: {
            templateDescriptor: {
               include: {
                  categories: true,
               },
            },
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: LibraryEntryFindManyArgs = {
         where: expectedWhere,
      };

      expect(prismaMock.libraryEntry.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.libraryEntry.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });

   test("resolveWhereInput - search - test", async () => {
      const query: DLibraryEntriesPageQuery = {
         filter: {
            search: "test search",
         },
      };
      await libraryRepository.pGetLibraryEntriesPage(userId, query);

      const expectedWhere: LibraryEntryWhereInput = {
         userId,
         templateDescriptor: {
            OR: [
               {
                  title: {
                     contains: "test search",
                     mode: "insensitive",
                  },
               },
               {
                  description: {
                     contains: "test search",
                     mode: "insensitive",
                  },
               },
            ],
         },
      };

      const expectedFindManyArgs: LibraryEntryFindManyArgs = {
         where: expectedWhere,
         include: {
            templateDescriptor: {
               include: {
                  categories: true,
               },
            },
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: LibraryEntryFindManyArgs = {
         where: expectedWhere,
      };

      expect(prismaMock.libraryEntry.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.libraryEntry.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });

   test("resolveWhereInput - categories - test", async () => {
      const query: DLibraryEntriesPageQuery = {
         filter: {
            categories: ["cat1", "cat2"],
         },
      };
      await libraryRepository.pGetLibraryEntriesPage(userId, query);

      const expectedWhere: LibraryEntryWhereInput = {
         userId,
         templateDescriptor: {
            categories: { some: { name: { in: ["cat1", "cat2"] } } },
         },
      };

      const expectedFindManyArgs: LibraryEntryFindManyArgs = {
         where: expectedWhere,
         include: {
            templateDescriptor: {
               include: {
                  categories: true,
               },
            },
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: LibraryEntryFindManyArgs = {
         where: expectedWhere,
      };

      expect(prismaMock.libraryEntry.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.libraryEntry.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });

   test("resolveWhereInput - models - test", async () => {
      const query: DLibraryEntriesPageQuery = {
         filter: {
            models: ["gpt-4", "claude"],
         },
      };
      await libraryRepository.pGetLibraryEntriesPage(userId, query);

      const expectedWhere: LibraryEntryWhereInput = {
         userId,
         templateDescriptor: {
            recommendedModel: { in: ["gpt-4", "claude"] },
         },
      };

      const expectedFindManyArgs: LibraryEntryFindManyArgs = {
         where: expectedWhere,
         include: {
            templateDescriptor: {
               include: {
                  categories: true,
               },
            },
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: LibraryEntryFindManyArgs = {
         where: expectedWhere,
      };

      expect(prismaMock.libraryEntry.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.libraryEntry.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });

   test("resolveWhereInput - isFavorite true - test", async () => {
      const query: DLibraryEntriesPageQuery = {
         filter: {
            isFavorite: true,
         },
      };
      await libraryRepository.pGetLibraryEntriesPage(userId, query);

      const expectedWhere: LibraryEntryWhereInput = {
         userId,
         isFavorite: true,
      };

      const expectedFindManyArgs: LibraryEntryFindManyArgs = {
         where: expectedWhere,
         include: {
            templateDescriptor: {
               include: {
                  categories: true,
               },
            },
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: LibraryEntryFindManyArgs = {
         where: expectedWhere,
      };

      expect(prismaMock.libraryEntry.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.libraryEntry.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });

   test("resolveWhereInput - isFavorite false - test", async () => {
      const query: DLibraryEntriesPageQuery = {
         filter: {
            isFavorite: false,
         },
      };
      await libraryRepository.pGetLibraryEntriesPage(userId, query);

      const expectedWhere: LibraryEntryWhereInput = {
         userId,
         isFavorite: false,
      };

      const expectedFindManyArgs: LibraryEntryFindManyArgs = {
         where: expectedWhere,
         include: {
            templateDescriptor: {
               include: {
                  categories: true,
               },
            },
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: LibraryEntryFindManyArgs = {
         where: expectedWhere,
      };

      expect(prismaMock.libraryEntry.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.libraryEntry.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });

   test("resolveWhereInput - collectionIds - test", async () => {
      const query: DLibraryEntriesPageQuery = {
         filter: {
            collectionIds: ["col-1", "col-2"],
         },
      };
      await libraryRepository.pGetLibraryEntriesPage(userId, query);

      const expectedWhere: LibraryEntryWhereInput = {
         userId,
         collectionEntries: {
            some: { collectionId: { in: ["col-1", "col-2"] } },
         },
      };

      const expectedFindManyArgs: LibraryEntryFindManyArgs = {
         where: expectedWhere,
         include: {
            templateDescriptor: {
               include: {
                  categories: true,
               },
            },
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: LibraryEntryFindManyArgs = {
         where: expectedWhere,
      };

      expect(prismaMock.libraryEntry.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.libraryEntry.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });

   test("resolveWhereInput - empty arrays - test", async () => {
      const query: DLibraryEntriesPageQuery = {
         filter: {
            categories: [],
            models: [],
            collectionIds: [],
         },
      };
      await libraryRepository.pGetLibraryEntriesPage(userId, query);

      const expectedWhere: LibraryEntryWhereInput = {
         userId,
      };

      const expectedFindManyArgs: LibraryEntryFindManyArgs = {
         where: expectedWhere,
         include: {
            templateDescriptor: {
               include: {
                  categories: true,
               },
            },
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: LibraryEntryFindManyArgs = {
         where: expectedWhere,
      };

      expect(prismaMock.libraryEntry.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.libraryEntry.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });

   test("resolveWhereInput - full filter - test", async () => {
      const filter = dtestData.dLibraryEntriesFilter();
      const query: DLibraryEntriesPageQuery = {
         filter,
      };
      await libraryRepository.pGetLibraryEntriesPage(userId, query);

      const expectedWhere: LibraryEntryWhereInput = {
         userId,
         templateDescriptor: {
            OR: [
               {
                  title: {
                     contains: filter.search,
                     mode: "insensitive",
                  },
               },
               {
                  description: {
                     contains: filter.search,
                     mode: "insensitive",
                  },
               },
            ],
            categories: {
               some: { name: { in: filter.categories } },
            },
            recommendedModel: { in: filter.models },
         },
         isFavorite: filter.isFavorite,
         collectionEntries: {
            some: { collectionId: { in: filter.collectionIds } },
         },
      };

      const expectedFindManyArgs: LibraryEntryFindManyArgs = {
         where: expectedWhere,
         include: {
            templateDescriptor: {
               include: {
                  categories: true,
               },
            },
         },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: LibraryEntryFindManyArgs = {
         where: expectedWhere,
      };

      expect(prismaMock.libraryEntry.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.libraryEntry.count).toHaveBeenCalledWith(
         expectedCountArgs
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

describe("pDeleteLibraryEntry tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("pDeleteLibraryEntry - entry deleted - test", async () => {
      const userId = "user-id-1";
      const entryId = "entry-id-1";

      await libraryRepository.pDeleteLibraryEntry(userId, entryId);

      const expectedArgs: LibraryEntryDeleteArgs = {
         where: { id: entryId, userId },
      };

      expect(prismaMock.libraryEntry.delete).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryEntry.delete).toHaveBeenCalledWith(expectedArgs);
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
