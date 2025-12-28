jest.mock("@/data/db/queries/product");

import { ptestData } from "@tests";

import { pGetProduct, pGetProducts } from "@/data/db/queries/product";
import {
   ProductWhereInput,
   ProductWhereUniqueInput,
} from "@/generated/prisma/models";

import { getProduct, getProducts } from "./product.actions";
import { toDProductsWithItems, toDProductWithDetails } from "./product.mapper";

const pGetProductsMock = pGetProducts as jest.MockedFunction<
   typeof pGetProducts
>;

const pGetProductMock = pGetProduct as jest.MockedFunction<typeof pGetProduct>;

describe("getProducts tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
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
      jest.resetAllMocks();
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
