import { getByTestId, screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { KeyFeatures } from "./key-features";

const assertRendered = () => {
   const features = screen.getByTestId("key-features");
   const featureDivs = screen.getAllByTestId("feature");
   const feature1 = featureDivs[0];
   const icon = getByTestId(feature1, "icon");
   const title = getByTestId(feature1, "title");
   const description = getByTestId(feature1, "description");

   assertInDocument(features);
   assertInDocument(icon);
   assertInDocument(title);
   assertInDocument(description);
   expect(featureDivs).toHaveLength(3);
};

const assertNotRendered = () => {
   const features = screen.queryByTestId("key-features");
   assertNotInDocument(features);
};

describe("KeyFeatures rendering tests", () => {
   it("KeyFeatures - features empty -  test", async () => {
      const product = dtestData.dProduct();
      product.features = [];

      const { container } = render(<KeyFeatures product={product} />);

      await waitFor(() => {
         assertNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("KeyFeatures - features defined -  test", async () => {
      const product = dtestData.dProduct();

      const { container } = render(<KeyFeatures product={product} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
