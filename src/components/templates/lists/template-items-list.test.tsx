import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { TemplateItemsList } from "./template-items-list";

const assertEmptyRendered = () => {
   const empty = screen.getByTestId("template-items-empty");
   assertInDocument(empty);
};

const assertRendered = () => {
   const entries = screen.getByTestId("template-items-list");
   assertInDocument(entries);
};

describe("TemplateItemsList rendering tests", () => {
   it("templateDescriptors empty - test", async () => {
      const collections = dtestData.dCollections();

      const { container } = renderWithReactQuery(
         <TemplateItemsList descriptors={[]} collections={collections} />
      );

      await waitFor(() => {
         assertEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("templateDescriptors with items - test", async () => {
      const collections = dtestData.dCollections();
      const descriptors = dtestData.dPromptTemplateDescriptors();

      const { container } = renderWithReactQuery(
         <TemplateItemsList
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
