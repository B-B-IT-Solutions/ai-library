import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { OrderDetailLoading } from "./loading";

const assertRendered = () => {
   const loading = screen.getByTestId("order-detail-loading");
   assertInDocument(loading);
};

describe("OrderDetailLoading rendering tests", () => {
   it("OrderDetailLoading rendered test", async () => {
      const { container } = render(<OrderDetailLoading />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
