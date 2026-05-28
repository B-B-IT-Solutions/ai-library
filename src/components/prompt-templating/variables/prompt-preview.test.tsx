import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { PromptPreview } from "./prompt-preview";

const assertRendered = () => {
   const templatePreview = screen.getByTestId("prompt-preview");
   const preview = screen.getByTestId("preview");
   const mdRenderer = screen.getByTestId("react-md");
   const copyBtn = screen.getByTestId("copy-preview-btn");

   assertInDocument(templatePreview);
   assertInDocument(preview);
   assertInDocument(mdRenderer);
   assertInDocument(copyBtn);
};

describe("PromptPreview rendering tests", () => {
   it("render test", async () => {
      const template = dtestData.dPromptWithContent();
      const values = dtestData.dPromptVariableValues();
      const { container } = render(
         <PromptPreview
            template={template}
            values={values}
            resolvedContent="content 1"
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
