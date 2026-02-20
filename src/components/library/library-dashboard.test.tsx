import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderWithReactQuery } from "@tests";

import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";

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
      const { container } = renderWithReactQuery(
         <LibraryDashboard
            viewMode={DListViewMode.GRID}
            groupBy={DListGroupByMode.CATEGORY}
            sortBy={DListSortByMode.DATE_ASC}
            filters={{}}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertLibraryEntryCards();
      });

      expect(container).toMatchSnapshot();
   });

   it("LibraryDashboard - viewMode list - rendered test", async () => {
      const { container } = renderWithReactQuery(
         <LibraryDashboard
            viewMode={DListViewMode.LIST}
            groupBy={DListGroupByMode.MODEL}
            sortBy={DListSortByMode.NAME_ASC}
            filters={{}}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertLibraryEntryCards();
      });

      expect(container).toMatchSnapshot();
   });
});
