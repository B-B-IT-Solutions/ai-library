jest.mock("@/data/repositories/collection");

import { dtestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import { PublicCollectionRepository } from "@/data/repositories/collection";
import prisma from "@/data/repositories/prisma";

import { PublicCollectionService } from "./collection.public.service";

const collectionRepo = new PublicCollectionRepository(prisma);
const collectionRepoMock =
   collectionRepo as DeepMockProxy<PublicCollectionRepository>;

const collectionService = new PublicCollectionService(collectionRepoMock);

describe("getCollectionByPublicToken tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("collection retrieved - test", async () => {
      const token = "token-1";
      const collection = dtestData.dCollection();
      collectionRepoMock.pGetCollectionByPublicToken.mockResolvedValue(
         collection
      );

      const result = await collectionService.getCollectionByPublicToken(token);

      expect(result).toEqual(collection);
      expect(
         collectionRepoMock.pGetCollectionByPublicToken
      ).toHaveBeenCalledTimes(1);
      expect(
         collectionRepoMock.pGetCollectionByPublicToken
      ).toHaveBeenCalledWith(token);
   });
});
