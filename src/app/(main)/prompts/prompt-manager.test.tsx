import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, renderWithReactQuery } from "@tests";

import { PromptManager } from "./prompt-manager";

const assertRendered = () => {
   const promptManager = screen.getByTestId("prompt-manager");
   assertInDocument(promptManager);
};

describe("PromptManager rendering tests", () => {
   it("PromptManager rendered test", async () => {
      const { container } = renderWithReactQuery(<PromptManager />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
