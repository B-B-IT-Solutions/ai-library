jest.mock("@/data/repositories/product");

import { ptestData } from "@tests";

import { ProductRepository } from "@/data/repositories/product";
import {
   ProductWhereInput,
   ProductWhereUniqueInput,
} from "@/generated/prisma/models";

import {
   getProduct,
   getProducts,
   getProductsForSitemap,
} from "./product.actions";
import { toDProductsWithItems, toDProductWithDetails } from "./product.mapper";

const pGetProducts = ProductRepository.prototype.pGetProducts;
const pGetProduct = ProductRepository.prototype.pGetProduct;
const pGetProductsSitemapData =
   ProductRepository.prototype.pGetProductsSitemapData;

const pGetProductsMock = pGetProducts as jest.MockedFunction<
   typeof pGetProducts
>;
const pGetProductMock = pGetProduct as jest.MockedFunction<typeof pGetProduct>;
const pGetProductsSitemapDataMock =
   pGetProductsSitemapData as jest.MockedFunction<
      typeof pGetProductsSitemapData
   >;

describe("getProducts tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getProducts test", async () => {
      const products = ptestData.pProductsWithItems();
      pGetProductsMock.mockResolvedValue(products);

      const result = await getProducts();

      const expectedResult = toDProductsWithItems(products);
      const expectedWhereInput: ProductWhereInput = { status: "ACTIVE" };

      expect(result).toEqual(expectedResult);
      expect(pGetProductsMock).toHaveBeenCalledTimes(1);
      expect(pGetProductsMock).toHaveBeenCalledWith(expectedWhereInput);
   });
});

describe("getProduct tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getProduct - productId invalid - test", async () => {
      pGetProductMock.mockResolvedValue(null);
      const productId = "product-id-1";

      const result = await getProduct(productId);

      expect(result).toBeNull();
      expect(pGetProductMock).not.toHaveBeenCalled();
   });

   it("getProduct - product null - test", async () => {
      pGetProductMock.mockResolvedValue(null);
      const productId = "2ba1922c-2494-4e50-a8a4-c55912cf8f0c";

      const result = await getProduct(productId);

      const expectedWhereInput: ProductWhereUniqueInput = { id: productId };

      expect(result).toBeNull();
      expect(pGetProductMock).toHaveBeenCalledTimes(1);
      expect(pGetProductMock).toHaveBeenCalledWith(expectedWhereInput);
   });

   it("getProduct - product defined - test", async () => {
      const product = ptestData.pProductWithDetails();
      product.id = "e25c7300-a608-42a5-ab67-cae7a8f75bfa";
      pGetProductMock.mockResolvedValue(product);

      const result = await getProduct(product.id);

      const expectedResult = toDProductWithDetails(product);
      const expectedWhereInput: ProductWhereUniqueInput = { id: product.id };

      expect(result).toEqual(expectedResult);
      expect(pGetProductMock).toHaveBeenCalledTimes(1);
      expect(pGetProductMock).toHaveBeenCalledWith(expectedWhereInput);
   });
});

describe("getProductsForSitemap tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("repository error - returns empty array - test", async () => {
      pGetProductsSitemapDataMock.mockRejectedValue(new Error("DB error"));

      const result = await getProductsForSitemap();

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("success - test", async () => {
      const data = [
         { id: "product-id-1", updatedAt: "2025-09-27T00:00:00.000Z" },
      ];
      pGetProductsSitemapDataMock.mockResolvedValue(data);

      const result = await getProductsForSitemap();

      expect(result).toEqual(data);
      expect(pGetProductsSitemapDataMock).toHaveBeenCalledTimes(1);
   });
});
