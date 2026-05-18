import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { Prompt0View } from "./prompt0-view";

const assertRendered = () => {
   const view = screen.getByTestId("prompt-view");
   const breadcrumb = screen.getByTestId("prompt-breadcrumb");
   const form = screen.getByTestId("prompt-view-form");

   assertInDocument(view);
   assertInDocument(breadcrumb);
   assertInDocument(form);
};

describe("Prompt0View rendering tests", () => {
   it("rendered - test", async () => {
      const prompt = dtestData.dPrompt0();
      const { container } = render(<Prompt0View prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
