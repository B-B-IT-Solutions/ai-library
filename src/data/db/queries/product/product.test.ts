import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/db/prisma";
import { Prisma } from "@/generated/prisma/client";
import { ProductWhereInput } from "@/generated/prisma/models";

import { pGetProducts } from "./product";

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe("pGetProducts tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetProducts test", async () => {
      const products = ptestData.pProductWithTemplateBundleItems();
      prismaMock.product.findMany.mockResolvedValue(products);

      const where: ProductWhereInput = { status: "ACTIVE" };

      const result = await pGetProducts(where);

      const expectedFindMayArgs: Prisma.ProductFindManyArgs = {
         where,
         include: {
            template: {
               include: {
                  categories: true,
               },
            },
            bundleItems: {
               include: {
                  template: {
                     include: {
                        categories: true,
                     },
                  },
               },
            },
         },
         orderBy: {
            createdAt: "desc",
         },
      };

      expect(result).toEqual(products);
      expect(prismaMock.product.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.product.findMany).toHaveBeenCalledWith(
         expectedFindMayArgs
      );
   });
});
