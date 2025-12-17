import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";
import { Metadata } from "next";

import { MarketplaceClient } from "./marketplace-client";

export const expectedMetadata: Metadata = {
   title: "Marketplace",
};

const assertRendered = () => {
   const marketPlaceClient = screen.getByTestId("market-place-client");

   assertInDocument(marketPlaceClient);
};

describe("MarketplaceClient rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("MarketplaceClient rendered test", async () => {
      const products = dtestData.dProducts();
      const cart = dtestData.dCart();

      const { container } = await render(
         <MarketplaceClient products={products} initialCart={cart} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
