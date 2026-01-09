import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, renderWithReactQuery } from "@tests";

import { PromptView } from "./prompt-view";

const assertRendered = () => {
   const view = screen.getByTestId("prompt-view");
   const promptsEmpty = screen.getByTestId("prompts-empty");

   assertInDocument(view);
   assertInDocument(promptsEmpty);
};

describe("PromptView rendering tests", () => {
   it("PromptView rendered test", async () => {
      const { container } = renderWithReactQuery(<PromptView />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
