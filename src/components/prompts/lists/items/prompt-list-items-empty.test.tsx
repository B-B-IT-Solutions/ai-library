import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { EmptyPromptListItems } from "./prompt-list-items-empty";

const assertRendered = () => {
   const listItem = screen.getByTestId("prompt-list-items-empty");
   assertInDocument(listItem);
};

describe("EmptyPromptListItems rendering tests", () => {
   it("EmptyPromptListItems rendered test", async () => {
      const { container } = render(<EmptyPromptListItems />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
