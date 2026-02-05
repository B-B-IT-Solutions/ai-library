jest.mock("@/data/actions/cart");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCart } from "@/data/actions/cart";

import { CheckoutPage, metadata } from "./page";

const getCartMock = getCart as jest.MockedFunction<typeof getCart>;
const redirectMock = redirect as jest.MockedFunction<typeof redirect>;

const expectedMetadata: Metadata = {
   title: "Checkout",
};

const assertRendered = () => {
   const page = screen.getByTestId("checkout-page");
   const checkoutForm = screen.getByTestId("checkout-form");

   assertInDocument(page);
   assertInDocument(checkoutForm);
};

const assertCartItems = (count: number) => {
   const items = screen.getAllByTestId("cart-item");
   expect(items).toHaveLength(count);
};

describe("CheckoutPage rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("CheckoutPage - cart.items empty - redirects to home", async () => {
      const cart = dtestData.dCart();
      cart.items = [];
      getCartMock.mockResolvedValue(cart);

      const { container } = await renderAsyncRSC(CheckoutPage, {});

      await waitFor(() => {
         expect(getCartMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/cart");
      });

      expect(container).toMatchSnapshot();
   });

   it("CheckoutPage - cart with items - rendered test", async () => {
      const cart = dtestData.dCart();
      getCartMock.mockResolvedValue(cart);

      const { container } = await renderAsyncRSC(CheckoutPage, {});

      await waitFor(() => {
         assertRendered();
         assertCartItems(3);
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CheckoutPage functionality tests", () => {
   it("CheckoutPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
