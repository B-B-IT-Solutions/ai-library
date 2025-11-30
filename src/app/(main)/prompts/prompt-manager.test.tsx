import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { PromptManager } from "./prompt-manager";

const assertRendered = () => {
   const promptManager = screen.getByTestId("prompt-manager");
   assertInDocument(promptManager);
};

describe("PromptManager rendering tests", () => {
   it("PromptManager rendered test", async () => {
      const prompts = dtestData.dPrompts();

      const { container } = render(<PromptManager prompts={prompts} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
