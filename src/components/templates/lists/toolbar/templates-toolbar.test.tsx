import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { DListViewMode } from "@/data/types/domain/common";

import { TemplatesToolbar } from "./templates-toolbar";

const assertRendered = () => {
   const toolbar = screen.getByTestId("templates-toolbar");
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
   it("LibraryToolbar - totalEntries 1 - test", async () => {
      const categories = dtestData.dTemplateCategories();
      const models = dtestData.dTemplateModels();
      const filters = dtestData.dTemplateDescriptorsFilter();

      const { container } = renderWithRouter(
         <TemplatesToolbar
            viewMode={DListViewMode.GRID}
            filters={filters}
            categories={categories}
            models={models}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("LibraryToolbar - totalEntries 5 - test", async () => {
      const categories = dtestData.dTemplateCategories();
      const models = dtestData.dTemplateModels();
      const filters = dtestData.dTemplateDescriptorsFilter();

      const { container } = renderWithRouter(
         <TemplatesToolbar
            viewMode={DListViewMode.GRID}
            filters={filters}
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
