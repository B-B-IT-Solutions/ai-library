import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import {
   ProductFindManyArgs,
   ProductFindUniqueArgs,
   ProductWhereInput,
   ProductWhereUniqueInput,
} from "@/generated/prisma/models";

import { ProductRepository } from "./product.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const productRepository = new ProductRepository(prismaMock);

describe("pGetProducts tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetProducts test", async () => {
      const products = ptestData.pProductsWithItems();
      prismaMock.product.findMany.mockResolvedValue(products);

      const where: ProductWhereInput = { status: "ACTIVE" };

      const result = await productRepository.pGetProducts(where);

      const expectedFindManyArgs: ProductFindManyArgs = {
         where,
         include: {
            productItems: {
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
         expectedFindManyArgs
      );
   });
});

describe("pGetProduct tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetProduct test", async () => {
      const product = ptestData.pProductWithDetails();
      prismaMock.product.findUnique.mockResolvedValue(product);

      const where: ProductWhereUniqueInput = { id: "product-id-1" };

      const result = await productRepository.pGetProduct(where);

      const expectedFindUniqueArgs: ProductFindUniqueArgs = {
         where,
         include: {
            productItems: {
               include: {
                  template: {
                     include: {
                        categories: true,
                     },
                  },
               },
            },
            features: {
               orderBy: {
                  order: "asc",
               },
            },
            useCases: {
               orderBy: {
                  order: "asc",
               },
            },
            examples: {
               orderBy: {
                  order: "asc",
               },
            },
            instructions: {
               orderBy: {
                  step: "asc",
               },
            },
         },
      };

      expect(result).toEqual(product);
      expect(prismaMock.product.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.product.findUnique).toHaveBeenCalledWith(
         expectedFindUniqueArgs
      );
   });
});
