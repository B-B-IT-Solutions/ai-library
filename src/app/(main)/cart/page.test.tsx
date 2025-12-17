jest.mock("@/data/actions/cart/cart.actions");

import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {
   assertHasAttributeWithValue,
   assertInDocument,
   dtestData,
   renderAsyncRSC,
} from "@tests";
import { Metadata } from "next";
import mockRouter from "next-router-mock";

import { getCart } from "@/data/actions/cart";

import CartPage, { metadata } from "./page";

const getCartMock = getCart as jest.MockedFunction<typeof getCart>;

export const expectedMetadata: Metadata = {
   title: "Cart",
};

const assertCartRendered = () => {
   const page = screen.getByTestId("cart-page");
   const cartItems = screen.getAllByTestId("cart-item");

   assertInDocument(page);
   expect(cartItems).toHaveLength(3);
};

const assertEmptyCartRendered = () => {
   const page = screen.getByTestId("cart-page-empty");
   const marketplaceLink = screen.getByTestId("market-place-link");

   assertInDocument(page);
   assertInDocument(marketplaceLink);
   assertHasAttributeWithValue(marketplaceLink, "href", "/marketplace");
};

describe("CartPage rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("CartPage - cart empty - test", async () => {
      const cart = dtestData.dCart();
      cart.items = [];
      getCartMock.mockResolvedValue(cart);

      const { container } = await renderAsyncRSC(CartPage, {});

      await waitFor(() => {
         assertEmptyCartRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("CartPage - cart with items - test", async () => {
      const cart = dtestData.dCart();
      getCartMock.mockResolvedValue(cart);

      const { container } = await renderAsyncRSC(CartPage, {});

      await waitFor(() => {
         assertCartRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CartPage functionality tests", () => {
   it("CartPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });

   it("CartPage - market place link clicked - test", async () => {
      const cart = dtestData.dCart();
      cart.items = [];
      getCartMock.mockResolvedValue(cart);

      await renderAsyncRSC(CartPage, {});

      await waitFor(() => {
         assertEmptyCartRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const link = screen.getByTestId("market-place-link");
      userEvent.click(link);

      await waitFor(() => {
         assertEmptyCartRendered();
         expect(mockRouter.pathname).toEqual("/marketplace");
      });
   });
});
