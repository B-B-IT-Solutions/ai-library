import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithRouter,
} from "@tests";

import { EditTemplateFieldButton } from "./edit-template-field-button";

const assertRendered = () => {
   const editBtn = screen.getByTestId("edit-template-field-btn");

   assertInDocument(editBtn);
};

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("template-field-edit-dialog");
   assertInDocument(dialog);
};

const assertDialogNotRendered = () => {
   const dialog = screen.queryByTestId("template-field-edit-dialog");
   assertNotInDocument(dialog);
};

describe("EditTemplateFieldButton rendering tests", () => {
   it("EditTemplateFieldButton rendered test", async () => {
      const field = dtestData.dGlobalTemplateField();

      const { container } = renderWithRouter(
         <EditTemplateFieldButton field={field} />
      );

      await waitFor(() => {
         assertRendered();
         assertDialogNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("EditTemplateFieldButton functionality tests", () => {
   it("EditLibraryEntryButton - edit btn clicked - test", async () => {
      const field = dtestData.dGlobalTemplateField();

      renderWithRouter(<EditTemplateFieldButton field={field} />);

      await waitFor(() => {
         assertRendered();
         assertDialogNotRendered();
      });

      const editBtn = screen.getByTestId("edit-template-field-btn");
      await userEvent.click(editBtn);

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
