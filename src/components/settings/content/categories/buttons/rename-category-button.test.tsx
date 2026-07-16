import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithRouter,
} from "@tests";

import { RenameCategoryButton } from "./rename-category-button";

const assertRendered = () => {
   const renameBtn = screen.getByTestId("rename-category-btn");
   assertInDocument(renameBtn);
};

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("category-rename-dialog");
   assertInDocument(dialog);
};

const assertDialogNotRendered = () => {
   const dialog = screen.queryByTestId("category-rename-dialog");
   assertNotInDocument(dialog);
};

describe("RenameCategoryButton rendering tests", () => {
   it("RenameCategoryButton rendered test", async () => {
      const category = dtestData.dPromptCategoryWithUsage();

      const { container } = renderWithRouter(
         <RenameCategoryButton category={category} />
      );

      await waitFor(() => {
         assertRendered();
         assertDialogNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("RenameCategoryButton functionality tests", () => {
   it("RenameCategoryButton - rename btn clicked - test", async () => {
      const category = dtestData.dPromptCategoryWithUsage();

      renderWithRouter(<RenameCategoryButton category={category} />);

      await waitFor(() => {
         assertRendered();
         assertDialogNotRendered();
      });

      const renameBtn = screen.getByTestId("rename-category-btn");
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
