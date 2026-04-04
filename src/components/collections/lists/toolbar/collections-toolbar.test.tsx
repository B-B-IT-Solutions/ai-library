import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, renderWithRouter } from "@tests";

import { DListViewMode } from "@/data/types/domain/common";

import { CollectionsToolbar } from "./collections-toolbar";

const assertRendered = () => {
   const toolbar = screen.getByTestId("collections-toolbar");
   const viewToggle = screen.getByTestId("view-toggle");

   assertInDocument(toolbar);
   assertInDocument(viewToggle);
};

describe("CollectionsToolbar rendering tests", () => {
   it("totalEntries 1 - test", async () => {
      const { container } = renderWithRouter(
         <CollectionsToolbar viewMode={DListViewMode.GRID} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("totalEntries 5 - test", async () => {
      const { container } = renderWithRouter(
         <CollectionsToolbar viewMode={DListViewMode.GRID} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
