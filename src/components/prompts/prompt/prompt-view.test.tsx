import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { PromptView } from "./prompt-view";

const assertRendered = () => {
   const view = screen.getByTestId("prompt-view");
   const toggleBtn = screen.getByTestId("toggle-favorite-btn");
   const editBtn = screen.getByTestId("edit-prompt-btn");

   assertInDocument(view);
   assertInDocument(toggleBtn);
   assertInDocument(editBtn);
};

describe("PromptView rendering tests", () => {
   it("PromptView rendered test", async () => {
      const prompt = dtestData.dPromptDescriptor();
      const { container } = render(<PromptView prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
