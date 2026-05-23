import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { TemplateView } from "./template-view";

const assertRendered = () => {
   const libraryEntry = screen.getByTestId("template-view");
   const breadcrumb = screen.getByTestId("template-breadcrumb");
   const form = screen.getByTestId("template-view-form");
   const sidebar = screen.getByTestId("prompt-sidebar");

   assertInDocument(libraryEntry);
   assertInDocument(breadcrumb);
   assertInDocument(form);
   assertInDocument(sidebar);
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
