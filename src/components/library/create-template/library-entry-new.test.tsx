import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { NewLibraryEntry } from "./library-entry-new";

const assertRendered = () => {
   const library = screen.getByTestId("library-entry-new");

   assertInDocument(library);
};

describe("NewLibraryEntry rendering tests", () => {
   it("NewLibraryEntry rendered test", async () => {
      const { container } = render(<NewLibraryEntry />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
