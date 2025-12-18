import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { CartItem } from "./cart-item";

const assertRendered = () => {
   const item = screen.getByTestId("cart-item");
   const removeBtn = screen.getByTestId("remove-from-cart-btn");

   assertInDocument(item);
   assertInDocument(removeBtn);
};

describe("CartItem rendering tests", () => {
   it("CartItem rendered test", async () => {
      const item = dtestData.dCartItem();
      const { container } = render(<CartItem item={item} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
