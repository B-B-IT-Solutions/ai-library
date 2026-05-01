import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { PublicTemplateView } from "./template-view-public";

const assertRendered = () => {
   const view = screen.getByTestId("public-template-view");
   const breadcrumb = screen.getByTestId("template-breadcrumb");
   const content = screen.getByTestId("prompt-text");

   assertInDocument(view);
   assertInDocument(breadcrumb);
   assertInDocument(content);
};

describe("PublicTemplateView rendering tests", () => {
   it("rendered test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptor();
      const template = dtestData.dPromptTemplate();

      const { container } = render(
         <PublicTemplateView descriptor={descriptor} template={template} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
