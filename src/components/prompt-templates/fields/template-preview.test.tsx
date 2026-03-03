import { render, screen } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { TemplatePreview } from "./template-preview";

const assertRendered = () => {
   const preview = screen.getByTestId("template-preview");
   const mdRenderer = screen.getByTestId("react-md");

   assertInDocument(preview);
   assertInDocument(mdRenderer);
};

describe("TemplatePreview rendering tests", () => {
   it("TemplatePreview rendered test", () => {
      const template = dtestData.dPromptTemplate();
      const values = dtestData.dPromptTemplateFieldValues();
      const { container } = render(
         <TemplatePreview template={template} values={values} />
      );

      assertRendered();

      expect(container).toMatchSnapshot();
   });
});
