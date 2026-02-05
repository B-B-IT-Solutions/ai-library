import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { CheckoutLoading } from "./loading";

const assertRendered = () => {
   const loading = screen.getByTestId("checkout-loading");
   assertInDocument(loading);
};

describe("CheckoutLoading rendering tests", () => {
   it("CheckoutLoading rendered test", async () => {
      const { container } = render(<CheckoutLoading />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
