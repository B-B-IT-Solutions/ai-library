import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { PromptEdit } from "./prompt-edit";

const assertRendered = () => {
   const editEntry = screen.getByTestId("prompt-edit");
   const form = screen.getByTestId("prompt-edit-form");

   assertInDocument(editEntry);
   assertInDocument(form);
};

describe("PromptEdit rendering tests", () => {
   it("PromptEdit - new prompt - test", async () => {
      const { container } = render(<PromptEdit />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("PromptEdit - edit existing prompt - test", async () => {
      const prompt = dtestData.dPromptDescriptor();

      const { container } = render(<PromptEdit prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
