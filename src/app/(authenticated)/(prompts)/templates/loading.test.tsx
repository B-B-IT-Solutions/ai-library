import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { LibraryLoading } from "./loading";

const assertRendered = () => {
   const loading = screen.getByTestId("library-loading");
   assertInDocument(loading);
};

describe("OrdersLoading rendering tests", () => {
   it("OrdersLoading rendered test", async () => {
      const { container } = render(<LibraryLoading />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
