import { PrismaClient } from "@prisma/client";
import { dtestData, ptestData } from "@tests";
import { map } from "es-toolkit/compat";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import {
   DCollectionsPage,
   DCollectionUpdate,
} from "@/data/types/domain/collection";
import {
   LibraryCollectionCountArgs,
   LibraryCollectionCreateArgs,
   LibraryCollectionCreateInput,
   LibraryCollectionDeleteArgs,
   LibraryCollectionEntryCreateManyArgs,
   LibraryCollectionEntryCreateManyInput,
   LibraryCollectionEntryDeleteManyArgs,
   LibraryCollectionEntryFindManyArgs,
   LibraryCollectionEntryUpsertArgs,
   LibraryCollectionFindManyArgs,
   LibraryCollectionFindUniqueArgs,
   LibraryCollectionUpdateArgs,
   LibraryCollectionUpdateInput,
   LibraryCollectionWhereInput,
} from "@/generated/prisma/models";

import {
   toDCollection,
   toDCollectionPreivew,
   toDCollectionPreviews,
   toDCollections,
} from "./collection.mapper";
import { CollectionRepository } from "./collection.user.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const collectionRepository = new CollectionRepository(prismaMock);

describe("pGetCollectionsPage tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("query undefined- test", async () => {
      const userId = "user-id-1";
      const collections = ptestData.pLibraryCollections();
      const totalEntries = 15;
      prismaMock.libraryCollection.findMany.mockResolvedValue(collections);
      prismaMock.libraryCollection.count.mockResolvedValue(totalEntries);

      const result = await collectionRepository.pGetCollectionsPage(userId);

      const expectedResult: DCollectionsPage = {
         content: toDCollections(collections),
         pageNumber: 0,
         pageSize: 20,
         numberOfElements: collections.length,
         totalPages: Math.ceil(totalEntries / 20),
         totalElements: totalEntries,
      };

      const expectedFindManyArgs: LibraryCollectionFindManyArgs = {
         where: { userId },
         include: { _count: { select: { entries: true } } },
         orderBy: { createdAt: "desc" },
         skip: 0,
         take: 20,
      };

      const expectedCountArgs: LibraryCollectionCountArgs = {
         where: { userId },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.libraryCollection.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryCollection.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.libraryCollection.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryCollection.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });

   it("query defined - test", async () => {
      const userId = "user-id-1";
      const collections = ptestData.pLibraryCollections();
      const totalEntries = 40;
      prismaMock.libraryCollection.findMany.mockResolvedValue(collections);
      prismaMock.libraryCollection.count.mockResolvedValue(totalEntries);

      const query = dtestData.dCollectionsPageQuery();

      const result = await collectionRepository.pGetCollectionsPage(
         userId,
         query
      );

      const expectedResult: DCollectionsPage = {
         content: toDCollections(collections),
         pageNumber: 1,
         pageSize: 10,
         numberOfElements: collections.length,
         totalPages: Math.ceil(totalEntries / 10),
         totalElements: totalEntries,
      };

      const expectedWhere: LibraryCollectionWhereInput = {
         userId,
         OR: [
            { name: { contains: "search 1", mode: "insensitive" } },
            { description: { contains: "search 1", mode: "insensitive" } },
         ],
      };

      const expectedFindManyArgs: LibraryCollectionFindManyArgs = {
         where: expectedWhere,
         include: { _count: { select: { entries: true } } },
         orderBy: { name: "asc" },
         skip: 10,
         take: 10,
      };

      const expectedCountArgs: LibraryCollectionCountArgs = {
         where: expectedWhere,
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.libraryCollection.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryCollection.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
      expect(prismaMock.libraryCollection.count).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryCollection.count).toHaveBeenCalledWith(
         expectedCountArgs
      );
   });
});

describe("pGetCollectionPreviews tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("collections retrieved test", async () => {
      const userId = "user-id-1";
      const collections = ptestData.pLibraryCollectionPreviews();
      prismaMock.libraryCollection.findMany.mockResolvedValue(collections);

      const result = await collectionRepository.pGetCollectionPreviews(userId);

      const expectedResult = toDCollectionPreviews(collections);

      const expectedFindManyArgs: LibraryCollectionFindManyArgs = {
         where: { userId },
         orderBy: {
            order: "asc",
         },
         select: {
            id: true,
            name: true,
            color: true,
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.libraryCollection.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryCollection.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
   });
});

