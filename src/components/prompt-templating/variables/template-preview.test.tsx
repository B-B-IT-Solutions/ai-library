import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { TemplatePreview } from "./template-preview";

const assertRendered = () => {
   const templatePreview = screen.getByTestId("template-preview");
   const preview = screen.getByTestId("preview");
   const mdRenderer = screen.getByTestId("react-md");
   const copyBtn = screen.getByTestId("copy-preview-btn");

   assertInDocument(templatePreview);
   assertInDocument(preview);
   assertInDocument(mdRenderer);
   assertInDocument(copyBtn);
};

describe("TemplatePreview rendering tests", () => {
   it("TemplatePreview rendered test", async () => {
      const template = dtestData.dPromptWithContent();
      const values = dtestData.dPromptFieldValues();
      const { container } = render(
         <TemplatePreview
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
