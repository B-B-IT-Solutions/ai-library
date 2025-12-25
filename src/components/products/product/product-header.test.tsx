import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { ProductHeader } from "./product-header";

const assertRendered = () => {
   const header = screen.getByTestId("product-header");
   const name = screen.getByTestId("name");
   const badge = screen.getByTestId("badge");
   const price = screen.getByTestId("price");
   const description = screen.getByTestId("description");

   assertInDocument(header);
   assertInDocument(name);
   assertInDocument(badge);
   assertInDocument(price);
   assertInDocument(description);
};

const assertQuickStatsRendered = () => {
   const stats = screen.getByTestId("quick-stats");
   assertInDocument(stats);
};

const assertQuickStatsNotRendered = () => {
   const stats = screen.queryByTestId("quick-stats");
   assertNotInDocument(stats);
};

describe("ProductHeader rendering tests", () => {
   it("ProductHeader - product type BUNDLE - test", async () => {
      const product = dtestData.dProduct();
      product.type = "BUNDLE";

      const { container } = render(<ProductHeader product={product} />);

      await waitFor(() => {
         assertRendered();
         assertQuickStatsRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("ProductHeader - product type TEMPLATE - test", async () => {
      const product = dtestData.dProduct();
      product.type = "TEMPLATE";

      const { container } = render(<ProductHeader product={product} />);

      await waitFor(() => {
         assertRendered();
         assertQuickStatsNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