describe("pGetCollectionById tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("collection - null - test", async () => {
      const userId = "user-id-1";
      const collectionId = "non-existent-id";
      prismaMock.libraryCollection.findUnique.mockResolvedValue(null);

      const result = await collectionRepository.pGetCollectionById(
         userId,
         collectionId
      );

      const expectedArgs: LibraryCollectionFindUniqueArgs = {
         where: {
            id: collectionId,
            userId,
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
      const userId = "user-id-1";

      const collection = ptestData.pLibraryCollection();
      prismaMock.libraryCollection.findUnique.mockResolvedValue(collection);

      const result = await collectionRepository.pGetCollectionById(
         userId,
         collection.id
      );

      const expectedResult = toDCollection(collection);

      const expectedArgs: LibraryCollectionFindUniqueArgs = {
         where: {
            id: collection.id,
            userId,
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

describe("pGetCollectionPreviewById tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("collection - null - test", async () => {
      const userId = "user-id-1";
      const collectionId = "non-existent-id";
      prismaMock.libraryCollection.findUnique.mockResolvedValue(null);

      const result = await collectionRepository.pGetCollectionPreviewById(
         userId,
         collectionId
      );

      const expectedArgs: LibraryCollectionFindUniqueArgs = {
         where: {
            id: collectionId,
            userId,
         },
         select: {
            id: true,
            name: true,
            color: true,
         },
      };

      expect(result).toBeNull();
      expect(prismaMock.libraryCollection.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryCollection.findUnique).toHaveBeenCalledWith(
         expectedArgs
      );
   });

   it("collection - retrieved - test", async () => {
      const userId = "user-id-1";

      const collection = ptestData.pLibraryCollectionPreview();
      prismaMock.libraryCollection.findUnique.mockResolvedValue(collection);

      const result = await collectionRepository.pGetCollectionPreviewById(
         userId,
         collection.id
      );

      const expectedResult = toDCollectionPreivew(collection);

      const expectedArgs: LibraryCollectionFindUniqueArgs = {
         where: {
            id: collection.id,
            userId,
         },
         select: {
            id: true,
            name: true,
            color: true,
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.libraryCollection.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryCollection.findUnique).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

describe("pCreateCollection tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("all fields defined - test", async () => {
      const collection = ptestData.pLibraryCollection();
      prismaMock.libraryCollection.create.mockResolvedValue(collection);

      const userId = collection.userId;
      const data = dtestData.dCollectionUpdate();

      const result = await collectionRepository.pCreateCollection(userId, data);

      const expectedResult = toDCollection(collection);

      const expectedCreateInput: LibraryCollectionCreateInput = {
         user: {
            connect: {
               id: userId,
            },
         },
         name: data.name,
         description: data.description,
         color: data.color,
         order: data.order,
      };

      const expectedCreateArgs: LibraryCollectionCreateArgs = {
         data: expectedCreateInput,
         include: {
            _count: {
               select: {
                  entries: true,
               },
            },
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.libraryCollection.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryCollection.create).toHaveBeenCalledWith(
         expectedCreateArgs
      );
   });

   it("optional fields undefined - test", async () => {
      const collection = ptestData.pLibraryCollection();
      prismaMock.libraryCollection.create.mockResolvedValue(collection);

      const userId = "user-id-1";
      const data: DCollectionUpdate = {
         name: "My Collection",
      };

      const result = await collectionRepository.pCreateCollection(userId, data);

      const expectedResult = toDCollection(collection);

      const expectedCreateInput: LibraryCollectionCreateInput = {
         user: {
            connect: {
               id: userId,
            },
         },
         name: "My Collection",
         description: null,
         color: null,
         order: 0,
      };

      const expectedCreateArgs: LibraryCollectionCreateArgs = {
         data: expectedCreateInput,
         include: {
            _count: {
               select: {
                  entries: true,
               },
            },
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.libraryCollection.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryCollection.create).toHaveBeenCalledWith(
         expectedCreateArgs
      );
   });
});

describe("pUpdateCollection tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("all fields defined - test", async () => {
      const userId = "user-id-1";
      const collection = ptestData.pLibraryCollection();
      prismaMock.libraryCollection.update.mockResolvedValue(collection);

      const data = dtestData.dCollectionUpdate();

      const result = await collectionRepository.pUpdateCollection(
         userId,
         collection.id,
         data
      );

      const expectedResult = toDCollection(collection);

      const expectedUpdateInput: LibraryCollectionUpdateInput = {
         name: data.name,
         description: data.description,
         color: data.color,
         order: data.order,
      };

      const expectedUpdateArgs: LibraryCollectionUpdateArgs = {
         where: {
            id: collection.id,
            userId,
         },
         data: expectedUpdateInput,
         include: {
            _count: {
               select: {
                  entries: true,
               },
            },
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.libraryCollection.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryCollection.update).toHaveBeenCalledWith(
         expectedUpdateArgs
      );
   });

   it("optional fields undefined - test", async () => {
      const userId = "user-id-123";
      const collection = ptestData.pLibraryCollection();
      prismaMock.libraryCollection.update.mockResolvedValue(collection);

      const data: DCollectionUpdate = {
         name: "My Collection",
      };

      const result = await collectionRepository.pUpdateCollection(
         userId,
         collection.id,
         data
      );

      const expectedResult = toDCollection(collection);

      const expectedUpdateInput: LibraryCollectionUpdateInput = {
         name: data.name,
      };

      const expectedUpdateArgs: LibraryCollectionUpdateArgs = {
         where: {
            id: collection.id,
            userId,
         },
         data: expectedUpdateInput,
         include: {
            _count: {
               select: {
                  entries: true,
               },
            },
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.libraryCollection.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryCollection.update).toHaveBeenCalledWith(
         expectedUpdateArgs
      );
   });
});

describe("pDeleteCollection tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("collection - deleted - test", async () => {
      const userId = "user-id-1";
      const collection = ptestData.pLibraryCollection();
      prismaMock.libraryCollection.delete.mockResolvedValue(collection);

      await collectionRepository.pDeleteCollection(userId, collection.id);

      const expectedDeleteArgs: LibraryCollectionDeleteArgs = {
         where: {
            id: collection.id,
            userId,
         },
      };

      expect(prismaMock.libraryCollection.delete).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryCollection.delete).toHaveBeenCalledWith(
         expectedDeleteArgs
      );
   });
});

describe("pSetCollectionPublicToken tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("token set - test", async () => {
      const userId = "user-id-1";
      const publicToken = "token-1";
      const isPublic = true;
      const collection = ptestData.pLibraryCollection();
      prismaMock.libraryCollection.update.mockResolvedValue(collection);

      const result = await collectionRepository.pSetCollectionPublicToken(
         userId,
         collection.id,
         publicToken,
         isPublic
      );

      const expectedResult = toDCollection(collection);

      const expectedUpdateInput: LibraryCollectionUpdateInput = {
         publicToken,
         isPublic,
      };

      const expectedUpdateArgs: LibraryCollectionUpdateArgs = {
         where: {
            id: collection.id,
            userId,
         },
         data: expectedUpdateInput,
         include: {
            _count: {
               select: {
                  entries: true,
               },
            },
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.libraryCollection.update).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryCollection.update).toHaveBeenCalledWith(
         expectedUpdateArgs
      );
   });
});

