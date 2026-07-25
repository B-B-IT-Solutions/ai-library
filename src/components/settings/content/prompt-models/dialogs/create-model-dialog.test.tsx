jest.mock("@/data/actions/prompt");
jest.mock("sonner");

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   typeIntoInput,
} from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import {
   createPromptModel,
   isConflictingPromptModelName,
} from "@/data/actions/prompt";
import { ActionResult } from "@/data/types/utils";
import { initPromptModel } from "../utils";

import { CreateModelDialog } from "./create-model-dialog";

const createPromptModelMock = createPromptModel as jest.MockedFunction<
   typeof createPromptModel
>;

const isConflictingPromptModelNameMock =
   isConflictingPromptModelName as jest.MockedFunction<
      typeof isConflictingPromptModelName
   >;

const toastMock = toast as jest.MockedFunction<typeof toast>;

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("create-model-dialog");
   const cancelBtn = screen.getByTestId("cancel-btn");
   const submitBtn = screen.getByTestId("submit-btn");

   assertInDocument(dialog);
   assertInDocument(cancelBtn);
   assertInDocument(submitBtn);
};

const assertDialogNotRendered = () => {
   const dialog = screen.queryByTestId("create-model-dialog");
   assertNotInDocument(dialog);
};

describe("CreateModelDialog rendering tests", () => {
   it("open true - test", async () => {
      const { container } = render(
         <CreateModelDialog open={true} onClose={jest.fn()} />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("open false - test", async () => {
      render(<CreateModelDialog open={false} onClose={jest.fn()} />);

      await waitFor(() => {
         assertDialogNotRendered();
      });
   });
});

describe("CreateModelDialog functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("submit btn clicked - result.success true - test", async () => {
      const model = dtestData.dPromptModelWithUsage();
      const result: ActionResult = {
         success: true,
         message: "Modell erfolgreich erstellt",
      };
      createPromptModelMock.mockResolvedValue(result);
      isConflictingPromptModelNameMock.mockResolvedValue(false);

      const onCloseFn = jest.fn();

      render(<CreateModelDialog open={true} onClose={onCloseFn} />);

      await waitFor(() => {
         assertDialogRendered();
         expect(createPromptModelMock).not.toHaveBeenCalled();
      });

      await typeIntoInput("name", model.name);

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      const expectedPayload = initPromptModel(model);

      await waitFor(() => {
         expect(isConflictingPromptModelNameMock).toHaveBeenCalledTimes(1);
         expect(isConflictingPromptModelNameMock).toHaveBeenCalledWith(
            undefined,
            model.name
         );
         expect(createPromptModelMock).toHaveBeenCalledTimes(1);
         expect(createPromptModelMock).toHaveBeenCalledWith(expectedPayload);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
         expect(onCloseFn).toHaveBeenCalledTimes(1);
      });
   });

   it("submit btn clicked - result.success false - test", async () => {
      const model = dtestData.dPromptModelWithUsage();
      const result: ActionResult = {
         success: false,
         message: "Modell konnte nicht erstellt werden",
      };
      createPromptModelMock.mockResolvedValue(result);
      isConflictingPromptModelNameMock.mockResolvedValue(false);

      const onCloseFn = jest.fn();

      render(<CreateModelDialog open={true} onClose={onCloseFn} />);

      await waitFor(() => {
         assertDialogRendered();
      });

      await typeIntoInput("name", model.name);

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      const expectedPayload = initPromptModel(model);

      await waitFor(() => {
         expect(isConflictingPromptModelNameMock).toHaveBeenCalledTimes(1);
         expect(isConflictingPromptModelNameMock).toHaveBeenCalledWith(
            undefined,
            model.name
         );
         expect(createPromptModelMock).toHaveBeenCalledTimes(1);
         expect(createPromptModelMock).toHaveBeenCalledWith(expectedPayload);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).not.toHaveBeenCalled();
         expect(onCloseFn).not.toHaveBeenCalled();
      });
   });

   it("submit btn clicked - isConflict true - test", async () => {
      isConflictingPromptModelNameMock.mockResolvedValue(true);

      const model = dtestData.dPromptModelWithUsage();
      const onCloseFn = jest.fn();

      render(<CreateModelDialog open={true} onClose={onCloseFn} />);

      await waitFor(() => {
         assertDialogRendered();
      });

      await typeIntoInput("name", model.name);

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(isConflictingPromptModelNameMock).toHaveBeenCalledTimes(1);
         expect(isConflictingPromptModelNameMock).toHaveBeenCalledWith(
            undefined,
            model.name
         );
         expect(createPromptModelMock).not.toHaveBeenCalled();
         expect(onCloseFn).not.toHaveBeenCalled();
      });
   });

   it("submit btn clicked - validation error - test", async () => {
      const onCloseFn = jest.fn();

      render(<CreateModelDialog open={true} onClose={onCloseFn} />);

      await waitFor(() => {
         assertDialogRendered();
      });

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(isConflictingPromptModelNameMock).toHaveBeenCalledTimes(1);
         expect(isConflictingPromptModelNameMock).toHaveBeenCalledWith(
            undefined,
            ""
         );
         expect(createPromptModelMock).not.toHaveBeenCalled();
         expect(onCloseFn).not.toHaveBeenCalled();
      });
   });

   it("cancel btn clicked - test", async () => {
      isConflictingPromptModelNameMock.mockResolvedValue(false);
      const onCloseFn = jest.fn();

      render(<CreateModelDialog open={true} onClose={onCloseFn} />);

      await waitFor(() => {
         assertDialogRendered();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         expect(isConflictingPromptModelNameMock).not.toHaveBeenCalled();
         expect(createPromptModelMock).not.toHaveBeenCalled();
         expect(onCloseFn).toHaveBeenCalledTimes(1);
      });
   });
});
