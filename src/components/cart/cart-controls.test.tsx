import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { CartControls } from "./cart-controls";

const assertRendered = () => {
   const controls = screen.getByTestId("cart-controls");
   const floatingCartBtn = screen.getByTestId("floating-cart-btn");
   const drawer = screen.getByTestId("cart-drawer");

   assertInDocument(controls);
   assertInDocument(floatingCartBtn);
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

describe("CartControls rendering tests", () => {
   it("CartControls rendered test", async () => {
      const cart = dtestData.dCart();
      const { container } = render(<CartControls cart={cart} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CartControls functionality tests", () => {
   it("CartControls - floating btn clicked - test", async () => {
      const cart = dtestData.dCart();
      render(<CartControls cart={cart} />);

      await waitFor(() => {
         assertRendered();
         assertPreviewNotRendered();
      });

      const cartBtn = screen.getByTestId("floating-cart-btn");
      await userEvent.click(cartBtn);

      await waitFor(() => {
         assertPreviewRendered();
      });
   });
});
