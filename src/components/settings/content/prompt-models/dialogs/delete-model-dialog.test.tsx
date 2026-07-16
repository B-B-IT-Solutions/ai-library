jest.mock("@/data/actions/prompt");
jest.mock("sonner");

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import { deletePromptModel } from "@/data/actions/prompt";
import { ActionResult } from "@/data/types/utils";

import { DeleteModelDialog } from "./delete-model-dialog";

const deletePromptModelMock = deletePromptModel as jest.MockedFunction<
   typeof deletePromptModel
>;

const toastMock = toast as jest.MockedFunction<typeof toast>;

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("model-delete-dialog");
   const confirmBtn = screen.getByTestId("confirm-btn");
   const cancelBtn = screen.getByTestId("cancel-btn");

   assertInDocument(dialog);
   assertInDocument(confirmBtn);
   assertInDocument(cancelBtn);
};

const assertDialogNotRendered = () => {
   const dialog = screen.queryByTestId("model-delete-dialog");
   assertNotInDocument(dialog);
};

describe("DeleteModelDialog rendering tests", () => {
   it("open false - test", async () => {
      const model = dtestData.dPromptModelWithUsage();
      render(
         <DeleteModelDialog open={false} onClose={jest.fn()} model={model} />
      );

      await waitFor(() => {
         assertDialogNotRendered();
      });
   });

   it("open true - prompts count 3 - test", async () => {
      const model = dtestData.dPromptModelWithUsage();
      model.count = 3;

      const { container } = render(
         <DeleteModelDialog open={true} onClose={jest.fn()} model={model} />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("open true - prompts count 1 - test", async () => {
      const model = dtestData.dPromptModelWithUsage(1);
      model.count = 1;

      render(
         <DeleteModelDialog open={true} onClose={jest.fn()} model={model} />
      );

      await waitFor(() => {
         assertDialogRendered();
      });
   });

   it("open true - prompts count 0 - test", async () => {
      const model = dtestData.dPromptModelWithUsage(1);
      model.count = 0;

      render(
         <DeleteModelDialog open={true} onClose={jest.fn()} model={model} />
      );

      await waitFor(() => {
         assertDialogRendered();
      });
   });
});

describe("DeleteModelDialog functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("submit btn clicked - result.success true - test", async () => {
      const result: ActionResult = {
         success: true,
         message: "Modell gelöscht",
      };
      deletePromptModelMock.mockResolvedValue(result);

      const model = dtestData.dPromptModelWithUsage();
      const onCloseFn = jest.fn();
      render(
         <DeleteModelDialog open={true} onClose={onCloseFn} model={model} />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(deletePromptModelMock).not.toHaveBeenCalled();
         expect(onCloseFn).not.toHaveBeenCalled();
      });

      const confirmBtn = screen.getByTestId("confirm-btn");
      await userEvent.click(confirmBtn);

      await waitFor(() => {
         expect(deletePromptModelMock).toHaveBeenCalledTimes(1);
         expect(deletePromptModelMock).toHaveBeenCalledWith(model.id);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
         expect(onCloseFn).toHaveBeenCalledTimes(1);
      });
   });

   it("submit btn clicked - - result.success false - test", async () => {
      const result: ActionResult = {
         success: false,
         message: "Modell konnte nicht gelöscht werden",
      };
      deletePromptModelMock.mockResolvedValue(result);

      const model = dtestData.dPromptModelWithUsage();
      const onCloseFn = jest.fn();
      render(
         <DeleteModelDialog open={true} onClose={onCloseFn} model={model} />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(deletePromptModelMock).not.toHaveBeenCalled();
         expect(onCloseFn).not.toHaveBeenCalled();
      });

      const confirmBtn = screen.getByTestId("confirm-btn");
      await userEvent.click(confirmBtn);

      await waitFor(() => {
         expect(deletePromptModelMock).toHaveBeenCalledTimes(1);
         expect(deletePromptModelMock).toHaveBeenCalledWith(model.id);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).not.toHaveBeenCalled();
         expect(onCloseFn).toHaveBeenCalledTimes(1);
      });
   });

   it("cancel btn clicked - test", async () => {
      const model = dtestData.dPromptModelWithUsage();
      const onCloseFn = jest.fn();
      render(
         <DeleteModelDialog open={true} onClose={onCloseFn} model={model} />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(deletePromptModelMock).not.toHaveBeenCalled();
         expect(onCloseFn).not.toHaveBeenCalled();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         expect(deletePromptModelMock).not.toHaveBeenCalled();
         expect(onCloseFn).toHaveBeenCalledTimes(1);
      });
   });
});
