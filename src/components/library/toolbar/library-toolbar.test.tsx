jest.mock("@/data/actions/library");

import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { getLibraryCategories, getLibraryModels } from "@/data/actions/library";
import { DListViewMode } from "@/data/types/domain/common";

import { LibraryToolbar } from "./library-toolbar";

const getLibraryCategoriesMock = getLibraryCategories as jest.MockedFunction<
   typeof getLibraryCategories
>;

const getLibraryModelsMock = getLibraryModels as jest.MockedFunction<
   typeof getLibraryModels
>;

const assertRendered = () => {
   const toolbar = screen.getByTestId("library-toolbar");
   const filters = screen.getByTestId("library-entry-filters-trigger");
   const viewToggle = screen.getByTestId("view-toggle");
   const groupBy = screen.getByTestId("group-by-select");
   const sortBy = screen.getByTestId("sort-by-select");

   assertInDocument(toolbar);
   assertInDocument(filters);
   assertInDocument(viewToggle);
   assertInDocument(groupBy);
   assertInDocument(sortBy);
};

describe("LibraryToolbar rendering tests", () => {
   beforeEach(() => {
      getLibraryCategoriesMock.mockResolvedValue([]);
      getLibraryModelsMock.mockResolvedValue([]);
   });

   it("LibraryToolbar - totalEntries 1 - test", async () => {
      const filters = dtestData.dLibraryEntriesFilter();
      const { container } = renderWithRouter(
         <LibraryToolbar viewMode={DListViewMode.GRID} filters={filters} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("LibraryToolbar - totalEntries 5 - test", async () => {
      const filters = dtestData.dLibraryEntriesFilter();
      const { container } = renderWithRouter(
         <LibraryToolbar viewMode={DListViewMode.GRID} filters={filters} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
