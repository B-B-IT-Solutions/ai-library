import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithRouter,
} from "@tests";

import { DeleteCategoryButton } from "./delete-category-button";

const assertRendered = () => {
   const deleteBtn = screen.getByTestId("delete-category-btn");
   assertInDocument(deleteBtn);
};

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("category-delete-dialog");
   assertInDocument(dialog);
};

const assertDialogNotRendered = () => {
   const dialog = screen.queryByTestId("category-delete-dialog");
   assertNotInDocument(dialog);
};

describe("DeleteCategoryButton rendering tests", () => {
   it("DeleteCategoryButton rendered test", async () => {
      const category = dtestData.dPromptCategoryUsage();

      const { container } = renderWithRouter(
         <DeleteCategoryButton category={category} />
      );

      await waitFor(() => {
         assertRendered();
         assertDialogNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("DeleteCategoryButton functionality tests", () => {
   it("DeleteCategoryButton - delete btn clicked - test", async () => {
      const category = dtestData.dPromptCategoryUsage();

      renderWithRouter(<DeleteCategoryButton category={category} />);

      await waitFor(() => {
         assertRendered();
         assertDialogNotRendered();
      });

      const deleteBtn = screen.getByTestId("delete-category-btn");
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
