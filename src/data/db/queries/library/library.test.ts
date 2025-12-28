import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/db/prisma";
import { LibraryEntryFindManyArgs } from "@/generated/prisma/models";

import { pGetLibraryEntries } from "./library";

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe("pGetLibraryEntries tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetLibraryEntries test", async () => {
      const userId = "order-id-1";
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
