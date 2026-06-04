import { createRef } from "react";
import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { TemplateItemsList } from "./template-items-list";

const assertRendered = () => {
   const entries = screen.getByTestId("template-items-list");
   assertInDocument(entries);
};

describe("TemplateItemsList rendering tests", () => {
   it("prompts - collecitonId undefined - test", async () => {
      const collections = dtestData.dCollections();
      const prompts = dtestData.dPrompts();

      const { container } = renderWithReactQuery(
         <TemplateItemsList descriptors={prompts} collections={collections} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("prompts - collecitonId defined - test", async () => {
      const collections = dtestData.dCollections();
      const prompts = dtestData.dPrompts();
      const collection = dtestData.dCollection();

      const { container } = renderWithReactQuery(
         <TemplateItemsList
            descriptors={prompts}
            collections={collections}
            collectionId={collection.id}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("TemplateItemsList ref tests", () => {
   it("ref is forwarded to the last item DOM element - test", async () => {
      const ref = createRef<HTMLDivElement>();
      const collections = dtestData.dCollections();
      const descriptors = dtestData.dPrompts(); // 3 items

      renderWithReactQuery(
         <TemplateItemsList
            descriptors={descriptors}
            collections={collections}
            ref={ref}
         />
      );

      await waitFor(() => {
         const items = screen.getAllByTestId("template-item-card");
         expect(ref.current).not.toBeNull();
         expect(ref.current).toBe(items[items.length - 1]);
      });
   });
});
