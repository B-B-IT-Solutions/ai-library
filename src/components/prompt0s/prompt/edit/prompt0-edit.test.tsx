import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { Prompt0Edit } from "./prompt0-edit";

const assertRendered = () => {
   const editEntry = screen.getByTestId("prompt-edit");
   const breadcrumb = screen.getByTestId("prompt-breadcrumb");
   const form = screen.getByTestId("prompt-edit-form");

   assertInDocument(editEntry);
   assertInDocument(breadcrumb);
   assertInDocument(form);
};

describe("Prompt0Edit rendering tests", () => {
   it("new prompt - test", async () => {
      const { container } = render(<Prompt0Edit />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("edit existing prompt - test", async () => {
      const prompt = dtestData.dPrompt0();

      const { container } = render(<Prompt0Edit prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
