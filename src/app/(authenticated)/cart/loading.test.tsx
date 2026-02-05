import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";

import CartLoading from "./loading";

const assertRendered = () => {
   const loading = screen.getByTestId("cart-loading");
   assertInDocument(loading);
};

describe("CartLoading rendering tests", () => {
   it("CartLoading - products empty - test", async () => {
      const { container } = render(<CartLoading />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
