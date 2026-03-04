import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { DListViewMode } from "@/data/types/domain/common";

import { PromptsToolbar } from "./prompts-toolbar";

const assertRendered = () => {
   const toolbar = screen.getByTestId("prompts-toolbar");
   const viewToggle = screen.getByTestId("view-toggle");

   assertInDocument(toolbar);
   assertInDocument(viewToggle);
};

describe("PromptsToolbar rendering tests", () => {
   it("PromptsToolbar - totalEntries 1 - test", async () => {
      const filters = dtestData.dPromptDescriptorsFilter();

      const { container } = renderWithRouter(
         <PromptsToolbar
            viewMode={DListViewMode.GRID}
            filters={filters}
            categories={[]}
            models={[]}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("PromptsToolbar - totalEntries 5 - test", async () => {
      const filters = dtestData.dPromptDescriptorsFilter();

      const { container } = renderWithRouter(
         <PromptsToolbar
            viewMode={DListViewMode.GRID}
            filters={filters}
            categories={[]}
            models={[]}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
