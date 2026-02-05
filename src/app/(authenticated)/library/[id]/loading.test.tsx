import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { LibraryDetailLoading } from "./loading";

const assertRendered = () => {
   const loading = screen.getByTestId("library-item-loading");
   assertInDocument(loading);
};

describe("LibraryDetailLoading rendering tests", () => {
   it("LibraryDetailLoading rendered test", async () => {
      const { container } = render(<LibraryDetailLoading />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
