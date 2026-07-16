jest.mock("@/data/actions/prompt");
jest.mock("sonner");

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import { deletePromptCategory } from "@/data/actions/prompt";
import { ActionResult } from "@/data/types/utils";

import { DeleteCategoryDialog } from "./delete-category-dialog";

const deletePromptCategoryMock = deletePromptCategory as jest.MockedFunction<
   typeof deletePromptCategory
>;

const toastMock = toast as jest.MockedFunction<typeof toast>;

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("category-delete-dialog");
   const confirmBtn = screen.getByTestId("confirm-btn");
   const cancelBtn = screen.getByTestId("cancel-btn");

   assertInDocument(dialog);
   assertInDocument(confirmBtn);
   assertInDocument(cancelBtn);
};

const assertDialogNotRendered = () => {
   const dialog = screen.queryByTestId("category-delete-dialog");
   assertNotInDocument(dialog);
};

describe("DeleteCategoryDialog rendering tests", () => {
   it("open false - test", async () => {
      const category = dtestData.dPromptCategoryWithUsage();
      render(
         <DeleteCategoryDialog
            open={false}
            onClose={jest.fn()}
            category={category}
         />
      );

      await waitFor(() => {
         assertDialogNotRendered();
      });
   });

   it("open true - prompts count 3 - test", async () => {
      const category = dtestData.dPromptCategoryWithUsage();
      category.count = 3;

      const { container } = render(
         <DeleteCategoryDialog
            open={true}
            onClose={jest.fn()}
            category={category}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("open true - prompts count 1 - test", async () => {
      const category = dtestData.dPromptCategoryWithUsage(1);
      category.count = 1;

      render(
         <DeleteCategoryDialog
            open={true}
            onClose={jest.fn()}
            category={category}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
      });
   });

   it("open true - prompts count 0 - test", async () => {
      const category = dtestData.dPromptCategoryWithUsage(1);
      category.count = 0;

      render(
         <DeleteCategoryDialog
            open={true}
            onClose={jest.fn()}
            category={category}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
      });
   });
});

describe("DeleteCategoryDialog functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("submit btn clicked - result.success true - test", async () => {
      const result: ActionResult = {
         success: true,
         message: "Kategorie gelöscht",
      };
      deletePromptCategoryMock.mockResolvedValue(result);

      const category = dtestData.dPromptCategoryWithUsage();
      const onCloseFn = jest.fn();
      render(
         <DeleteCategoryDialog
            open={true}
            onClose={onCloseFn}
            category={category}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(deletePromptCategoryMock).not.toHaveBeenCalled();
         expect(onCloseFn).not.toHaveBeenCalled();
      });

      const confirmBtn = screen.getByTestId("confirm-btn");
      await userEvent.click(confirmBtn);

      await waitFor(() => {
         expect(deletePromptCategoryMock).toHaveBeenCalledTimes(1);
         expect(deletePromptCategoryMock).toHaveBeenCalledWith(category.id);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
         expect(onCloseFn).toHaveBeenCalledTimes(1);
      });
   });

   it("submit btn clicked - - result.success false - test", async () => {
      const result: ActionResult = {
         success: false,
         message: "Kategorie konnte nicht gelöscht werden",
      };
      deletePromptCategoryMock.mockResolvedValue(result);

      const category = dtestData.dPromptCategoryWithUsage();
      const onCloseFn = jest.fn();
      render(
         <DeleteCategoryDialog
            open={true}
            onClose={onCloseFn}
            category={category}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(deletePromptCategoryMock).not.toHaveBeenCalled();
         expect(onCloseFn).not.toHaveBeenCalled();
      });

      const confirmBtn = screen.getByTestId("confirm-btn");
      await userEvent.click(confirmBtn);

      await waitFor(() => {
         expect(deletePromptCategoryMock).toHaveBeenCalledTimes(1);
         expect(deletePromptCategoryMock).toHaveBeenCalledWith(category.id);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).not.toHaveBeenCalled();
         expect(onCloseFn).toHaveBeenCalledTimes(1);
      });
   });

   it("cancel btn clicked - test", async () => {
      const category = dtestData.dPromptCategoryWithUsage();
      const onCloseFn = jest.fn();
      render(
         <DeleteCategoryDialog
            open={true}
            onClose={onCloseFn}
            category={category}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(deletePromptCategoryMock).not.toHaveBeenCalled();
         expect(onCloseFn).not.toHaveBeenCalled();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         expect(deletePromptCategoryMock).not.toHaveBeenCalled();
         expect(onCloseFn).toHaveBeenCalledTimes(1);
      });
   });
});
