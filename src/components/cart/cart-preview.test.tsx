import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";
import mockRouter from "next-router-mock";

import { CartPreview } from "./cart-preview";

const assertRendered = () => {
   const item = screen.getByTestId("cart-preview");
   assertInDocument(item);
};

const assertItemsRendered = (count: number) => {
   const removeBtns = screen.getAllByTestId("remove-from-cart-btn");

   expect(removeBtns).toHaveLength(count);
};

describe("CartPreview rendering tests", () => {
   it("CartPreview - cart empty - test", async () => {
      const cart = dtestData.dCart();
      cart.items = [];
      const { container } = render(<CartPreview cart={cart} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("CartPreview - cart with one item - test", async () => {
      const cart = dtestData.dCart();
      const item1 = cart.items[0];
      cart.items = [item1];
      const { container } = render(<CartPreview cart={cart} />);

      await waitFor(() => {
         assertRendered();
         assertItemsRendered(1);
      });

      expect(container).toMatchSnapshot();
   });

   it("CartPreview - cart with items - test", async () => {
      const cart = dtestData.dCart();
      const { container } = render(<CartPreview cart={cart} />);

      await waitFor(() => {
         assertRendered();
         assertItemsRendered(3);
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CartPreview functionality tests", () => {
   beforeEach(() => {
      mockRouter.push("/");
   });

   it("CartPreview - checkout link clicked - test", async () => {
      const cart = dtestData.dCart();
      render(<CartPreview cart={cart} />);

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

   it("CartPreview - cart link clicked - test", async () => {
      const cart = dtestData.dCart();
      render(<CartPreview cart={cart} />);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const link = screen.getByTestId("cart-link");
      await userEvent.click(link);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/cart");
      });
   });
});
