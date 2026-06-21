import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, renderWithRouter } from "@tests";

import { DListViewMode } from "@/data/types/domain/common";

import { WorkflowsToolbar } from "./workflows-toolbar";

const assertRendered = () => {
   const toolbar = screen.getByTestId("workflows-toolbar");
   const searchFilter = screen.getByTestId("search-filter");
   const sortBySelect = screen.getByTestId("sort-by-select");
   const viewToggle = screen.getByTestId("view-toggle");

   assertInDocument(toolbar);
   assertInDocument(searchFilter);
   assertInDocument(sortBySelect);
   assertInDocument(viewToggle);
};

describe("WorkflowsToolbar rendering tests", () => {
   it("render test", async () => {
      const { container } = renderWithRouter(
         <WorkflowsToolbar viewMode={DListViewMode.GRID} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
