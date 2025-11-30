import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { PromptListItem } from "./prompt-list-item";

const assertRendered = () => {
   const listItem = screen.getByTestId("prompt-list-item");
   assertInDocument(listItem);
};

describe("PromptListItem rendering tests", () => {
   it("PromptListItem - isSelected false - rendered test", async () => {
      const prompt = dtestData.dPrompt();

      const { container } = renderWithReactQuery(
         <PromptListItem
            prompt={prompt}
            isSelected={false}
            selectPrompt={jest.fn()}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("PromptListItem - isSelected true - rendered test", async () => {
      const prompt = dtestData.dPrompt();

      const { container } = renderWithReactQuery(
         <PromptListItem
            prompt={prompt}
            isSelected={true}
            selectPrompt={jest.fn()}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
