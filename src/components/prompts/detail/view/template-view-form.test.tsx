import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { TemplateViewForm } from "./template-view-form";

const assertRendered = () => {
   const form = screen.getByTestId("template-view-form");
   const description = screen.getByTestId("description");
   const content = screen.getByTestId("prompt-text");

   assertInDocument(form);
   assertInDocument(description);
   assertInDocument(content);
};

const assertCategoriesRendered = () => {
   const categories = screen.getByTestId("categories");
   assertInDocument(categories);
};

const assertCategoriesNotRendered = () => {
   const categories = screen.queryByTestId("categories");
   assertNotInDocument(categories);
};

describe("LibraryEntryViewForm rendering tests", () => {
   it("categories empty - rendered test", async () => {
      const descriptor = dtestData.dPrompt();
      descriptor.categories = [];
      const template = dtestData.dPromptWithContent();

      const { container } = render(
         <TemplateViewForm descriptor={descriptor} template={template} />
      );

      await waitFor(() => {
         assertRendered();
         assertCategoriesNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("with categories - rendered test", async () => {
      const descriptor = dtestData.dPrompt();
      const template = dtestData.dPromptWithContent();

      const { container } = render(
         <TemplateViewForm descriptor={descriptor} template={template} />
      );

      await waitFor(() => {
         assertRendered();
         assertCategoriesRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
