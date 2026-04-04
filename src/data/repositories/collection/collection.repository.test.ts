import { PrismaClient } from "@prisma/client";
import { dtestData, ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { DCollectionUpdate } from "@/data/types/domain/collection";
import {
   LibraryCollectionCreateArgs,
   LibraryCollectionCreateInput,
   LibraryCollectionDeleteArgs,
   LibraryCollectionEntryDeleteManyArgs,
   LibraryCollectionEntryUpsertArgs,
   LibraryCollectionFindManyArgs,
   LibraryCollectionFindUniqueArgs,
   LibraryCollectionUpdateArgs,
   LibraryCollectionUpdateInput,
} from "@/generated/prisma/models";

import { toDCollection, toDCollections } from "./collection.mapper";
import { CollectionRepository } from "./collection.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const collectionRepository = new CollectionRepository(prismaMock);

describe("pGetCollections tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("colelctions retrieved test", async () => {
      const userId = "user-id-1";
      const collections = ptestData.pLibraryCollections();
      prismaMock.libraryCollection.findMany.mockResolvedValue(collections);

      const result = await collectionRepository.pGetCollections(userId);

      const expectedResult = toDCollections(collections);

      const expectedFindManyArgs: LibraryCollectionFindManyArgs = {
         where: { userId },
         orderBy: {
            order: "asc",
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

describe("pGetCollectionByShareToken tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("collection - null - test", async () => {
      const token = "non-existent-token";
      prismaMock.libraryCollection.findUnique.mockResolvedValue(null);

      const result =
         await collectionRepository.pGetCollectionByShareToken(token);

      const expectedArgs: LibraryCollectionFindUniqueArgs = {
         where: {
            shareToken: token,
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
      const token = "token-1";
      const collection = ptestData.pLibraryCollection();
      prismaMock.libraryCollection.findUnique.mockResolvedValue(collection);

      const result =
         await collectionRepository.pGetCollectionByShareToken(token);

      const expectedResult = toDCollection(collection);

      const expectedArgs: LibraryCollectionFindUniqueArgs = {
         where: {
            shareToken: token,
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

describe("pCreateCollection tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("all fields defined - test", async () => {
      const collection = ptestData.pLibraryCollection();
      prismaMock.libraryCollection.create.mockResolvedValue(collection);

      const userId = collection.userId;
      const data = dtestData.dLibraryCollectionUpdate();

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

      const data = dtestData.dLibraryCollectionUpdate();

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

describe("pSetShareToken tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("token set - test", async () => {
      const userId = "user-id-1";
      const token = "token-1";
      const isPublic = true;
      const collection = ptestData.pLibraryCollection();
      prismaMock.libraryCollection.update.mockResolvedValue(collection);

      const result = await collectionRepository.pSetShareToken(
         userId,
         collection.id,
         token,
         isPublic
      );

      const expectedResult = toDCollection(collection);

      const expectedUpdateInput: LibraryCollectionUpdateInput = {
         shareToken: token,
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

describe("pAddTemplateToCollection tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("template added to collection - test", async () => {
      const userId = "user-id-1";
      const templateDescriptorId = "descriptor-id";
      const collectionId = "collection-id";

      await collectionRepository.pAddTemplateToCollection(
         userId,
         collectionId,
         templateDescriptorId
      );

      const expectedArgs: LibraryCollectionEntryUpsertArgs = {
         where: {
            collection: {
               userId,
            },
            collectionId_templateDescriptorId: {
               collectionId,
               templateDescriptorId,
            },
         },
         create: {
            collectionId,
            templateDescriptorId,
         },
         update: {},
      };

      expect(prismaMock.libraryCollectionEntry.upsert).toHaveBeenCalledTimes(1);
      expect(prismaMock.libraryCollectionEntry.upsert).toHaveBeenCalledWith(
         expectedArgs
      );
   });
});

describe("pRemoveTemplateFromCollection tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("template removed from collection - test", async () => {
      const userId = "user-id-1";
      const templateDescriptorId = "descriptor-id";
      const collectionId = "collection-id";

      await collectionRepository.pRemoveTemplateFromCollection(
         userId,
         collectionId,
         templateDescriptorId
      );

      const expectedArgs: LibraryCollectionEntryDeleteManyArgs = {
         where: {
            collection: {
               userId,
            },
            collectionId,
            templateDescriptorId,
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
