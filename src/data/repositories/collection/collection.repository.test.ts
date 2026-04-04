import { PrismaClient } from "@prisma/client";
import { dtestData, ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { DLibraryCollectionUpdate } from "@/data/types/domain/collection";
import {
   LibraryCollectionCreateArgs,
   LibraryCollectionCreateInput,
   LibraryCollectionDeleteArgs,
   LibraryCollectionFindManyArgs,
   LibraryCollectionUpdateArgs,
   LibraryCollectionUpdateInput,
} from "@/generated/prisma/models";

import { toDCollection, toDCollections } from "./collection.mapper";
import { CollectionRepository } from "./collection.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const libraryRepository = new CollectionRepository(prismaMock);

describe("pGetCollections tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("colelctions retrieved test", async () => {
      const userId = "user-id-1";
      const collections = ptestData.pLibraryCollections();
      prismaMock.libraryCollection.findMany.mockResolvedValue(collections);

      const result = await libraryRepository.pGetCollections(userId);

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

describe("pCreateCollection tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("all fields defined - test", async () => {
      const collection = ptestData.pLibraryCollection();
      prismaMock.libraryCollection.create.mockResolvedValue(collection);

      const userId = collection.userId;
      const data = dtestData.dLibraryCollectionUpdate();

      const result = await libraryRepository.pCreateCollection(userId, data);

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
      const data: DLibraryCollectionUpdate = {
         name: "My Collection",
      };

      const result = await libraryRepository.pCreateCollection(userId, data);

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

      const result = await libraryRepository.pUpdateCollection(
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

      const data: DLibraryCollectionUpdate = {
         name: "My Collection",
      };

      const result = await libraryRepository.pUpdateCollection(
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

      await libraryRepository.pDeleteCollection(userId, collection.id);

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
