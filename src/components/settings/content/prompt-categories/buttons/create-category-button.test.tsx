import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   renderWithRouter,
} from "@tests";

import { CreateCategoryButton } from "./create-category-button";

const assertRendered = () => {
   const createBtn = screen.getByTestId("create-category-btn");
   assertInDocument(createBtn);
};

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("create-category-dialog");
   assertInDocument(dialog);
};

const assertDialogNotRendered = () => {
   const dialog = screen.queryByTestId("create-category-dialog");
   assertNotInDocument(dialog);
};

describe("CreateCategoryButton rendering tests", () => {
   it("rendered test", async () => {
      const { container } = renderWithRouter(<CreateCategoryButton />);

      await waitFor(() => {
         assertRendered();
         assertDialogNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CreateCategoryButton functionality tests", () => {
   it("create btn clicked - test", async () => {
      renderWithRouter(<CreateCategoryButton />);

      await waitFor(() => {
         assertRendered();
         assertDialogNotRendered();
      });

      const createBtn = screen.getByTestId("create-category-btn");
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
