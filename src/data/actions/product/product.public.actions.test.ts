jest.mock("@/data/services/product");

import { dtestData } from "@tests";

import { PublicProductService } from "@/data/services/product";

import { getProductsForSitemap } from "./product.public.actions";

const sGetProductsSitemapData =
   PublicProductService.prototype.getProductsSitemapData;

const sGetProductsSitemapDataMock =
   sGetProductsSitemapData as jest.MockedFunction<
      typeof sGetProductsSitemapData
   >;

describe("getProductsForSitemap tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("error - test", async () => {
      const error = new Error("DB error");
      sGetProductsSitemapDataMock.mockRejectedValue(error);

      const result = await getProductsForSitemap();

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("success - test", async () => {
      const data = dtestData.dProductsSitemapData();
      sGetProductsSitemapDataMock.mockResolvedValue(data);

      const result = await getProductsForSitemap();

      expect(result).toEqual(data);
      expect(sGetProductsSitemapDataMock).toHaveBeenCalledTimes(1);
   });
});
