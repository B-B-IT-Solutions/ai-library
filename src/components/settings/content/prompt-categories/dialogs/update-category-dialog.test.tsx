jest.mock("@/data/actions/prompt");
jest.mock("sonner");

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   clearInput,
   dtestData,
   typeIntoInput,
} from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import {
   isConflictingPromptCategoryName,
   updatePromptCategory,
} from "@/data/actions/prompt";
import { ActionResult } from "@/data/types/utils";
import { initPromptCategory } from "../utils";

import { UpdateCategoryDialog } from "./update-category-dialog";

const updatePromptCategoryMock = updatePromptCategory as jest.MockedFunction<
   typeof updatePromptCategory
>;

const isConflictingPromptCategoryNameMock =
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
   });

   it("submit btn clicked - result.success true - test", async () => {
      const result: ActionResult = {
         success: true,
         message: "Kategorie erfolgreich umbenannt",
      };
      updatePromptCategoryMock.mockResolvedValue(result);
      isConflictingPromptCategoryNameMock.mockResolvedValue(false);

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

      const updatedName = "category 123";
      await clearInput("name");
      await typeIntoInput("name", updatedName);

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      const expectedPayload = initPromptCategory(category);
      expectedPayload.name = updatedName;

      await waitFor(() => {
         expect(isConflictingPromptCategoryNameMock).toHaveBeenCalledTimes(1);
         expect(isConflictingPromptCategoryNameMock).toHaveBeenCalledWith(
            category.id,
            updatedName
         );
         expect(updatePromptCategoryMock).toHaveBeenCalledTimes(1);
         expect(updatePromptCategoryMock).toHaveBeenCalledWith(
            category.id,
            expectedPayload
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
      isConflictingPromptCategoryNameMock.mockResolvedValue(false);

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

      const updatedName = "category 123";
      await clearInput("name");
      await typeIntoInput("name", updatedName);

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      const expectedPayload = initPromptCategory(category);
      expectedPayload.name = updatedName;

      await waitFor(() => {
         expect(isConflictingPromptCategoryNameMock).toHaveBeenCalledTimes(1);
         expect(isConflictingPromptCategoryNameMock).toHaveBeenCalledWith(
            category.id,
            updatedName
         );
         expect(updatePromptCategoryMock).toHaveBeenCalledTimes(1);
         expect(updatePromptCategoryMock).toHaveBeenCalledWith(
            category.id,
            expectedPayload
         );
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).not.toHaveBeenCalled();
         expect(onClose).not.toHaveBeenCalled();
      });
   });

   it("submit btn clicked - isConflict true - test", async () => {
      isConflictingPromptCategoryNameMock.mockResolvedValue(true);

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

      const updatedName = "category 123";
      await clearInput("name");
      await typeIntoInput("name", updatedName);

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      const expectedPayload = initPromptCategory(category);
      expectedPayload.name = updatedName;

      await waitFor(() => {
         expect(isConflictingPromptCategoryNameMock).toHaveBeenCalledTimes(1);
         expect(isConflictingPromptCategoryNameMock).toHaveBeenCalledWith(
            category.id,
            updatedName
         );
         expect(updatePromptCategoryMock).not.toHaveBeenCalled();
         expect(onClose).not.toHaveBeenCalled();
      });
   });

   it("submit btn clicked - validation error - test", async () => {
      const onClose = jest.fn();
      const category = dtestData.dPromptCategoryWithUsage();
      isConflictingPromptCategoryNameMock.mockResolvedValue(false);

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

      await clearInput("name");

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(isConflictingPromptCategoryNameMock).toHaveBeenCalledTimes(1);
         expect(isConflictingPromptCategoryNameMock).toHaveBeenCalledWith(
            category.id,
            ""
         );
         expect(updatePromptCategoryMock).not.toHaveBeenCalled();
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
         expect(isConflictingPromptCategoryNameMock).not.toHaveBeenCalled();
         expect(updatePromptCategoryMock).not.toHaveBeenCalled();
         expect(onClose).toHaveBeenCalledTimes(1);
      });
   });
});
