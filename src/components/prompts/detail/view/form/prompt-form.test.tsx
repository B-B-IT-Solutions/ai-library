import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { PromptForm } from "./prompt-form";

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
      const prompt = dtestData.dPromptWithContent();
      prompt.categories = [];

      const { container } = render(<PromptForm prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         assertCategoriesNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("with categories - rendered test", async () => {
      const prompt = dtestData.dPromptWithContent();

      const { container } = render(<PromptForm prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         assertCategoriesRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
