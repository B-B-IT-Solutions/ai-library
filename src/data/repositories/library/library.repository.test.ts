import { PrismaClient } from "@prisma/client";
import { dtestData, ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { DLibraryCollectionUpdate } from "@/data/types/domain/library";
import {
   LibraryCollectionCreateArgs,
   LibraryCollectionCreateInput,
   LibraryCollectionUpdateArgs,
   LibraryCollectionUpdateInput,
} from "@/generated/prisma/models";

import { toDLibraryCollection } from "./library.mapper";
import { LibraryRepository } from "./library.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const libraryRepository = new LibraryRepository(prismaMock);

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

      const expectedResult = toDLibraryCollection(collection);

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

      const expectedResult = toDLibraryCollection(collection);

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

      const expectedResult = toDLibraryCollection(collection);

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

      const expectedResult = toDLibraryCollection(collection);

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
