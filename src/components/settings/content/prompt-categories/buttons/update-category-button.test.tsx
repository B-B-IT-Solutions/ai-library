import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithRouter,
} from "@tests";

import { UpdateCategoryButton } from "./update-category-button";

const assertRendered = () => {
   const renameBtn = screen.getByTestId("update-category-btn");
   assertInDocument(renameBtn);
};

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("update-category-dialog");
   assertInDocument(dialog);
};

const assertDialogNotRendered = () => {
   const dialog = screen.queryByTestId("update-category-dialog");
   assertNotInDocument(dialog);
};

describe("UpdateCategoryButton rendering tests", () => {
   it("rendered test", async () => {
      const category = dtestData.dPromptCategoryWithUsage();

      const { container } = renderWithRouter(
         <UpdateCategoryButton category={category} />
      );

      await waitFor(() => {
         assertRendered();
         assertDialogNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("UpdateCategoryButton functionality tests", () => {
   it("update btn clicked - test", async () => {
      const category = dtestData.dPromptCategoryWithUsage();

      renderWithRouter(<UpdateCategoryButton category={category} />);

      await waitFor(() => {
         assertRendered();
         assertDialogNotRendered();
      });

      const renameBtn = screen.getByTestId("update-category-btn");
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
