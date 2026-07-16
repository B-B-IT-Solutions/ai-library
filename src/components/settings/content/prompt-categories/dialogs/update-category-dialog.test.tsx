jest.mock("@/data/actions/prompt");
jest.mock("sonner");

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import {
   isConflictingPromptCategoryName,
   updatePromptCategory,
} from "@/data/actions/prompt";
import { ActionResult } from "@/data/types/utils";

import { UpdateCategoryDialog } from "./update-category-dialog";

const updatePromptCategoryMock = updatePromptCategory as jest.MockedFunction<
   typeof updatePromptCategory
>;

const checkCategoryNameAvailableMock =
   isConflictingPromptCategoryName as jest.MockedFunction<
      typeof isConflictingPromptCategoryName
   >;

const toastMock = toast as jest.MockedFunction<typeof toast>;

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("update-category-dialog");
   const cancelBtn = screen.getByTestId("cancel-btn");
   const submitBtn = screen.getByTestId("submit-btn");

   assertInDocument(dialog);
   assertInDocument(cancelBtn);
   assertInDocument(submitBtn);
};

const assertDialogNotRendered = () => {
   const dialog = screen.queryByTestId("update-category-dialog");
   assertNotInDocument(dialog);
};

const getNameInput = () => {
   const field = screen.getByTestId("name");
   return within(field).getByTestId("input");
};

describe("UpdateCategoryDialog rendering tests", () => {
   it("open true - test", async () => {
      const category = dtestData.dPromptCategoryWithUsage();
      const { container } = render(
         <UpdateCategoryDialog
            category={category}
            open={true}
            onClose={jest.fn()}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(getNameInput()).toHaveValue(category.name);
      });

      expect(container).toMatchSnapshot();
   });

   it("open false - test", async () => {
      const category = dtestData.dPromptCategoryWithUsage();
      render(
         <UpdateCategoryDialog
            category={category}
            open={false}
            onClose={jest.fn()}
         />
      );

      await waitFor(() => {
         assertDialogNotRendered();
      });
   });
});

describe("UpdateCategoryDialog functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      checkCategoryNameAvailableMock.mockResolvedValue(true);
   });

   it("submit btn clicked - result.success true - test", async () => {
      const result: ActionResult = {
         success: true,
         message: "Kategorie erfolgreich umbenannt",
      };
      updatePromptCategoryMock.mockResolvedValue(result);

      const onClose = jest.fn();
      const category = dtestData.dPromptCategoryWithUsage();

      render(
         <UpdateCategoryDialog
            category={category}
            open={true}
            onClose={onClose}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(updatePromptCategoryMock).not.toHaveBeenCalled();
      });

      await userEvent.clear(getNameInput());
      await userEvent.type(getNameInput(), "Vertrieb");

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(updatePromptCategoryMock).toHaveBeenCalledTimes(1);
         expect(updatePromptCategoryMock).toHaveBeenCalledWith(
            category.id,
            "Vertrieb"
         );
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
         expect(onClose).toHaveBeenCalledTimes(1);
      });
   });

   it("submit btn clicked - result.success false - test", async () => {
      const result: ActionResult = {
         success: false,
         message: "Eine Kategorie mit diesem Namen existiert bereits",
      };
      updatePromptCategoryMock.mockResolvedValue(result);

      const onClose = jest.fn();
      const category = dtestData.dPromptCategoryWithUsage();

      render(
         <UpdateCategoryDialog
            category={category}
            open={true}
            onClose={onClose}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      await userEvent.clear(getNameInput());
      await userEvent.type(getNameInput(), "Support");

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(updatePromptCategoryMock).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).not.toHaveBeenCalled();
         expect(onClose).not.toHaveBeenCalled();
      });
   });

   it("submit btn clicked - name taken - rejected client-side without server round-trip - test", async () => {
      checkCategoryNameAvailableMock.mockResolvedValue(false);

      const onClose = jest.fn();
      const category = dtestData.dPromptCategoryWithUsage();

      render(
         <UpdateCategoryDialog
            category={category}
            open={true}
            onClose={onClose}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      await userEvent.clear(getNameInput());
      await userEvent.type(getNameInput(), "Support");

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(checkCategoryNameAvailableMock).toHaveBeenCalledWith(
            category.id,
            "Support"
         );
         assertInDocument(
            screen.getByText(
               "Es existiert bereits eine Kategorie mit diesem Namen"
            )
         );
         expect(updatePromptCategoryMock).not.toHaveBeenCalled();
         expect(onClose).not.toHaveBeenCalled();
      });
   });

   it("cancel btn clicked - test", async () => {
      const onClose = jest.fn();
      const category = dtestData.dPromptCategoryWithUsage();
      render(
         <UpdateCategoryDialog
            category={category}
            open={true}
            onClose={onClose}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         expect(updatePromptCategoryMock).not.toHaveBeenCalled();
         expect(onClose).toHaveBeenCalledTimes(1);
      });
   });

   it("submit btn clicked - validation error - test", async () => {
      const onClose = jest.fn();
      const category = dtestData.dPromptCategoryWithUsage();

      render(
         <UpdateCategoryDialog
            category={category}
            open={true}
            onClose={onClose}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      await userEvent.clear(getNameInput());

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(updatePromptCategoryMock).not.toHaveBeenCalled();
      });
   });
});
