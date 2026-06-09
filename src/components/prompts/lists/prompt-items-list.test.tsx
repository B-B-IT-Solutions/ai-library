import { createRef } from "react";
import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { PromptItemsList } from "./prompt-items-list";

const assertRendered = () => {
   const entries = screen.getByTestId("template-items-list");
   assertInDocument(entries);
};

describe("PromptItemsList rendering tests", () => {
   it("prompts - collecitonId undefined - test", async () => {
      const prompts = dtestData.dPrompts();

      const { container } = renderWithReactQuery(
         <PromptItemsList descriptors={prompts} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("prompts - collecitonId defined - test", async () => {
      const prompts = dtestData.dPrompts();
      const collection = dtestData.dCollectionPreview();

      const { container } = renderWithReactQuery(
         <PromptItemsList
            descriptors={prompts}
            currentColleciton={collection}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptItemsList ref tests", () => {
   it("ref is forwarded to the last item DOM element - test", async () => {
      const ref = createRef<HTMLDivElement>();
      const descriptors = dtestData.dPrompts(); // 3 items

      renderWithReactQuery(
         <PromptItemsList descriptors={descriptors} ref={ref} />
      );

      await waitFor(() => {
         const items = screen.getAllByTestId("template-item-card");
         expect(ref.current).not.toBeNull();
         expect(ref.current).toBe(items[items.length - 1]);
      });
   });
});
