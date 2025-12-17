import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { DProduct } from "@/data/types/domain/product";

import { ShowDetailsButton } from "./show-details-button";

const assertRendered = () => {
   const viewDetailsBtn = screen.getByTestId("view-details-btn");
   const detailsDialog = screen.getByTestId("product-detials-dialog");

   assertInDocument(viewDetailsBtn);
   assertInDocument(detailsDialog);
};

const assertProductRendered = (product: DProduct) => {
   const name = screen.getByText(product.name);
   assertInDocument(name);
};

const assertProductNotRendered = (product: DProduct) => {
   const name = screen.queryByTestId(product.name);
   assertNotInDocument(name);
};

describe("ShowDetailsButton rendering tests", () => {
   it("ShowDetailsButton rendered test", async () => {
      const product = dtestData.dProduct();
      const { container } = render(
         <ShowDetailsButton product={product} isInCart={false} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("ShowDetailsButton functionality tests", () => {
   it("ShowDetailsButton - btn clicked - test", async () => {
      const product = dtestData.dProduct();
      render(<ShowDetailsButton product={product} isInCart={false} />);

      await waitFor(() => {
         assertRendered();
         assertProductNotRendered(product);
      });

      const viewBtn = screen.getByTestId("view-details-btn");
      await userEvent.click(viewBtn);

      await waitFor(() => {
         assertProductRendered(product);
      });
   });
});
