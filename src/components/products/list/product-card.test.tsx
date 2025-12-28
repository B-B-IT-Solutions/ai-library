import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { ProductCard } from "./product-card";

const assertRendered = () => {
   const card = screen.getByTestId("product-card");
   const addToCartBtn = screen.getByTestId("add-to-cart-btn");
   const viewDetailsBtn = screen.getByTestId("view-details-btn");

   assertInDocument(card);
   assertInDocument(addToCartBtn);
   assertInDocument(viewDetailsBtn);
};

describe("ProductCard rendering tests", () => {
   it("ProductCard - product BUNDLE - test", async () => {
      const product = dtestData.dProduct();
      product.type = "BUNDLE";

      const { container } = render(
         <ProductCard product={product} isInCart={false} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("ProductCard- product TEMPLATE - test", async () => {
      const product = dtestData.dProduct();
      const item = dtestData.dProductItem();
      item.template.categories = [];
      product.type = "TEMPLATE";
      product.productItems = [item];

      const { container } = render(
         <ProductCard product={product} isInCart={false} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
