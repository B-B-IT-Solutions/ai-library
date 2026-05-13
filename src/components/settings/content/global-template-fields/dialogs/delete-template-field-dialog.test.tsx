jest.mock("@/data/actions/settings");
jest.mock("sonner");

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import { deleteGlobalPromptField } from "@/data/actions/settings";
import { ActionResult } from "@/data/types/utils";

import { GlobalPromptFieldDeleteConfirmDialog } from "./delete-template-field-dialog";

const deleteGlobalPromptFieldMock =
   deleteGlobalPromptField as jest.MockedFunction<
      typeof deleteGlobalPromptField
   >;

const toastMock = toast as jest.MockedFunction<typeof toast>;

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("template-field-delete-dialog");
   const confirmBtn = screen.getByTestId("confirm-btn");
   const cancelBtn = screen.getByTestId("cancel-btn");

   assertInDocument(dialog);
   assertInDocument(confirmBtn);
   assertInDocument(cancelBtn);
};

const assertDialogNotRendered = () => {
   const dialog = screen.queryByTestId("template-field-delete-dialog");
   assertNotInDocument(dialog);
};

describe("GlobalPromptFieldDeleteConfirmDialog rendering tests", () => {
   it("GlobalPromptFieldDeleteConfirmDialog - open true - test", async () => {
      const field = dtestData.dGlobalPromptField();

      const { container } = render(
         <GlobalPromptFieldDeleteConfirmDialog
            open={true}
            onClose={jest.fn()}
            field={field}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("GlobalPromptFieldDeleteConfirmDialog - open false - test", async () => {
      const field = dtestData.dGlobalPromptField();
      render(
         <GlobalPromptFieldDeleteConfirmDialog
            open={false}
            onClose={jest.fn()}
            field={field}
         />
      );

      await waitFor(() => {
         assertDialogNotRendered();
      });
   });
});

describe("GlobalPromptFieldDeleteConfirmDialog functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("GlobalPromptFieldDeleteConfirmDialog - confirm delete - result.success true - test", async () => {
      const result: ActionResult = {
         success: true,
         message: "Feld gelöscht",
      };
      deleteGlobalPromptFieldMock.mockResolvedValue(result);

      const field = dtestData.dGlobalPromptField();
      const onClose = jest.fn();
      render(
         <GlobalPromptFieldDeleteConfirmDialog
            open={true}
            onClose={onClose}
            field={field}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(deleteGlobalPromptFieldMock).not.toHaveBeenCalled();
      });

      const confirmBtn = screen.getByTestId("confirm-btn");
      await userEvent.click(confirmBtn);

      await waitFor(() => {
         expect(deleteGlobalPromptFieldMock).toHaveBeenCalledTimes(1);
         expect(deleteGlobalPromptFieldMock).toHaveBeenCalledWith(field.id);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
         expect(onClose).toHaveBeenCalledTimes(1);
      });
   });

   it("GlobalPromptFieldDeleteConfirmDialog - confirm delete - result.success false - test", async () => {
      const result: ActionResult = {
         success: false,
         message: "Feld konnte nicht gelöscht werden",
      };
      deleteGlobalPromptFieldMock.mockResolvedValue(result);

      const field = dtestData.dGlobalPromptField();
      const onClose = jest.fn();
      render(
         <GlobalPromptFieldDeleteConfirmDialog
            open={true}
            onClose={onClose}
            field={field}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(deleteGlobalPromptFieldMock).not.toHaveBeenCalled();
      });

      const confirmBtn = screen.getByTestId("confirm-btn");
      await userEvent.click(confirmBtn);

      await waitFor(() => {
         expect(deleteGlobalPromptFieldMock).toHaveBeenCalledTimes(1);
         expect(deleteGlobalPromptFieldMock).toHaveBeenCalledWith(field.id);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).not.toHaveBeenCalled();
         expect(onClose).toHaveBeenCalledTimes(1);
      });
   });

   it("GlobalPromptFieldDeleteConfirmDialog - cancel - test", async () => {
      const field = dtestData.dGlobalPromptField();
      const onClose = jest.fn();
      render(
         <GlobalPromptFieldDeleteConfirmDialog
            open={true}
            onClose={onClose}
            field={field}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(deleteGlobalPromptFieldMock).not.toHaveBeenCalled();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         expect(deleteGlobalPromptFieldMock).not.toHaveBeenCalled();
         expect(toastMock.success).not.toHaveBeenCalled();
         expect(toastMock.error).not.toHaveBeenCalled();
         expect(mockRouter.refresh).not.toHaveBeenCalled();
         expect(onClose).toHaveBeenCalledTimes(1);
      });
   });
});
