jest.mock("@/data/actions/prompt/prompt.actions");

import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { getPrompts } from "@/data/actions/prompt/prompt.actions";

import { PromptsList } from "./prompts-list";

const getPromptsMock = getPrompts as jest.MockedFunction<typeof getPrompts>;

const assertRendered = () => {
   const list = screen.getByTestId("prompts-list");
   const listHeader = screen.getByTestId("prompts-list-header");
   const listItems = screen.getByTestId("prompts-list-items");
   const listItem = screen.getAllByTestId("prompt-list-item");

   assertInDocument(list);
   assertInDocument(listHeader);
   assertInDocument(listItems);
   expect(listItem).toHaveLength(3);
};

describe("PromptsList rendering tests", () => {
   it("PromptsList rendered test", async () => {
      const page = dtestData.dPromptsPage();
      getPromptsMock.mockResolvedValue(page);

      const { container } = renderWithReactQuery(
         <PromptsList
            addPrompt={jest.fn()}
            selectPrompt={jest.fn()}
            selectedPrompt={null}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
