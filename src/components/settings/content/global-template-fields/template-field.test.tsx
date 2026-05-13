import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { GlobalPromptFieldItem } from "./template-field";

const assertRendered = () => {
   const field = screen.getByTestId("template-field");
   const editBtn = screen.getByTestId("edit-template-field-btn");
   const deleteBtn = screen.getByTestId("delete-template-field-btn");

   assertInDocument(field);
   assertInDocument(editBtn);
   assertInDocument(deleteBtn);
};

describe("GlobalPromptFieldItem rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("GlobalPromptFieldItem render test", async () => {
      const field = dtestData.dGlobalPromptField();

      const { container } = renderWithRouter(
         <GlobalPromptFieldItem field={field} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
