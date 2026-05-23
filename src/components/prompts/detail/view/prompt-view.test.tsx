import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { PromptView } from "./prompt-view";

const assertRendered = () => {
   const libraryEntry = screen.getByTestId("prompt-view");
   const breadcrumb = screen.getByTestId("template-breadcrumb");
   const form = screen.getByTestId("template-view-form");
   const sidebar = screen.getByTestId("prompt-sidebar");

   assertInDocument(libraryEntry);
   assertInDocument(breadcrumb);
   assertInDocument(form);
   assertInDocument(sidebar);
};

describe("PromptView rendering tests", () => {
   it("rendered test", async () => {
      const prompt = dtestData.dPromptWithContent();

      const { container } = render(<PromptView prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
