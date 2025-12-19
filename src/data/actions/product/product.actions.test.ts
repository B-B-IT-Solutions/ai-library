jest.mock("@/data/db/queries/product");

import { ptestData } from "@tests";

import { pGetProducts } from "@/data/db/queries/product";
import { ProductWhereInput } from "@/generated/prisma/models";

import { getProducts } from "./product.actions";
import { toDProducts } from "./product.mapper";

const pGetProductsMock = pGetProducts as jest.MockedFunction<
   typeof pGetProducts
>;

describe("getProducts tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("getProducts test", async () => {
      const products = ptestData.pProductsWithTemplateBundleItems();
      pGetProductsMock.mockResolvedValue(products);

      const result = await getProducts();

      const expectedResult = toDProducts(products);
      const expectedWhereInput: ProductWhereInput = { status: "ACTIVE" };

      expect(result).toEqual(expectedResult);
      expect(pGetProductsMock).toHaveBeenCalledTimes(1);
      expect(pGetProductsMock).toHaveBeenCalledWith(expectedWhereInput);
   });
});
