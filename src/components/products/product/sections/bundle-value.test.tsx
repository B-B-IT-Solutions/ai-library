import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { BundleValue } from "./bundle-value";

const assertRendered = () => {
   const bundleValue = screen.getByTestId("bundle-value");
   const savings = screen.getByTestId("savings");
   const price = screen.getByTestId("price-summary");
   const note = screen.getByTestId("note");

   assertInDocument(bundleValue);
   assertInDocument(savings);
   assertInDocument(price);
   assertInDocument(note);
};

const assertNotRendered = () => {
   const bundleValue = screen.queryByTestId("bundle-value");
   assertNotInDocument(bundleValue);
};

describe("BundleValue rendering tests", () => {
   it("BundleValue - discountAmount null -  test", async () => {
      const product = dtestData.dProduct();
      product.discountAmount = null;

      const { container } = render(<BundleValue product={product} />);

      await waitFor(() => {
         assertNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("BundleValue - discountAmount defined -  test", async () => {
      const product = dtestData.dProduct();
      product.discountAmount = 14.98;

      const { container } = render(<BundleValue product={product} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("BundleValue - productItems empty -  test", async () => {
      const product = dtestData.dProduct();
      product.productItems = [];

      const { container } = render(<BundleValue product={product} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
