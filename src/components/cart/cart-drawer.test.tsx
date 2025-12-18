import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { CartDrawer } from "./cart-drawer";

const assertRendered = () => {
   const drawer = screen.getByTestId("cart-drawer");
   assertInDocument(drawer);
};

const assertPreviewRendered = () => {
   const preview = screen.getByTestId("cart-preview");
   assertInDocument(preview);
};

const assertPreviewNotRendered = () => {
   const preview = screen.queryByTestId("cart-preview");
   assertNotInDocument(preview);
};

describe("CartSummary rendering tests", () => {
   it("CartSummary - open true - test", async () => {
      const cart = dtestData.dCart();
      const { container } = render(
         <CartDrawer cart={cart} open={true} onOpenChange={jest.fn()} />
      );

      await waitFor(() => {
         assertRendered();
         assertPreviewRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("CartSummary - open false - test", async () => {
      const cart = dtestData.dCart();
      const { container } = render(
         <CartDrawer cart={cart} open={false} onOpenChange={jest.fn()} />
      );

      await waitFor(() => {
         assertRendered();
         assertPreviewNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
