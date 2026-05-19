import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { NewPromptLoading } from "./loading";

const assertRendered = () => {
   const loading = screen.getByTestId("new-prompt-loading");
   assertInDocument(loading);
};

describe("NewPromptLoading rendering tests", () => {
   it("rendered test", async () => {
      const { container } = render(<NewPromptLoading />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
