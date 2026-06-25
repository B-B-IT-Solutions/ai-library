import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { ProductFindManyArgs } from "@/generated/prisma/models";

import { toDProductsSitemapData } from "./product.mapper";
import { PublicProductRepository } from "./product.public.repository";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const productRepository = new PublicProductRepository(prismaMock);

describe("pGetProductsSitemapData tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   it("products retrieved - test", async () => {
      const data = ptestData.pProductsSitemapData();
      prismaMock.product.findMany.mockResolvedValue(data);

      const result = await productRepository.pGetProductsSitemapData();

      const expectedResult = toDProductsSitemapData(data);

      const expectedFindManyArgs: ProductFindManyArgs = {
         where: { status: "ACTIVE" },
         select: { id: true, updatedAt: true },
         orderBy: { createdAt: "asc" },
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.product.findMany).toHaveBeenCalledTimes(1);
      expect(prismaMock.product.findMany).toHaveBeenCalledWith(
         expectedFindManyArgs
      );
   });
});
