import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { DListSortByMode, DListViewMode } from "@/data/types/domain/common";

import { PromptsToolbar } from "./prompts-toolbar";

const assertRendered = () => {
   const toolbar = screen.getByTestId("prompts-toolbar");
   const filters = screen.getByTestId("filters-trigger-btn");
   const sortBy = screen.getByTestId("sort-by-select");
   const viewToggle = screen.getByTestId("view-toggle");

   assertInDocument(toolbar);
   assertInDocument(filters);
   assertInDocument(sortBy);
   assertInDocument(viewToggle);
};

describe("PromptsToolbar rendering tests", () => {
   it("rendered - test", async () => {
      const categories = dtestData.dTemplateCategories();
      const models = dtestData.dTemplateModels();
      const collections = dtestData.dCollectionPreviews();

      const { container } = renderWithRouter(
         <PromptsToolbar
            viewMode={DListViewMode.GRID}
            sortBy={DListSortByMode.DATE_DESC}
            categories={categories}
            models={models}
            collections={collections}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
