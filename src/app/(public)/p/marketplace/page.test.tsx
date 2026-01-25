jest.mock("@/data/actions/cart");
jest.mock("@/data/actions/product");

import { screen, waitFor } from "@testing-library/dom";
import {
   assertInDocument,
   AuthMockedFunction,
   dtestData,
   ntestData,
   renderAsyncRSC,
} from "@tests";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getCart } from "@/data/actions/cart";
import { getProducts } from "@/data/actions/product";

import MarketplacePage, {
   MarketplacePageProps,
   MarketPlaceSearchParams,
   metadata,
} from "./page";

const getCartMock = getCart as jest.MockedFunction<typeof getCart>;

const getProductsMock = getProducts as jest.MockedFunction<typeof getProducts>;

const authMock = auth as unknown as AuthMockedFunction;

const redirectMock = redirect as jest.MockedFunction<typeof redirect>;

const expectedMetadata: Metadata = {
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

   it("MarketplacePage - session null - props empty - test", async () => {
      authMock.mockResolvedValue(null);

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

   it("MarketplacePage - session.user undefined - searchParams.view list - test", async () => {
      const session = ntestData.session();
      session.user = undefined;
      authMock.mockResolvedValue(session);

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

   it("MarketplacePage - session.user.id undefined - searchParams.view grid - test", async () => {
      const session = ntestData.session();
      session.user.id = undefined;
      authMock.mockResolvedValue(session);

      const searchParams: MarketPlaceSearchParams = { view: "grid" };

      const props: MarketplacePageProps = {
         searchParams: Promise.resolve(searchParams),
      };

      const { container } = await renderAsyncRSC(MarketplacePage, props);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("MarketplacePage - session.user.id defined - redirects to /marketplace - test", async () => {
      const session = ntestData.session();
      authMock.mockResolvedValue(session);

      const { container } = await renderAsyncRSC(MarketplacePage, {});

      await waitFor(() => {
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getCartMock).not.toHaveBeenCalled();
         expect(getCartMock).not.toHaveBeenCalled();
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/marketplace");
      });

      expect(container).toMatchSnapshot();
   });
});

describe("MarketplacePage functionality tests", () => {
   it("MarketplacePage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
