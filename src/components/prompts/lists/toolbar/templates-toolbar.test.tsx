jest.mock("@/data/actions/prompt");

import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { getPromptsPage } from "@/data/actions/prompt";
import { DListSortByMode, DListViewMode } from "@/data/types/domain/common";

import { TemplatesToolbar } from "./templates-toolbar";

const getPromptsPageMock = getPromptsPage as jest.MockedFunction<
   typeof getPromptsPage
>;

const assertRendered = () => {
   const toolbar = screen.getByTestId("templates-toolbar");
   const filters = screen.getByTestId("library-entry-filters-trigger");
   const viewToggle = screen.getByTestId("view-toggle");
   const sortBy = screen.getByTestId("sort-by-select");

   assertInDocument(toolbar);
   assertInDocument(filters);
   assertInDocument(viewToggle);
   assertInDocument(sortBy);
};

describe("TemplatesToolbar rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("renders with totalElements from query - test", async () => {
      const categories = dtestData.dTemplateCategories();
      const models = dtestData.dTemplateModels();
      const filters = dtestData.dPromptsFilter();
      const page = dtestData.dPromptsPage();
      getPromptsPageMock.mockResolvedValue(page);

      const { container } = renderWithRouter(
         <TemplatesToolbar
            viewMode={DListViewMode.GRID}
            sortBy={DListSortByMode.DATE_DESC}
            filters={filters}
            categories={categories}
            models={models}
         />
      );

      await waitFor(() => {
         assertRendered();
         expect(
            screen.getByText(`${page.totalElements} Vorlagen`)
         ).toBeInTheDocument();
      });

      expect(container).toMatchSnapshot();
   });

   it("renders without sortBy - falls back to default - test", async () => {
      const categories = dtestData.dTemplateCategories();
      const models = dtestData.dTemplateModels();
      const filters = dtestData.dPromptsFilter();
      const page = dtestData.dPromptsPage();
      getPromptsPageMock.mockResolvedValue(page);

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
