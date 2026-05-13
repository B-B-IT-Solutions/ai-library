jest.mock("@/data/actions/settings");
jest.mock("sonner");

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument } from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import { globalPromptFieldInitValues } from "@/components/shared/template-fields";
import { createGlobalPromptField } from "@/data/actions/settings";
import {
   DGlobalPromptField,
   DGlobalPromptFieldUpdate,
} from "@/data/types/domain/settings";
import { ActionResult } from "@/data/types/utils";

import { GlobalPromptFieldAddDialog } from "./add-template-field-dialog";

const createGlobalPromptFieldMock =
   createGlobalPromptField as jest.MockedFunction<
      typeof createGlobalPromptField
   >;

const toastMock = toast as jest.MockedFunction<typeof toast>;

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("template-field-add-dialog");
   const form = screen.getByTestId("template-field-form");
   const cancelBtn = screen.getByTestId("cancel-btn");
   const submitBtn = screen.getByTestId("submit-btn");

   assertInDocument(dialog);
   assertInDocument(form);
   assertInDocument(cancelBtn);
   assertInDocument(submitBtn);
};

const assertDialogNotRendered = () => {
   const dialog = screen.queryByTestId("template-field-add-dialog");
   assertNotInDocument(dialog);
};

const typeIntoField = async (testId: string, value: string) => {
   const field = screen.getByTestId(testId);
   const input = within(field).getByTestId("input");
   await userEvent.type(input, value);
};

describe("GlobalPromptFieldAddDialog rendering tests", () => {
   it("GlobalPromptFieldAddDialog - open true - test", async () => {
      const { container } = render(
         <GlobalPromptFieldAddDialog open={true} onClose={jest.fn()} />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("GlobalPromptFieldAddDialog - open false - test", async () => {
      const { container } = render(
         <GlobalPromptFieldAddDialog open={false} onClose={jest.fn()} />
      );

      await waitFor(() => {
         assertDialogNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("GlobalPromptFieldAddDialog functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("GlobalPromptFieldAddDialog - submit btn clicked - result.success true - test", async () => {
      const result: ActionResult<DGlobalPromptField> = {
         success: true,
         message: "Feld erstellt",
      };
      createGlobalPromptFieldMock.mockResolvedValue(result);

      const onClose = jest.fn();
      render(<GlobalPromptFieldAddDialog open={true} onClose={onClose} />);

      await waitFor(() => {
         assertDialogRendered();
         expect(createGlobalPromptFieldMock).not.toHaveBeenCalled();
      });

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(createGlobalPromptFieldMock).not.toHaveBeenCalled();
         expect(onClose).not.toHaveBeenCalled();
      });

      await typeIntoField("name", "test-name");
      await typeIntoField("label", "Test Label");

      await userEvent.click(submitBtn);

      const initValues = globalPromptFieldInitValues();
      const expectedPayload: DGlobalPromptFieldUpdate = {
         ...initValues,
         name: "test-name",
         label: "Test Label",
      };

      await waitFor(() => {
         expect(createGlobalPromptFieldMock).toHaveBeenCalledTimes(1);
         expect(createGlobalPromptFieldMock).toHaveBeenCalledWith(
            expectedPayload
         );
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
         expect(onClose).toHaveBeenCalledTimes(1);
      });
   });

   it("GlobalPromptFieldAddDialog - submit btn clicked - result.success false - test", async () => {
      const result: ActionResult<DGlobalPromptField> = {
         success: false,
         message: "Feld konnte nicht erstellt werden",
      };
      createGlobalPromptFieldMock.mockResolvedValue(result);

      const onClose = jest.fn();
      render(<GlobalPromptFieldAddDialog open={true} onClose={onClose} />);

      await waitFor(() => {
         assertDialogRendered();
         expect(createGlobalPromptFieldMock).not.toHaveBeenCalled();
      });

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(createGlobalPromptFieldMock).not.toHaveBeenCalled();
         expect(onClose).not.toHaveBeenCalled();
      });

      await typeIntoField("name", "test-name");
      await typeIntoField("label", "Test Label");

      await userEvent.click(submitBtn);

      const initValues = globalPromptFieldInitValues();
      const expectedPayload: DGlobalPromptFieldUpdate = {
         ...initValues,
         name: "test-name",
         label: "Test Label",
      };

      await waitFor(() => {
         expect(createGlobalPromptFieldMock).toHaveBeenCalledTimes(1);
         expect(createGlobalPromptFieldMock).toHaveBeenCalledWith(
            expectedPayload
         );
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).not.toHaveBeenCalled();
         expect(onClose).not.toHaveBeenCalled();
      });
   });

   it("GlobalPromptFieldAddDialog - cancel btn clicked - test", async () => {
      const onClose = jest.fn();
      render(<GlobalPromptFieldAddDialog open={true} onClose={onClose} />);

      await waitFor(() => {
         assertDialogRendered();
         expect(createGlobalPromptFieldMock).not.toHaveBeenCalled();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         expect(createGlobalPromptFieldMock).not.toHaveBeenCalled();
         expect(toastMock.success).not.toHaveBeenCalled();
         expect(toastMock.error).not.toHaveBeenCalled();
         expect(onClose).toHaveBeenCalledTimes(1);
      });
   });
});
