import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithRouter,
} from "@tests";

import { UpdateModelButton } from "./update-model-button";

const assertRendered = () => {
   const renameBtn = screen.getByTestId("update-model-btn");
   assertInDocument(renameBtn);
};

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("update-model-dialog");
   assertInDocument(dialog);
};

const assertDialogNotRendered = () => {
   const dialog = screen.queryByTestId("update-model-dialog");
   assertNotInDocument(dialog);
};

describe("UpdateModelButton rendering tests", () => {
   it("rendered test", async () => {
      const model = dtestData.dPromptModelWithUsage();

      const { container } = renderWithRouter(
         <UpdateModelButton model={model} />
      );

      await waitFor(() => {
         assertRendered();
         assertDialogNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("UpdateModelButton functionality tests", () => {
   it("update btn clicked - test", async () => {
      const model = dtestData.dPromptModelWithUsage();

      renderWithRouter(<UpdateModelButton model={model} />);

      await waitFor(() => {
         assertRendered();
         assertDialogNotRendered();
      });

      const renameBtn = screen.getByTestId("update-model-btn");
      await userEvent.click(renameBtn);

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
