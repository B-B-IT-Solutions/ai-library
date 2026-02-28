import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   renderWithRouter,
} from "@tests";

import { AddTemplateFieldButton } from "./add-template-field-button";

const assertRendered = () => {
   const addBtn = screen.getByTestId("add-template-field-btn");
   assertInDocument(addBtn);
};

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("template-field-add-dialog");
   assertInDocument(dialog);
};

const assertDialogNotRendered = () => {
   const dialog = screen.queryByTestId("template-field-add-dialog");
   assertNotInDocument(dialog);
};

describe("AddTemplateFieldButton rendering tests", () => {
   it("AddTemplateFieldButton rendered test", async () => {
      const { container } = renderWithRouter(<AddTemplateFieldButton />);

      await waitFor(() => {
         assertRendered();
         assertDialogNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("AddTemplateFieldButton functionality tests", () => {
   it("AddTemplateFieldButton - add btn clicked - test", async () => {
      renderWithRouter(<AddTemplateFieldButton />);

      await waitFor(() => {
         assertRendered();
         assertDialogNotRendered();
      });

      const addBtn = screen.getByTestId("add-template-field-btn");
      await userEvent.click(addBtn);

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
