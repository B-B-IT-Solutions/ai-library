jest.mock("@/data/actions/settings");
jest.mock("sonner");

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import { deleteGlobalTemplateField } from "@/data/actions/settings";
import { ActionResult } from "@/data/types/utils";

import { GlobalTemplateFieldDeleteConfirmDialog } from "./template-field-confirm-delete-dialog";

const deleteGlobalTemplateFieldMock =
   deleteGlobalTemplateField as jest.MockedFunction<
      typeof deleteGlobalTemplateField
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

describe("GlobalTemplateFieldDeleteConfirmDialog rendering tests", () => {
   it("GlobalTemplateFieldDeleteConfirmDialog - open true - test", async () => {
      const field = dtestData.dGlobalTemplateField();

      const { container } = render(
         <GlobalTemplateFieldDeleteConfirmDialog
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

   it("GlobalTemplateFieldDeleteConfirmDialog - open false - test", async () => {
      const field = dtestData.dGlobalTemplateField();
      render(
         <GlobalTemplateFieldDeleteConfirmDialog
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

describe("GlobalTemplateFieldDeleteConfirmDialog functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("GlobalTemplateFieldDeleteConfirmDialog - confirm delete - result.success true - test", async () => {
      const result: ActionResult = {
         success: true,
         message: "Feld gelöscht",
      };
      deleteGlobalTemplateFieldMock.mockResolvedValue(result);

      const field = dtestData.dGlobalTemplateField();
      const onClose = jest.fn();
      render(
         <GlobalTemplateFieldDeleteConfirmDialog
            open={true}
            onClose={onClose}
            field={field}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(deleteGlobalTemplateFieldMock).not.toHaveBeenCalled();
      });

      const confirmBtn = screen.getByTestId("confirm-btn");
      await userEvent.click(confirmBtn);

      await waitFor(() => {
         expect(deleteGlobalTemplateFieldMock).toHaveBeenCalledTimes(1);
         expect(deleteGlobalTemplateFieldMock).toHaveBeenCalledWith(field.id);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
         expect(onClose).toHaveBeenCalledTimes(1);
      });
   });

   it("GlobalTemplateFieldDeleteConfirmDialog - confirm delete - result.success false - test", async () => {
      const result: ActionResult = {
         success: false,
         message: "Feld konnte nicht gelöscht werden",
      };
      deleteGlobalTemplateFieldMock.mockResolvedValue(result);

      const field = dtestData.dGlobalTemplateField();
      const onClose = jest.fn();
      render(
         <GlobalTemplateFieldDeleteConfirmDialog
            open={true}
            onClose={onClose}
            field={field}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(deleteGlobalTemplateFieldMock).not.toHaveBeenCalled();
      });

      const confirmBtn = screen.getByTestId("confirm-btn");
      await userEvent.click(confirmBtn);

      await waitFor(() => {
         expect(deleteGlobalTemplateFieldMock).toHaveBeenCalledTimes(1);
         expect(deleteGlobalTemplateFieldMock).toHaveBeenCalledWith(field.id);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).not.toHaveBeenCalled();
         expect(onClose).toHaveBeenCalledTimes(1);
      });
   });

   it("GlobalTemplateFieldDeleteConfirmDialog - cancel - test", async () => {
      const field = dtestData.dGlobalTemplateField();
      const onClose = jest.fn();
      render(
         <GlobalTemplateFieldDeleteConfirmDialog
            open={true}
            onClose={onClose}
            field={field}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(deleteGlobalTemplateFieldMock).not.toHaveBeenCalled();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         expect(deleteGlobalTemplateFieldMock).not.toHaveBeenCalled();
         expect(toastMock.success).not.toHaveBeenCalled();
         expect(toastMock.error).not.toHaveBeenCalled();
         expect(mockRouter.refresh).not.toHaveBeenCalled();
         expect(onClose).toHaveBeenCalledTimes(1);
      });
   });
});
