import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { CartDrawer } from "./cart-drawer";

const assertRendered = () => {
   const drawer = screen.getByTestId("cart-drawer");
   const preview = screen.getByTestId("cart-preview");

   assertInDocument(drawer);
   assertInDocument(preview);
};

describe("CartSummary rendering tests", () => {
   it("CartSummary rendered test", async () => {
      const cart = dtestData.dCart();
      const { container } = render(
         <CartDrawer cart={cart} open={true} onOpenChange={jest.fn()} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
