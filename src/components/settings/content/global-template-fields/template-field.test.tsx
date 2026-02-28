import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { GlobalTemplateFieldItem } from "./template-field";

const assertRendered = () => {
   const item = screen.getByTestId("template-field-item");
   const editBtn = screen.getByTestId("edit-template-field-btn");
   const deleteBtn = screen.getByTestId("delete-template-field-btn");

   assertInDocument(item);
   assertInDocument(editBtn);
   assertInDocument(deleteBtn);
};

describe("GlobalTemplateFieldItem rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("GlobalTemplateFieldItem render test", async () => {
      const field = dtestData.dGlobalTemplateField();

      const { container } = renderWithRouter(
         <GlobalTemplateFieldItem field={field} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
