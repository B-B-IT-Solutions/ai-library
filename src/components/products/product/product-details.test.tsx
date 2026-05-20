import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { ProductDetails } from "./product-details";

const assertRendered = () => {
   const details = screen.getByTestId("product-details");
   assertInDocument(details);
};

const assertBundleRendered = () => {
   const bundle = screen.getByTestId("bundle-details");
   const items = screen.getByTestId("bundle-items");
   const value = screen.getByTestId("bundle-value");
   const useCases = screen.getByTestId("use-cases");

   assertInDocument(bundle);
   assertInDocument(items);
   assertInDocument(value);
   assertInDocument(useCases);
};

const assertTemplateRendered = () => {
   const template = screen.getByTestId("template-details");
   const features = screen.getByTestId("key-features");
   const useCases = screen.getByTestId("use-cases");
   // const preview = screen.getByTestId("prompt-preview");
   const instructions = screen.getByTestId("usage-instructions");

   assertInDocument(template);
   assertInDocument(features);
   assertInDocument(useCases);
   // assertInDocument(preview);
   assertInDocument(instructions);
};

describe("ProductDetails rendering tests", () => {
   it("ProductDetails - product type BUNDLE - test", async () => {
      const product = dtestData.dProduct();
      product.type = "BUNDLE";

      const { container } = render(<ProductDetails product={product} />);

      await waitFor(() => {
         assertRendered();
         assertBundleRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("ProductDetails - product type TEMPLATE - test", async () => {
      const product = dtestData.dProduct();
      product.type = "TEMPLATE";

      const { container } = render(<ProductDetails product={product} />);

      await waitFor(() => {
         assertRendered();
         assertTemplateRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
