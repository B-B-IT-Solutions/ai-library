import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { Products } from "./products";

const assertRendered = () => {
   const products = screen.getByTestId("products");
   assertInDocument(products);
};

const assertProductGrid = () => {
   const grid = screen.getByTestId("products-grid");
   const cards = screen.getAllByTestId("product-card");

   assertInDocument(grid);
   expect(cards).toHaveLength(3);
};

const assertProductList = () => {
   const list = screen.getByTestId("products-list");
   const items = screen.getAllByTestId("product-list-item");

   assertInDocument(list);
   expect(items).toHaveLength(3);
};

describe("Products rendering tests", () => {
   it("Products - one product - test", async () => {
      const product = dtestData.dProduct();
      const cart = dtestData.dCart();

      const { container } = render(
         <Products products={[product]} cart={cart} />
      );

      await waitFor(() => {
         assertRendered();
         const grid = screen.getByTestId("products-grid");
         assertInDocument(grid);
      });

      expect(container).toMatchSnapshot();
   });

   it("Products - viewMode grid - rendered test", async () => {
      const products = dtestData.dProducts();
      const cart = dtestData.dCart();

      const { container } = render(
         <Products products={products} cart={cart} viewMode="grid" />
      );

      await waitFor(() => {
         assertRendered();
         assertProductGrid();
      });

      expect(container).toMatchSnapshot();
   });

   it("Products - viewMode list - rendered test", async () => {
      const products = dtestData.dProducts();
      const cart = dtestData.dCart();

      const { container } = render(
         <Products products={products} cart={cart} viewMode="list" />
      );

      await waitFor(() => {
         assertRendered();
         assertProductList();
      });

      expect(container).toMatchSnapshot();
   });
});
