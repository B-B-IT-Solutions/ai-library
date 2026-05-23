import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { TemplateView } from "./template-view";

const assertRendered = () => {
   const libraryEntry = screen.getByTestId("template-view");
   const breadcrumb = screen.getByTestId("template-breadcrumb");
   const form = screen.getByTestId("template-view-form");
   const usePromptBtn = screen.getByTestId("use-prompt-btn");
   const editEntryBtn = screen.getByTestId("edit-template-btn");
   const deleteBtn = screen.getByTestId("delete-template-btn");

   assertInDocument(libraryEntry);
   assertInDocument(breadcrumb);
   assertInDocument(form);
   assertInDocument(usePromptBtn);
   assertInDocument(editEntryBtn);
   assertInDocument(deleteBtn);
};

describe("TemplateView rendering tests", () => {
   it("rendered test", async () => {
      const descriptor = dtestData.dPrompt();
      const template = dtestData.dPromptWithContent();

      const { container } = render(
         <TemplateView descriptor={descriptor} template={template} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
