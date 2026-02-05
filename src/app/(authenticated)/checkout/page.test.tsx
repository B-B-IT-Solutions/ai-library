jest.mock("@/data/actions/cart/cart.actions");

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

import { CheckoutPage, metadata } from "./page";

const authMock = auth as unknown as AuthMockedFunction;
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

   it("CheckoutPage - session null - redirects to home", async () => {
      authMock.mockResolvedValue(null);

      const { container } = await renderAsyncRSC(CheckoutPage, {});

      await waitFor(() => {
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getCartMock).not.toHaveBeenCalled();
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("CheckoutPage - session.user undefined - redirects to home", async () => {
      const session = ntestData.session();
      session.user = undefined;
      authMock.mockResolvedValue(session);

      const { container } = await renderAsyncRSC(CheckoutPage, {});

      await waitFor(() => {
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getCartMock).not.toHaveBeenCalled();
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("CheckoutPage - session.user.id undefined - redirects to home", async () => {
      const session = ntestData.session();
      session.user.id = undefined;
      authMock.mockResolvedValue(session);

      const { container } = await renderAsyncRSC(CheckoutPage, {});

      await waitFor(() => {
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getCartMock).not.toHaveBeenCalled();
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/");
      });

      expect(container).toMatchSnapshot();
   });

   it("CheckoutPage - cart.items empty - redirects to home", async () => {
      const session = ntestData.session();
      const cart = dtestData.dCart();
      cart.items = [];
      authMock.mockResolvedValue(session);
      getCartMock.mockResolvedValue(cart);

      const { container } = await renderAsyncRSC(CheckoutPage, {});

      await waitFor(() => {
         expect(authMock).toHaveBeenCalledTimes(1);
         expect(getCartMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledTimes(1);
         expect(redirectMock).toHaveBeenCalledWith("/cart");
      });

      expect(container).toMatchSnapshot();
   });

   it("CheckoutPage - cart with items - rendered test", async () => {
      const session = ntestData.session();
      const cart = dtestData.dCart();
      authMock.mockResolvedValue(session);
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
