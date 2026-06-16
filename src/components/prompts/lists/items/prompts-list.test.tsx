import { createRef } from "react";
import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { PromptsList } from "./prompts-list";

const assertRendered = () => {
   const prompts = screen.getByTestId("prompts-list");
   assertInDocument(prompts);
};

describe("PromptItemsList rendering tests", () => {
   it("prompts - collecitonId undefined - test", async () => {
      const prompts = dtestData.dPrompts();

      const { container } = renderWithReactQuery(
         <PromptsList prompts={prompts} />
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
         <PromptsList prompts={prompts} currentColleciton={collection} />
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

      renderWithReactQuery(<PromptsList prompts={descriptors} ref={ref} />);

      await waitFor(() => {
         const items = screen.getAllByTestId("prompt-item");
         expect(ref.current).not.toBeNull();
         expect(ref.current).toBe(items[items.length - 1]);
      });
   });
});
