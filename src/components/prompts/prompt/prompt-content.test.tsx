import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { PromptContent } from "./prompt-content";

const assertRendered = () => {
   const content = screen.getByTestId("prompt-content");
   const headline = screen.getByTestId("headline");
   const text = screen.getByTestId("text");
   const copyBtn = screen.getByTestId("copy-prompt-btn");

   assertInDocument(content);
   assertInDocument(headline);
   assertInDocument(text);
   assertInDocument(copyBtn);
};

describe("PromptContent rendering tests", () => {
   it("PromptContent rendered test", async () => {
      const prompt = dtestData.dPromptDescriptor();

      const { container } = render(<PromptContent prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
