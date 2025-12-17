import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { Marketplace } from "./marketplace";

const assertRendered = () => {
   const marketPlace = screen.getByTestId("market-place");
   assertInDocument(marketPlace);
};

const assertProductEmpty = () => {
   const productsEmpty = screen.getByTestId("products-empty");
   assertInDocument(productsEmpty);
};

const assertProductsRendered = () => {
   const products = screen.getByTestId("products");
   const cart = screen.getByTestId("cart-controls");

   assertInDocument(products);
   assertInDocument(cart);
};

describe("Marketplace rendering tests", () => {
   it("Marketplace - products empty - test", async () => {
      const cart = dtestData.dCart();

      const { container } = render(
         <Marketplace products={[]} initialCart={cart} />
      );

      await waitFor(() => {
         assertRendered();
         assertProductEmpty();
      });

      expect(container).toMatchSnapshot();
   });

   it("Marketplace - viewMode grid - rendered test", async () => {
      const products = dtestData.dProducts();
      const cart = dtestData.dCart();

      const { container } = render(
         <Marketplace products={products} initialCart={cart} viewMode="grid" />
      );

      await waitFor(() => {
         assertRendered();
         assertProductsRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("Marketplace - viewMode list - rendered test", async () => {
      const products = dtestData.dProducts();
      const cart = dtestData.dCart();

      const { container } = render(
         <Marketplace products={products} initialCart={cart} viewMode="list" />
      );

      await waitFor(() => {
         assertRendered();
         assertProductsRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
