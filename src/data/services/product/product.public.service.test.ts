jest.mock("@/data/repositories/product");

import { dtestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";

import prisma from "@/data/repositories/prisma";
import { ProductRepository } from "@/data/repositories/product";

import { ProductPublicService } from "./product.public.service";

const productRepo = new ProductRepository(prisma);
const productRepoMock = productRepo as DeepMockProxy<ProductRepository>;

const productService = new ProductPublicService(productRepoMock);

describe("getProductsSitemapData tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("products retrieved - test", async () => {
      const data = dtestData.dProductsSitemapData();
      productRepoMock.pGetProductsSitemapData.mockResolvedValue(data);

      const result = await productService.getProductsSitemapData();

      expect(result).toEqual(data);
      expect(productRepoMock.pGetProductsSitemapData).toHaveBeenCalledTimes(1);
   });
});