describe("pGetCollectionPromptIds tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("promptIds retrieved - test", async () => {
      const userId = "user-id-1";
      const collectionId = "collection-id";

      const entries = ptestData.pLibraryCollectionEntries();
      prismaMock.libraryCollectionEntry.findMany.mockResolvedValue(entries);

      const result = await collectionRepository.pGetCollectionPromptIds(
         userId,
         collectionId
      );

      const expectedResult = map(entries, (e) => e.promptId);

      const expectedArgs: LibraryCollectionEntryFindManyArgs = {
         where: {
            collectionId,
            collection: {
               userId,
            },
         },
         select: {
            promptId: true,
         },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.libraryCollectionEntry.findMany).toHaveBeenCalledTimes(
         1
      );
      expect(prismaMock.libraryCollectionEntry.findMany).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

describe("pAddPromptToCollection tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("prompt added to collection - test", async () => {
      const userId = "user-id-1";
      const promptId = "prompt-id-1";
      const collectionId = "collection-id-1";

      await collectionRepository.pAddPromptToCollection(
         userId,
         collectionId,
         promptId
      );

      const expectedArgs: LibraryCollectionEntryUpsertArgs = {
         where: {
            collection: {
               userId,
            },
            collectionId_promptId: {
               collectionId,
               promptId,
            },
         },
         create: {
            collectionId,
            promptId,
            userId,
         },
         update: {},
      };

      expect(prismaMock.libraryCollectionEntry.upsert).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryCollectionEntry.upsert).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

describe("pRemovePromptFromCollection tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("prompt removed from collection - test", async () => {
      const userId = "user-id-1";
      const promptId = "prompt-id-1";
      const collectionId = "collection-id-1";

      await collectionRepository.pRemovePromptFromCollection(
         userId,
         collectionId,
         promptId
      );

      const expectedArgs: LibraryCollectionEntryDeleteManyArgs = {
         where: {
            collection: {
               userId,
            },
            collectionId,
            promptId,
         },
      };

      expect(
         prismaMock.libraryCollectionEntry.deleteMany
      ).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryCollectionEntry.deleteMany).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

describe("pGetPromptCollectionIds tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("no entries - returns empty array - test", async () => {
      const userId = "user-id-1";
      const promptId = "prompt-id-1";

      prismaMock.libraryCollectionEntry.findMany.mockResolvedValue([]);

      const result = await collectionRepository.pGetPromptCollectionIds(
         userId,
         promptId
      );

      const expectedArgs: LibraryCollectionEntryFindManyArgs = {
         where: {
            userId,
            promptId,
         },
         select: { collectionId: true },
      };

      expect(result).toEqual([]);
      expect(prismaMock.libraryCollectionEntry.findMany).toHaveBeenCalledTimes(
         1
      );
      expect(prismaMock.libraryCollectionEntry.findMany).toHaveBeenCalledWith(
         expectedArgs
      );
   });

   it("collectionIds retrieved - test", async () => {
      const userId = "user-id-1";
      const promptId = "prompt-id-1";

      const entries = ptestData.pLibraryCollectionEntries();
      prismaMock.libraryCollectionEntry.findMany.mockResolvedValue(entries);

      const result = await collectionRepository.pGetPromptCollectionIds(
         userId,
         promptId
      );

      const expectedResult = map(entries, (e) => e.collectionId);

      const expectedArgs: LibraryCollectionEntryFindManyArgs = {
         where: {
            userId,
            promptId,
         },
         select: { collectionId: true },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.libraryCollectionEntry.findMany).toHaveBeenCalledTimes(
         1
      );
      expect(prismaMock.libraryCollectionEntry.findMany).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

describe("pUpdatePromptCollections tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("empty collectionIds - only deletes - test", async () => {
      const userId = "user-id-1";
      const promptId = "prompt-id-1";

      await collectionRepository.pUpdatePromptCollections(userId, promptId, []);

      const expectedDeleteArgs: LibraryCollectionEntryDeleteManyArgs = {
         where: {
            userId,
            promptId,
         },
      };

      const expectedCreateArgs: LibraryCollectionEntryCreateManyArgs = {
         data: [],
      };

      expect(
         prismaMock.libraryCollectionEntry.deleteMany
      ).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryCollectionEntry.deleteMany).toHaveBeenCalledWith(
         expectedDeleteArgs
      );
      expect(
         prismaMock.libraryCollectionEntry.createMany
      ).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryCollectionEntry.createMany).toHaveBeenCalledWith(
         expectedCreateArgs
      );
   });

   it("collections updated - test", async () => {
      const userId = "user-id-1";
      const promptId = "prompt-id-1";
      const collectionIds = ["collection-id-1", "collection-id-2"];

      await collectionRepository.pUpdatePromptCollections(
         userId,
         promptId,
         collectionIds
      );

      const expectedDeleteArgs: LibraryCollectionEntryDeleteManyArgs = {
         where: {
            userId,
            promptId,
         },
      };

      const expectedCreateInputs: LibraryCollectionEntryCreateManyInput[] = [
         {
            userId,
            promptId,
            collectionId: "collection-id-1",
         },
         {
            userId,
            promptId,
            collectionId: "collection-id-2",
         },
      ];

      const expectedCreateArgs: LibraryCollectionEntryCreateManyArgs = {
         data: expectedCreateInputs,
      };

      expect(
         prismaMock.libraryCollectionEntry.deleteMany
      ).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryCollectionEntry.deleteMany).toHaveBeenCalledWith(
         expectedDeleteArgs
      );
      expect(
         prismaMock.libraryCollectionEntry.createMany
      ).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryCollectionEntry.createMany).toHaveBeenCalledWith(
         expectedCreateArgs
      );
   });
});
