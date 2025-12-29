import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { map } from "es-toolkit/compat";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/db/prisma";
import {
   LibraryEntryCreateManyArgs,
   LibraryEntryFindManyArgs,
} from "@/generated/prisma/models";

import { pCreateLibraryEntries, pGetLibraryEntries } from "./library";

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe("pGetLibraryEntries tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetLibraryEntries test", async () => {
      const userId = "user-id-1";
      const libraryEntries = ptestData.pLibraryEntriesWithTemplate();
      prismaMock.libraryEntry.findMany.mockResolvedValue(libraryEntries);

      const result = await pGetLibraryEntries(userId);

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

      await pCreateLibraryEntries(orderId, userId, productId, templateIds);

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
