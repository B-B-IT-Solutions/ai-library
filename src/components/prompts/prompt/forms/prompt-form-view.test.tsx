import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { PromptFormView } from "./prompt-form-view";

const assertRendered = () => {
   const form = screen.getByTestId("prompt-form-view");
   assertInDocument(form);
};

describe("PromptFormView rendering tests", () => {
   it("PromptFormView rendered test", async () => {
      const prompt = dtestData.dPromptDescriptor();

      const { container } = render(<PromptFormView prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
