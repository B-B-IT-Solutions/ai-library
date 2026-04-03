import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { TemplateItemsGrid } from "./template-items-grid";

const assertEmptyRendered = () => {
   const empty = screen.getByTestId("template-items-empty");
   assertInDocument(empty);
};

const assertRendered = () => {
   const entries = screen.getByTestId("template-items-grid");
   assertInDocument(entries);
};

describe("TemplateItemsGrid rendering tests", () => {
   it("descriptors - empty - test", async () => {
      const collections = dtestData.dLibraryCollections();

      const { container } = renderWithReactQuery(
         <TemplateItemsGrid descriptors={[]} collections={collections} />
      );

      await waitFor(() => {
         assertEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("descriptors - with items - test", async () => {
      const collections = dtestData.dLibraryCollections();
      const descriptors = dtestData.dPromptTemplateDescriptors();

      const { container } = renderWithReactQuery(
         <TemplateItemsGrid
            descriptors={descriptors}
            collections={collections}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
