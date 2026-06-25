jest.mock("@/data/repositories/product");

import { DeepMockProxy } from "jest-mock-extended";

import { ProductRepository } from "@/data/repositories/product";
import prisma from "@/data/repositories/prisma";

import { ProductPublicService } from "./product.public.service";

const productRepo = new ProductRepository(prisma);
const productRepoMock = productRepo as DeepMockProxy<ProductRepository>;

const productService = new ProductPublicService(productRepoMock);

describe("getProductsSitemapData tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("products retrieved - test", async () => {
      const data = [
         {
            id: "product-id-1",
            updatedAt: new Date("2025-09-27").toISOString(),
         },
         {
            id: "product-id-2",
            updatedAt: new Date("2025-09-27").toISOString(),
         },
      ];
      productRepoMock.pGetProductsSitemapData.mockResolvedValue(data);

      const result = await productService.getProductsSitemapData();

      expect(result).toEqual(data);
      expect(productRepoMock.pGetProductsSitemapData).toHaveBeenCalledTimes(1);
   });

   it("no products - returns empty array - test", async () => {
      productRepoMock.pGetProductsSitemapData.mockResolvedValue([]);

      const result = await productService.getProductsSitemapData();

      expect(result).toEqual([]);
      expect(productRepoMock.pGetProductsSitemapData).toHaveBeenCalledTimes(1);
   });
});
