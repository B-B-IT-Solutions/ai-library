import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { ProductDetailsDialog } from "./product-details-dialog";

const assertRendered = () => {
   const detailsDialog = screen.getByTestId("product-details-dialog");
   assertInDocument(detailsDialog);
};

const assertBtnsRendered = () => {
   const addToCartBtn = screen.getByTestId("add-to-cart-btn");
   const closeBtn = screen.getByTestId("close-dialog-btn");

   assertInDocument(addToCartBtn);
   assertInDocument(closeBtn);
};

const assertBtnsNotRendered = () => {
   const addToCartBtn = screen.queryByTestId("add-to-cart-btn");
   const closeBtn = screen.queryByTestId("close-dialog-btn");

   assertNotInDocument(addToCartBtn);
   assertNotInDocument(closeBtn);
};

describe("ProductDetailsDialog rendering tests", () => {
   it("ProductDetailsDialog - open true - product BUNDLE - test", async () => {
      const product = dtestData.dProduct();
      product.type = "BUNDLE";

      const { container } = render(
         <ProductDetailsDialog
            product={product}
            isInCart={false}
            open={true}
            onClose={jest.fn()}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertBtnsRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("ProductDetailsDialog - open true - product TEMPLATE - test", async () => {
      const product = dtestData.dProduct();
      product.type = "TEMPLATE";

      const { container } = render(
         <ProductDetailsDialog
            product={product}
            isInCart={false}
            open={true}
            onClose={jest.fn()}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertBtnsRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("ProductDetailsDialog - open false test", async () => {
      const product = dtestData.dProduct();
      const { container } = render(
         <ProductDetailsDialog
            product={product}
            isInCart={true}
            open={false}
            onClose={jest.fn()}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertBtnsNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("ProductDetailsDialog functionality tests", () => {
   it("ProductDetailsDialog - close btn clicked - test", async () => {
      const product = dtestData.dProduct();
      const closeFn = jest.fn();

      render(
         <ProductDetailsDialog
            product={product}
            isInCart={false}
            open={true}
            onClose={closeFn}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertBtnsRendered();
         expect(closeFn).not.toHaveBeenCalled();
      });

      const closeBtn = screen.getByTestId("close-dialog-btn");
      await userEvent.click(closeBtn);

      await waitFor(() => {
         expect(closeFn).toHaveBeenCalledTimes(1);
      });
   });
});
