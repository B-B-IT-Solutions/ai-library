import { getByTestId, screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { TemplateEdit } from "./template-edit";

const assertBtnRendered = () => {
   const headerActions = screen.getByTestId("header-actions");
   const headerCancelBtn = getByTestId(headerActions, "cancel-btn");
   const headerSaveBtn = getByTestId(headerActions, "save-btn");

   const footerActions = screen.getByTestId("footer-actions");
   const footerCancelBtn = getByTestId(footerActions, "cancel-btn");
   const footerSaveBtn = getByTestId(footerActions, "save-btn");

   assertInDocument(headerActions);
   assertInDocument(headerCancelBtn);
   assertInDocument(headerSaveBtn);

   assertInDocument(footerActions);
   assertInDocument(footerCancelBtn);
   assertInDocument(footerSaveBtn);
};

const assertRendered = () => {
   const editEntry = screen.getByTestId("template-edit");
   const breadcrumbs = screen.getByTestId("template-breadcrumb");
   const form = screen.getByTestId("template-edit-form");

   assertInDocument(editEntry);
   assertInDocument(breadcrumbs);
   assertInDocument(form);

   assertBtnRendered();
};

describe("TemplateEdit rendering tests", () => {
   it("new entry - collectionId undefined - test", async () => {
      const { container } = render(<TemplateEdit globalFields={[]} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("new entry - collectionId defined - test", async () => {
      const { container } = render(
         <TemplateEdit globalFields={[]} collectionId="collection-id-123" />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("edit existing entry - test", async () => {
      const prompt = dtestData.dPromptWithContent();
      const fields = dtestData.dGlobalPromptFields();

      const { container } = render(
         <TemplateEdit prompt={prompt} globalFields={fields} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
