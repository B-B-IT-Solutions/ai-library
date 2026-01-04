import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { PromptTextDisplay } from "./prompt-text-display";

const assertRendered = () => {
   const promptText = screen.getByTestId("prompt-text");
   const expandToggle = screen.getByTestId("expand-toggle");
   const headline = screen.getByTestId("headline");
   const copyBtn = screen.getByTestId("copy-btn");

   assertInDocument(promptText);
   assertInDocument(expandToggle);
   assertInDocument(headline);
   assertInDocument(copyBtn);
};

const assertContentRendered = () => {
   const content = screen.getByTestId("content");
   assertInDocument(content);
};

const assertContentNotRendered = () => {
   const content = screen.queryByTestId("content");
   assertNotInDocument(content);
};

describe("PromptTextDisplay rendering tests", () => {
   it("PromptTextDisplay rendered test", async () => {
      const template = dtestData.dPromptTemplate();

      const { container } = render(<PromptTextDisplay template={template} />);

      await waitFor(() => {
         assertRendered();
         assertContentRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptTextDisplay functionality tests", () => {
   it("PromptTextDisplay - expand btn clicked - test", async () => {
      const template = dtestData.dPromptTemplate();

      render(<PromptTextDisplay template={template} />);

      await waitFor(() => {
         assertRendered();
         assertContentRendered();
      });

      const expandToggle = screen.getByTestId("expand-toggle");
      await userEvent.click(expandToggle);

      await waitFor(() => {
         assertContentNotRendered();
      });
   });
});
