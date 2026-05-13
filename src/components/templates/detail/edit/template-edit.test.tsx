import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { TemplateEdit } from "./template-edit";

const assertRendered = () => {
   const editEntry = screen.getByTestId("template-edit");
   const breadcrumbs = screen.getByTestId("template-breadcrumb");
   const form = screen.getByTestId("template-edit-form");

   assertInDocument(editEntry);
   assertInDocument(breadcrumbs);
   assertInDocument(form);
};

describe("TemplateEdit rendering tests", () => {
   it("new entry - test", async () => {
      const { container } = render(<TemplateEdit globalFields={[]} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("edit existing entry - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptor();
      const template = dtestData.dPromptTemplate();
      const fields = dtestData.dGlobalPromptFields();

      const { container } = render(
         <TemplateEdit
            descriptor={descriptor}
            template={template}
            globalFields={fields}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
