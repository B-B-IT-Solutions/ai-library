import { getByTestId, screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { UseCases } from "./use-cases";

const assertRendered = () => {
   const usecases = screen.getByTestId("use-cases");
   const usecaseDivs = screen.getAllByTestId("use-case");
   const usecase1 = usecaseDivs[0];
   const category = getByTestId(usecase1, "category");
   const description = getByTestId(usecase1, "description");

   assertInDocument(usecases);
   assertInDocument(category);
   assertInDocument(description);
   expect(usecaseDivs).toHaveLength(3);
};

const assertNotRendered = () => {
   const usecases = screen.queryByTestId("use-cases");
   assertNotInDocument(usecases);
};

describe("UseCases rendering tests", () => {
   it("KeyFeatures - useCases empty -  test", async () => {
      const product = dtestData.dProduct();
      product.useCases = [];

      const { container } = render(<UseCases product={product} />);

      await waitFor(() => {
         assertNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("UseCases - usecases defined -  test", async () => {
      const product = dtestData.dProduct();

      const { container } = render(<UseCases product={product} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
