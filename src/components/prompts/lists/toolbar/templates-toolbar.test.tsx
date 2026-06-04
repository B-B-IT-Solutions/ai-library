import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { DListSortByMode, DListViewMode } from "@/data/types/domain/common";

import { TemplatesToolbar } from "./templates-toolbar";

const assertRendered = () => {
   const toolbar = screen.getByTestId("templates-toolbar");
   const filters = screen.getByTestId("library-entry-filters-trigger");
   const sortBy = screen.getByTestId("sort-by-select");
   const viewToggle = screen.getByTestId("view-toggle");

   assertInDocument(toolbar);
   assertInDocument(filters);
   assertInDocument(sortBy);
   assertInDocument(viewToggle);
};

describe("TemplatesToolbar rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("rendered - test", async () => {
      const categories = dtestData.dTemplateCategories();
      const models = dtestData.dTemplateModels();

      const { container } = renderWithRouter(
         <TemplatesToolbar
            viewMode={DListViewMode.GRID}
            sortBy={DListSortByMode.DATE_DESC}
            categories={categories}
            models={models}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
