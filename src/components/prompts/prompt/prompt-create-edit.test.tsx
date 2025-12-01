import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, renderWithReactQuery } from "@tests";

import { PromptCreateEdit } from "./prompt-create-edit";

const assertRendered = () => {
   const promptCreateEdit = screen.getByTestId("prompt-create-edit");
   assertInDocument(promptCreateEdit);
};

describe("PromptManager rendering tests", () => {
   it("PromptManager rendered test", async () => {
      const { container } = renderWithReactQuery(<PromptCreateEdit />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
