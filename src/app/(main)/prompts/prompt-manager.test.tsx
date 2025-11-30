jest.mock("@/data/actions/prompt/prompt.actions");

import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithReactQuery } from "@tests";

import { getPrompts } from "@/data/actions/prompt/prompt.actions";

import { PromptManager } from "./prompt-manager";

const getPromptsMock = getPrompts as jest.MockedFunction<typeof getPrompts>;

const assertRendered = () => {
   const promptManager = screen.getByTestId("prompt-manager");
   const listItem = screen.getAllByTestId("prompt-list-item");

   assertInDocument(promptManager);
   expect(listItem).toHaveLength(3);
};

describe("PromptManager rendering tests", () => {
   it("PromptManager rendered test", async () => {
      const page = dtestData.dPromptsPage();
      getPromptsMock.mockResolvedValue(page);

      const { container } = renderWithReactQuery(<PromptManager />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
