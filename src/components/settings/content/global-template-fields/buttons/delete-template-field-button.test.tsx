import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithRouter,
} from "@tests";

import { DeleteTemplateFieldButton } from "./delete-template-field-button";

const assertRendered = () => {
   const deleteBtn = screen.getByTestId("delete-template-field-btn");
   assertInDocument(deleteBtn);
};

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("template-field-delete-dialog");
   assertInDocument(dialog);
};

const assertDialogNotRendered = () => {
   const dialog = screen.queryByTestId("template-field-delete-dialog");
   assertNotInDocument(dialog);
};

describe("DeleteTemplateFieldButton rendering tests", () => {
   it("DeleteTemplateFieldButton rendered test", async () => {
      const field = dtestData.dGlobalPromptField();

      const { container } = renderWithRouter(
         <DeleteTemplateFieldButton field={field} />
      );

      await waitFor(() => {
         assertRendered();
         assertDialogNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("DeleteTemplateFieldButton functionality tests", () => {
   it("DeleteTemplateFieldButton - delete btn clicked - test", async () => {
      const field = dtestData.dGlobalPromptField();

      renderWithRouter(<DeleteTemplateFieldButton field={field} />);

      await waitFor(() => {
         assertRendered();
         assertDialogNotRendered();
      });

      const deleteBtn = screen.getByTestId("delete-template-field-btn");
      await userEvent.click(deleteBtn);

      await waitFor(() => {
         assertDialogRendered();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         assertDialogNotRendered();
      });
   });
});
