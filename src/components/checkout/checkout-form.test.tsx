import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { CheckoutForm } from "./checkout-form";

const assertRendered = () => {
   const form = screen.getByTestId("checkout-form");

   assertInDocument(form);
};

describe("CheckoutForm functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("CheckoutForm - displays payment information message - test", async () => {
      const cart = dtestData.dCart();

      const { container } = render(<CheckoutForm cart={cart} />);

      await waitFor(() => {
         assertRendered();
      });
      expect(container).toMatchSnapshot();
   });

   //    it("CheckoutForm - submit button disabled when cart is empty - test", async () => {
   //       const session = ntestData.session();
   //       const cart = dtestData.dCart();
   //       cart.items = [];
   //       authMock.mockResolvedValue(session);
   //       getCartMock.mockResolvedValue(cart);

   //       await renderAsyncRSC(CheckoutForm, {});

   //       // This test won't run assertions because the page redirects when cart is empty
   //       // But we keep it for consistency with the redirect test above
   //       expect(redirectMock).toHaveBeenCalledWith("/cart");
   //    });

   //    it("CheckoutForm - displays correct number of cart items - test", async () => {
   //       const session = ntestData.session();
   //       const cart = dtestData.dCart();
   //       authMock.mockResolvedValue(session);
   //       getCartMock.mockResolvedValue(cart);

   //       await renderAsyncRSC(CheckoutForm, {});

   //       await waitFor(() => {
   //          assertRendered();
   //       });

   //       // Count the number of items displayed in order summary
   //       const itemElements = screen.getAllByText(/×/);
   //       expect(itemElements).toHaveLength(cart.items.length);
   //    });

   //    it("CheckoutForm - displays line totals correctly - test", async () => {
   //       const session = ntestData.session();
   //       const cart = dtestData.dCart();
   //       authMock.mockResolvedValue(session);
   //       getCartMock.mockResolvedValue(cart);

   //       await renderAsyncRSC(CheckoutForm, {});

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
});
