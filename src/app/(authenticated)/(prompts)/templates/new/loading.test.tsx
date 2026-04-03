import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { NewLibraryEntryLoading } from "./loading";

const assertRendered = () => {
   const loading = screen.getByTestId("new-library-entry-loading");
   assertInDocument(loading);
};

describe("NewLibraryEntryLoading rendering tests", () => {
   it("NewLibraryEntryLoading rendered test", async () => {
      const { container } = render(<NewLibraryEntryLoading />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
