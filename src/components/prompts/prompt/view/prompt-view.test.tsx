import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { PromptView } from "./prompt-view";

const assertRendered = () => {
   const view = screen.getByTestId("prompt-view");
   const form = screen.getByTestId("prompt-view-form");

   assertInDocument(view);
   assertInDocument(form);
};

describe("PromptView rendering tests", () => {
   it("rendered - test", async () => {
      const prompt = dtestData.dPromptDescriptor();
      const { container } = render(<PromptView prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
