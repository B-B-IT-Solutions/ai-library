import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { LibraryEntriesList } from "./library-entries-list";

const assertEmptyRendered = () => {
   const empty = screen.getByTestId("library-entries-empty");
   assertInDocument(empty);
};

const assertRendered = () => {
   const entries = screen.getByTestId("library-entries-list");
   assertInDocument(entries);
};

describe("LibraryEntriesList rendering tests", () => {
   it("LibraryEntriesList - empty - test", async () => {
      const collections = dtestData.dLibraryCollections();

      const { container } = renderWithReactQuery(
         <LibraryEntriesList descriptors={[]} collections={collections} />
      );

      await waitFor(() => {
         assertEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("LibraryEntriesList - with entries - test", async () => {
      const collections = dtestData.dLibraryCollections();
      const descriptors = dtestData.dPromptTemplateDescriptors();

      const { container } = renderWithReactQuery(
         <LibraryEntriesList
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
