jest.mock("@/data/actions/cart");
jest.mock("@/data/actions/product");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import { getCart } from "@/data/actions/cart";
import { getProducts } from "@/data/actions/product";
import { DListViewMode } from "@/data/types/domain/common";

import MarketplacePage, {
   MarketplacePageProps,
   metadata,
   PageSearchParams,
} from "./page";

const getCartMock = getCart as jest.MockedFunction<typeof getCart>;

const getProductsMock = getProducts as jest.MockedFunction<typeof getProducts>;

const expectedMetadata: Metadata = {
   title: "Bibliothek",
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

   it("view list - test", async () => {
      const products = dtestData.dProducts();
      const cart = dtestData.dCart();
      getProductsMock.mockResolvedValue(products);
      getCartMock.mockResolvedValue(cart);

      const searchParams: PageSearchParams = { view: DListViewMode.LIST };

      const props: MarketplacePageProps = {
         searchParams: Promise.resolve(searchParams),
      };

      const { container } = await renderAsyncRSC(MarketplacePage, props);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("view grid - test", async () => {
      const searchParams: PageSearchParams = { view: DListViewMode.GRID };

      const props: MarketplacePageProps = {
         searchParams: Promise.resolve(searchParams),
      };

      const { container } = await renderAsyncRSC(MarketplacePage, props);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("MarketplacePage functionality tests", () => {
   it("metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
