import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { LibraryToolbar } from "./library-toolbar";

const assertRendered = () => {
   const toolbar = screen.getByTestId("library-toolbar");
   const viewToggle = screen.getByTestId("view-toggle");
   const groupBy = screen.getByTestId("group-by-select");
   const sortBy = screen.getByTestId("sort-by-select");

   assertInDocument(toolbar);
   assertInDocument(viewToggle);
   assertInDocument(groupBy);
   assertInDocument(sortBy);
};

describe("LibraryToolbar rendering tests", () => {
   it("LibraryToolbar - totalEntries 1 - test", async () => {
      const { container } = render(
         <LibraryToolbar
            viewMode="grid"
            groupBy="none"
            sortBy="date-desc"
            totalEntries={1}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("LibraryToolbar - totalEntries 5 - test", async () => {
      const { container } = render(
         <LibraryToolbar
            viewMode="grid"
            groupBy="none"
            sortBy="date-desc"
            totalEntries={5}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
