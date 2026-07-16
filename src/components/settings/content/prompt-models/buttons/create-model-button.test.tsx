import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   renderWithRouter,
} from "@tests";

import { CreateModelButton } from "./create-model-button";

const assertRendered = () => {
   const createBtn = screen.getByTestId("create-model-btn");
   assertInDocument(createBtn);
};

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("create-model-dialog");
   assertInDocument(dialog);
};

const assertDialogNotRendered = () => {
   const dialog = screen.queryByTestId("create-model-dialog");
   assertNotInDocument(dialog);
};

describe("CreateModelButton rendering tests", () => {
   it("rendered test", async () => {
      const { container } = renderWithRouter(<CreateModelButton />);

      await waitFor(() => {
         assertRendered();
         assertDialogNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CreateModelButton functionality tests", () => {
   it("create btn clicked - test", async () => {
      renderWithRouter(<CreateModelButton />);

      await waitFor(() => {
         assertRendered();
         assertDialogNotRendered();
      });

      const createBtn = screen.getByTestId("create-model-btn");
      await userEvent.click(createBtn);

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
