import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { TemplateView } from "./template-view";

const assertRendered = () => {
   const libraryEntry = screen.getByTestId("template-view");
   const breadcrumb = screen.getByTestId("libary-entry-breadcrumb");
   const form = screen.getByTestId("template-view-form");

   assertInDocument(libraryEntry);
   assertInDocument(breadcrumb);
   assertInDocument(form);
};

describe("TemplateView rendering tests", () => {
   it("rendered test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();

      const { container } = render(<TemplateView descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
