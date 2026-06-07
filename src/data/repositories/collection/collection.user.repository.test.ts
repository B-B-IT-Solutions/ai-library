import { PrismaClient } from "@prisma/client";
import { dtestData, ptestData } from "@tests";
import { map } from "es-toolkit/compat";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { DCollectionUpdate } from "@/data/types/domain/collection";
import {
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
} from "@/generated/prisma/models";

import { toDCollection, toDCollections } from "./collection.mapper";
import { CollectionRepository } from "./collection.user.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const collectionRepository = new CollectionRepository(prismaMock);

describe("pGetCollections tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("colelctions retrieved test", async () => {
      const userId = "user-id-1";
      const collections = ptestData.pTemplateCollections();
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

      const collection = ptestData.pTemplateCollection();
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

describe("pCreateCollection tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("all fields defined - test", async () => {
      const collection = ptestData.pTemplateCollection();
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
      const collection = ptestData.pTemplateCollection();
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
      const collection = ptestData.pTemplateCollection();
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
      const collection = ptestData.pTemplateCollection();
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
      const collection = ptestData.pTemplateCollection();
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
      const collection = ptestData.pTemplateCollection();
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

      const entries = ptestData.pTemplateCollectionEntries();
      prismaMock.libraryCollectionEntry.findMany.mockResolvedValue(entries);

      const result = await collectionRepository.pGetCollectionPromptIds(
         userId,
         collectionId
      );

      const expectedResult = map(entries, (e) => e.templateDescriptorId);

      const expectedArgs: LibraryCollectionEntryFindManyArgs = {
         where: {
            collectionId,
            collection: {
               userId,
            },
         },
         select: {
            templateDescriptorId: true,
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

describe("pGetTemplateCollectionIds tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("no entries - returns empty array - test", async () => {
      const userId = "user-id-1";
      const descriptorId = "descriptor-id-1";

      prismaMock.libraryCollectionEntry.findMany.mockResolvedValue([]);

      const result = await collectionRepository.pGetTemplateCollectionIds(
         userId,
         descriptorId
      );

      const expectedArgs: LibraryCollectionEntryFindManyArgs = {
         where: {
            userId,
            templateDescriptorId: descriptorId,
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
      const descriptorId = "descriptor-id-1";

      const entries = ptestData.pTemplateCollectionEntries();
      prismaMock.libraryCollectionEntry.findMany.mockResolvedValue(entries);

      const result = await collectionRepository.pGetTemplateCollectionIds(
         userId,
         descriptorId
      );

      const expectedResult = map(entries, (e) => e.collectionId);

      const expectedArgs: LibraryCollectionEntryFindManyArgs = {
         where: {
            userId,
            templateDescriptorId: descriptorId,
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

describe("pUpdateTemplateCollections tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("empty collectionIds - only deletes - test", async () => {
      const userId = "user-id-1";
      const descriptorId = "descriptor-id-1";

      await collectionRepository.pUpdateTemplateCollections(
         userId,
         descriptorId,
         []
      );

      const expectedDeleteArgs: LibraryCollectionEntryDeleteManyArgs = {
         where: {
            userId,
            templateDescriptorId: descriptorId,
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
      const descriptorId = "descriptor-id-1";
      const collectionIds = ["collection-id-1", "collection-id-2"];

      await collectionRepository.pUpdateTemplateCollections(
         userId,
         descriptorId,
         collectionIds
      );

      const expectedDeleteArgs: LibraryCollectionEntryDeleteManyArgs = {
         where: {
            userId,
            templateDescriptorId: descriptorId,
         },
      };

      const expectedCreateInputs: LibraryCollectionEntryCreateManyInput[] = [
         {
            userId,
            templateDescriptorId: descriptorId,
            collectionId: "collection-id-1",
         },
         {
            userId,
            templateDescriptorId: descriptorId,
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
