import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { ProductListItem } from "./product-list-item";

const assertRendered = () => {
   const item = screen.getByTestId("product-list-item");
   const addToCartBtn = screen.getByTestId("add-to-cart-btn");
   const viewDetailsBtn = screen.getByTestId("view-details-btn");

   assertInDocument(item);
   assertInDocument(addToCartBtn);
   assertInDocument(viewDetailsBtn);
};

describe("ProductListItem rendering tests", () => {
   it("ProductListItem - product BUNDLE - test", async () => {
      const product = dtestData.dProduct();
      product.type = "BUNDLE";

      const { container } = render(
         <ProductListItem product={product} isInCart={false} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("ProductListItem- product TEMPLATE - test", async () => {
      const product = dtestData.dProduct();
      const item = dtestData.dProductItem();
      item.template.categories = [];
      product.type = "TEMPLATE";
      product.productItems = [item];

      const { container } = render(
         <ProductListItem product={product} isInCart={false} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
