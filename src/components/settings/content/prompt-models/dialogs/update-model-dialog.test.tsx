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
   isConflictingPromptModelName,
   updatePromptModel,
} from "@/data/actions/prompt";
import { ActionResult } from "@/data/types/utils";
import { initPromptModel } from "../utils";

import { UpdateModelDialog } from "./update-model-dialog";

const updatePromptModelMock = updatePromptModel as jest.MockedFunction<
   typeof updatePromptModel
>;

const isConflictingPromptModelNameMock =
   isConflictingPromptModelName as jest.MockedFunction<
      typeof isConflictingPromptModelName
   >;

const toastMock = toast as jest.MockedFunction<typeof toast>;

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("update-model-dialog");
   const cancelBtn = screen.getByTestId("cancel-btn");
   const submitBtn = screen.getByTestId("submit-btn");

   assertInDocument(dialog);
   assertInDocument(cancelBtn);
   assertInDocument(submitBtn);
};

const assertDialogNotRendered = () => {
   const dialog = screen.queryByTestId("update-model-dialog");
   assertNotInDocument(dialog);
};

describe("UpdateModelDialog rendering tests", () => {
   it("open true - test", async () => {
      const model = dtestData.dPromptModelWithUsage();
      const { container } = render(
         <UpdateModelDialog model={model} open={true} onClose={jest.fn()} />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("open false - test", async () => {
      const model = dtestData.dPromptModelWithUsage();
      render(
         <UpdateModelDialog model={model} open={false} onClose={jest.fn()} />
      );

      await waitFor(() => {
         assertDialogNotRendered();
      });
   });
});

describe("UpdateModelDialog functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("submit btn clicked - result.success true - test", async () => {
      const result: ActionResult = {
         success: true,
         message: "Modell erfolgreich umbenannt",
      };
      updatePromptModelMock.mockResolvedValue(result);
      isConflictingPromptModelNameMock.mockResolvedValue(false);

      const onClose = jest.fn();
      const model = dtestData.dPromptModelWithUsage();

      render(
         <UpdateModelDialog model={model} open={true} onClose={onClose} />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(updatePromptModelMock).not.toHaveBeenCalled();
      });

      const updatedName = "model 123";
      await clearInput("name");
      await typeIntoInput("name", updatedName);

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      const expectedPayload = initPromptModel(model);
      expectedPayload.name = updatedName;

      await waitFor(() => {
         expect(isConflictingPromptModelNameMock).toHaveBeenCalledTimes(1);
         expect(isConflictingPromptModelNameMock).toHaveBeenCalledWith(
            model.id,
            updatedName
         );
         expect(updatePromptModelMock).toHaveBeenCalledTimes(1);
         expect(updatePromptModelMock).toHaveBeenCalledWith(
            model.id,
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
         message: "Ein Modell mit diesem Namen existiert bereits",
      };
      updatePromptModelMock.mockResolvedValue(result);
      isConflictingPromptModelNameMock.mockResolvedValue(false);

      const onClose = jest.fn();
      const model = dtestData.dPromptModelWithUsage();

      render(
         <UpdateModelDialog model={model} open={true} onClose={onClose} />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      const updatedName = "model 123";
      await clearInput("name");
      await typeIntoInput("name", updatedName);

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      const expectedPayload = initPromptModel(model);
      expectedPayload.name = updatedName;

      await waitFor(() => {
         expect(isConflictingPromptModelNameMock).toHaveBeenCalledTimes(1);
         expect(isConflictingPromptModelNameMock).toHaveBeenCalledWith(
            model.id,
            updatedName
         );
         expect(updatePromptModelMock).toHaveBeenCalledTimes(1);
         expect(updatePromptModelMock).toHaveBeenCalledWith(
            model.id,
            expectedPayload
         );
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).not.toHaveBeenCalled();
         expect(onClose).not.toHaveBeenCalled();
      });
   });

   it("submit btn clicked - isConflict true - test", async () => {
      isConflictingPromptModelNameMock.mockResolvedValue(true);

      const onClose = jest.fn();
      const model = dtestData.dPromptModelWithUsage();

      render(
         <UpdateModelDialog model={model} open={true} onClose={onClose} />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      const updatedName = "model 123";
      await clearInput("name");
      await typeIntoInput("name", updatedName);

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      const expectedPayload = initPromptModel(model);
      expectedPayload.name = updatedName;

      await waitFor(() => {
         expect(isConflictingPromptModelNameMock).toHaveBeenCalledTimes(1);
         expect(isConflictingPromptModelNameMock).toHaveBeenCalledWith(
            model.id,
            updatedName
         );
         expect(updatePromptModelMock).not.toHaveBeenCalled();
         expect(onClose).not.toHaveBeenCalled();
      });
   });

   it("submit btn clicked - validation error - test", async () => {
      const onClose = jest.fn();
      const model = dtestData.dPromptModelWithUsage();
      isConflictingPromptModelNameMock.mockResolvedValue(false);

      render(
         <UpdateModelDialog model={model} open={true} onClose={onClose} />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      await clearInput("name");

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(isConflictingPromptModelNameMock).toHaveBeenCalledTimes(1);
         expect(isConflictingPromptModelNameMock).toHaveBeenCalledWith(
            model.id,
            ""
         );
         expect(updatePromptModelMock).not.toHaveBeenCalled();
      });
   });

   it("cancel btn clicked - test", async () => {
      const onClose = jest.fn();
      const model = dtestData.dPromptModelWithUsage();
      render(
         <UpdateModelDialog model={model} open={true} onClose={onClose} />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         expect(isConflictingPromptModelNameMock).not.toHaveBeenCalled();
         expect(updatePromptModelMock).not.toHaveBeenCalled();
         expect(onClose).toHaveBeenCalledTimes(1);
      });
   });
});
