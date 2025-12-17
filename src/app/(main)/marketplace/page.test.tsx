jest.mock("@/data/actions/cart/cart.actions");
jest.mock("@/data/actions/product/product.actions");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import { getCartSummary } from "@/data/actions/cart/cart.actions";
import { getProducts } from "@/data/actions/product/product.actions";

import MarketplacePage, { metadata } from "./page";

const getCartSummaryMock = getCartSummary as jest.MockedFunction<
   typeof getCartSummary
>;

const getProductsMock = getProducts as jest.MockedFunction<typeof getProducts>;

export const expectedMetadata: Metadata = {
   title: "Marketplace",
};

const assertRendered = () => {
   const page = screen.getByTestId("market-place-page");
   const marketPlace = screen.getByTestId("market-place");

   assertInDocument(page);
   assertInDocument(marketPlace);
};

describe("MarketplacePage rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("MarketplacePage rendered test", async () => {
      const products = dtestData.dProducts();
      const cart = dtestData.dCart();
      getProductsMock.mockResolvedValue(products);
      getCartSummaryMock.mockResolvedValue(cart);

      const { container } = await renderAsyncRSC(MarketplacePage, {});

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("MarketplacePage functionality tests", () => {
   it("MarketplacePage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
