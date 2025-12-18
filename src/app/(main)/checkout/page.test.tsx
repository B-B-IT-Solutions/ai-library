jest.mock("@/data/actions/cart/cart.actions");

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, dtestData, ntestData, renderAsyncRSC } from "@tests";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getCart } from "@/data/actions/cart";

import { CheckoutPage, metadata } from "./page";

const authMock = auth as jest.MockedFunction<typeof auth>;
const getCartMock = getCart as jest.MockedFunction<typeof getCart>;
const redirectMock = redirect as jest.MockedFunction<typeof redirect>;

export const expectedMetadata: Metadata = {
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

   //    it("CheckoutPage - authenticated user with no session.user.id - redirects to home", async () => {
   //       const session = ntestData.session();
   //       session.user = null;
   //       authMock.mockResolvedValue(session);
   //       const cart = dtestData.dCart();
   //       getCartMock.mockResolvedValue(cart);

   //       await renderAsyncRSC(CheckoutPage, {});

   //       expect(redirectMock).toHaveBeenCalledWith("/");
   //    });

   //    it("CheckoutPage - empty cart - redirects to cart page", async () => {
   //       const session = ntestData.session();
   //       const cart = dtestData.dCart();
   //       cart.items = [];
   //       authMock.mockResolvedValue(session);
   //       getCartMock.mockResolvedValue(cart);

   //       await renderAsyncRSC(CheckoutPage, {});

   //       expect(redirectMock).toHaveBeenCalledWith("/cart");
   //    });

   it("CheckoutPage - authenticated user with items - rendered test", async () => {
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

   // it("CheckoutPage - displays cart items correctly - test", async () => {
   //    const session = ntestData.session();
   //    const cart = dtestData.dCart();
   //    authMock.mockResolvedValue(session);
   //    getCartMock.mockResolvedValue(cart);

   //    await renderAsyncRSC(CheckoutPage, {});

   //    await waitFor(() => {
   //       assertRendered();
   //    });

   //    // Verify that product names and quantities are displayed
   //    cart.items.forEach((item) => {
   //       const itemText = screen.getByText(
   //          new RegExp(`${item.product.name}.*×.*${item.quantity}`, "i")
   //       );
   //       assertInDocument(itemText);
   //    });

   //    // Verify total is displayed
   //    const totalText = screen.getByText(`$${cart.total.toFixed(2)}`);
   //    assertInDocument(totalText);
   // });

   // it("CheckoutPage - displays payment information message - test", async () => {
   //    const session = ntestData.session();
   //    const cart = dtestData.dCart();
   //    authMock.mockResolvedValue(session);
   //    getCartMock.mockResolvedValue(cart);

   //    await renderAsyncRSC(CheckoutPage, {});

   //    await waitFor(() => {
   //       const paymentMessage = screen.getByText(
   //          /you will be redirected to stripe/i
   //       );
   //       assertInDocument(paymentMessage);
   //    });
   // });
});

describe("CheckoutPage functionality tests", () => {
   it("CheckoutPage - metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});

// describe("CheckoutPage functionality tests", () => {
//    beforeEach(() => {
//       jest.resetAllMocks();
//    });

//    it("CheckoutPage - submit button disabled when cart is empty - test", async () => {
//       const session = ntestData.session();
//       const cart = dtestData.dCart();
//       cart.items = [];
//       authMock.mockResolvedValue(session);
//       getCartMock.mockResolvedValue(cart);

//       await renderAsyncRSC(CheckoutPage, {});

//       // This test won't run assertions because the page redirects when cart is empty
//       // But we keep it for consistency with the redirect test above
//       expect(redirectMock).toHaveBeenCalledWith("/cart");
//    });

//    it("CheckoutPage - displays correct number of cart items - test", async () => {
//       const session = ntestData.session();
//       const cart = dtestData.dCart();
//       authMock.mockResolvedValue(session);
//       getCartMock.mockResolvedValue(cart);

//       await renderAsyncRSC(CheckoutPage, {});

//       await waitFor(() => {
//          assertRendered();
//       });

//       // Count the number of items displayed in order summary
//       const itemElements = screen.getAllByText(/×/);
//       expect(itemElements).toHaveLength(cart.items.length);
//    });

//    it("CheckoutPage - displays line totals correctly - test", async () => {
//       const session = ntestData.session();
//       const cart = dtestData.dCart();
//       authMock.mockResolvedValue(session);
//       getCartMock.mockResolvedValue(cart);

//       await renderAsyncRSC(CheckoutPage, {});

//       await waitFor(() => {
//          assertRendered();
//       });

//       // Verify each item's line total is displayed
//       cart.items.forEach((item) => {
//          const lineTotalText = screen.getByText(
//             `$${item.lineTotal.toFixed(2)}`
//          );
//          assertInDocument(lineTotalText);
//       });
//    });
// });
