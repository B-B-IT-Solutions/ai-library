import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";
import mockRouter from "next-router-mock";

import { CartSummary } from "./cart-summary";

const assertRendered = () => {
   const summary = screen.getByTestId("cart-summary");
   const checkoutLink = screen.getByTestId("checkout-link");

   assertInDocument(summary);
   assertInDocument(checkoutLink);
};

describe("CartSummary rendering tests", () => {
   it("CartSummary rendered test", async () => {
      const cart = dtestData.dCart();
      const { container } = render(<CartSummary cart={cart} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CartSummary functionality tests", () => {
   it("CartSummary - checkout link clicked - test", async () => {
      const cart = dtestData.dCart();
      render(<CartSummary cart={cart} />);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const link = screen.getByTestId("checkout-link");
      await userEvent.click(link);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/checkout");
      });
   });
});
