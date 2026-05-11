import React from "react";
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
      const collections = dtestData.dCollections();

      const { container } = renderWithReactQuery(
         <TemplateItemsGrid descriptors={[]} collections={collections} />
      );

      await waitFor(() => {
         assertEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("descriptors - with items - test", async () => {
      const collections = dtestData.dCollections();
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

describe("TemplateItemsGrid ref tests", () => {
   it("ref is forwarded to the last card DOM element - test", async () => {
      const ref = React.createRef<HTMLDivElement>();
      const collections = dtestData.dCollections();
      const descriptors = dtestData.dPromptTemplateDescriptors(); // 3 items

      renderWithReactQuery(
         <TemplateItemsGrid
            descriptors={descriptors}
            collections={collections}
            ref={ref}
         />
      );

      await waitFor(() => {
         const cards = screen.getAllByTestId("template-item-card");
         expect(ref.current).not.toBeNull();
         expect(ref.current).toBe(cards[cards.length - 1]);
      });
   });
});
