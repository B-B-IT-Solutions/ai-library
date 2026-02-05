jest.mock("@/data/actions/cart/cart.actions");
jest.mock("@/data/actions/product/product.actions");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import { getCart } from "@/data/actions/cart";
import { getProducts } from "@/data/actions/product";

import MarketplacePage, {
   MarketplacePageProps,
   MarketPlaceSearchParams,
   metadata,
} from "./page";

const getCartMock = getCart as jest.MockedFunction<typeof getCart>;

const getProductsMock = getProducts as jest.MockedFunction<typeof getProducts>;

const expectedMetadata: Metadata = {
   title: "Marktplatz",
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

   it("MarketplacePage - props empty - rendered test", async () => {
      const products = dtestData.dProducts();
      const cart = dtestData.dCart();
      getProductsMock.mockResolvedValue(products);
      getCartMock.mockResolvedValue(cart);

      const { container } = await renderAsyncRSC(MarketplacePage, {});

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("MarketplacePage - searchParams.view list - rendered test", async () => {
      const products = dtestData.dProducts();
      const cart = dtestData.dCart();
      getProductsMock.mockResolvedValue(products);
      getCartMock.mockResolvedValue(cart);

      const searchParams: MarketPlaceSearchParams = { view: "list" };

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
   it("MarketplacePage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
