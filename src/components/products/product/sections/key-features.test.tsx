import { getByTestId, screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

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
};

describe("KeyFeatures rendering tests", () => {
   it("KeyFeatures - features defined -  test", async () => {
      const product = dtestData.dProduct();

      const { container } = render(<KeyFeatures product={product} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
