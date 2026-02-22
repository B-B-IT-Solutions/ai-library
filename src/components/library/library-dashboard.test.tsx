import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderWithReactQuery } from "@tests";

import { LibraryDashboard } from "./library-dashboard";

const assertRendered = () => {
   const entries = screen.getByTestId("library-entries");
   assertInDocument(entries);
};

const assertLibraryEntryCards = () => {
   const entryCards = screen.getAllByTestId("library-entry-card");
   expect(entryCards).toHaveLength(3);
};

describe("LibraryDashboard rendering tests", () => {
   it("LibraryDashboard - viewMode grid - rendered test", async () => {
      const { container } = renderWithReactQuery(<LibraryDashboard />);

      await waitFor(() => {
         assertRendered();
         assertLibraryEntryCards();
      });

      expect(container).toMatchSnapshot();
   });

   it("LibraryDashboard - viewMode list - rendered test", async () => {
      const { container } = renderWithReactQuery(<LibraryDashboard />);

      await waitFor(() => {
         assertRendered();
         assertLibraryEntryCards();
      });

      expect(container).toMatchSnapshot();
   });
});
