import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithRouter,
} from "@tests";

import { DeleteModelButton } from "./delete-model-button";

const assertRendered = () => {
   const deleteBtn = screen.getByTestId("delete-model-btn");
   assertInDocument(deleteBtn);
};

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("model-delete-dialog");
   assertInDocument(dialog);
};

const assertDialogNotRendered = () => {
   const dialog = screen.queryByTestId("model-delete-dialog");
   assertNotInDocument(dialog);
};

describe("DeleteModelButton rendering tests", () => {
   it("rendered test", async () => {
      const model = dtestData.dPromptModelWithUsage();

      const { container } = renderWithRouter(
         <DeleteModelButton model={model} />
      );

      await waitFor(() => {
         assertRendered();
         assertDialogNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("DeleteModelButton functionality tests", () => {
   it("delete btn clicked - test", async () => {
      const model = dtestData.dPromptModelWithUsage();

      renderWithRouter(<DeleteModelButton model={model} />);

      await waitFor(() => {
         assertRendered();
         assertDialogNotRendered();
      });

      const deleteBtn = screen.getByTestId("delete-model-btn");
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
