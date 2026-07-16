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
   it("DeleteCategoryDialog - open true - test", async () => {
      const category = dtestData.dPromptCategoryWithUsage();

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

   it("DeleteCategoryDialog - open false - test", async () => {
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

   it("DeleteCategoryDialog - no affected prompts - test", async () => {
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
         assertInDocument(
            screen.getByText(/Sie ist aktuell keinem Prompt zugeordnet/)
         );
      });
   });

   it("DeleteCategoryDialog - single affected prompt - test", async () => {
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
         assertInDocument(
            screen.getByText(/Sie ist aktuell 1 Prompt zugeordnet/)
         );
      });
   });

   it("DeleteCategoryDialog - multiple affected prompts - test", async () => {
      const category = dtestData.dPromptCategoryWithUsage(1);
      category.count = 5;

      render(
         <DeleteCategoryDialog
            open={true}
            onClose={jest.fn()}
            category={category}
         />
      );

      await waitFor(() => {
         assertInDocument(
            screen.getByText(/Sie ist aktuell 5 Prompts zugeordnet/)
         );
      });
   });
});

describe("DeleteCategoryDialog functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("DeleteCategoryDialog - confirm delete - result.success true - test", async () => {
      const result: ActionResult = {
         success: true,
         message: "Kategorie gelöscht",
      };
      deletePromptCategoryMock.mockResolvedValue(result);

      const category = dtestData.dPromptCategoryWithUsage();
      const onClose = jest.fn();
      render(
         <DeleteCategoryDialog
            open={true}
            onClose={onClose}
            category={category}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(deletePromptCategoryMock).not.toHaveBeenCalled();
      });

      const confirmBtn = screen.getByTestId("confirm-btn");
      await userEvent.click(confirmBtn);

      await waitFor(() => {
         expect(deletePromptCategoryMock).toHaveBeenCalledTimes(1);
         expect(deletePromptCategoryMock).toHaveBeenCalledWith(category.id);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
         expect(onClose).toHaveBeenCalledTimes(1);
      });
   });

   it("DeleteCategoryDialog - confirm delete - result.success false - test", async () => {
      const result: ActionResult = {
         success: false,
         message: "Kategorie konnte nicht gelöscht werden",
      };
      deletePromptCategoryMock.mockResolvedValue(result);

      const category = dtestData.dPromptCategoryWithUsage();
      const onClose = jest.fn();
      render(
         <DeleteCategoryDialog
            open={true}
            onClose={onClose}
            category={category}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      const confirmBtn = screen.getByTestId("confirm-btn");
      await userEvent.click(confirmBtn);

      await waitFor(() => {
         expect(deletePromptCategoryMock).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).not.toHaveBeenCalled();
         expect(onClose).toHaveBeenCalledTimes(1);
      });
   });

   it("DeleteCategoryDialog - cancel - test", async () => {
      const category = dtestData.dPromptCategoryWithUsage();
      const onClose = jest.fn();
      render(
         <DeleteCategoryDialog
            open={true}
            onClose={onClose}
            category={category}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         expect(deletePromptCategoryMock).not.toHaveBeenCalled();
         expect(onClose).toHaveBeenCalledTimes(1);
      });
   });
});
