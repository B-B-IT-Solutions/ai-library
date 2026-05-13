jest.mock("@/data/actions/settings");
jest.mock("sonner");

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import { globalPromptFieldInitValues } from "@/components/shared/template-fields";
import { updateGlobalPromptField } from "@/data/actions/settings";
import {
   DGlobalPromptField,
   DGlobalPromptFieldUpdate,
} from "@/data/types/domain/settings";
import { ActionResult } from "@/data/types/utils";

import { GlobalPromptFieldEditDialog } from "./edit-template-field-dialog";

const updateGlobalPromptFieldMock =
   updateGlobalPromptField as jest.MockedFunction<
      typeof updateGlobalPromptField
   >;

const toastMock = toast as jest.MockedFunction<typeof toast>;

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("template-field-edit-dialog");
   const form = screen.getByTestId("template-field-form");
   const cancelBtn = screen.getByTestId("cancel-btn");
   const submitBtn = screen.getByTestId("submit-btn");

   assertInDocument(dialog);
   assertInDocument(form);
   assertInDocument(cancelBtn);
   assertInDocument(submitBtn);
};

const assertDialogNotRendered = () => {
   const dialog = screen.queryByTestId("template-field-edit-dialog");
   assertNotInDocument(dialog);
};

const typeIntoField = async (testId: string, value: string) => {
   const field = screen.getByTestId(testId);
   const input = within(field).getByTestId("input");
   await userEvent.type(input, value);
};

const eraseField = async (testId: string) => {
   const field = screen.getByTestId(testId);
   const input = within(field).getByTestId("input");
   await userEvent.clear(input);
};

describe("GlobalPromptFieldEditDialog rendering tests", () => {
   it("GlobalPromptFieldEditDialog - open true - test", async () => {
      const field = dtestData.dGlobalPromptField();
      const { container } = render(
         <GlobalPromptFieldEditDialog
            field={field}
            open={true}
            onClose={jest.fn()}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("GlobalPromptFieldEditDialog - open false - test", async () => {
      const field = dtestData.dGlobalPromptField();
      const { container } = render(
         <GlobalPromptFieldEditDialog
            field={field}
            open={false}
            onClose={jest.fn()}
         />
      );

      await waitFor(() => {
         assertDialogNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("GlobalPromptFieldEditDialog functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("GlobalPromptFieldEditDialog - submit btn clicked - result.success true - test", async () => {
      const result: ActionResult<DGlobalPromptField> = {
         success: true,
         message: "Feld erstellt",
      };
      updateGlobalPromptFieldMock.mockResolvedValue(result);

      const onClose = jest.fn();
      const field = dtestData.dGlobalPromptField();

      render(
         <GlobalPromptFieldEditDialog
            field={field}
            open={true}
            onClose={onClose}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(updateGlobalPromptFieldMock).not.toHaveBeenCalled();
      });

      await typeIntoField("name", "test-name");
      await typeIntoField("label", "Test Label");

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      const initValues = globalPromptFieldInitValues(field);
      const expectedPayload: DGlobalPromptFieldUpdate = {
         ...initValues,
         name: field.name + "test-name",
         label: field.label + "Test Label",
      };

      await waitFor(() => {
         expect(updateGlobalPromptFieldMock).toHaveBeenCalledTimes(1);
         expect(updateGlobalPromptFieldMock).toHaveBeenCalledWith(
            field.id,
            expectedPayload
         );
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
         expect(onClose).toHaveBeenCalledTimes(1);
      });
   });

   it("GlobalPromptFieldEditDialog - submit btn clicked - result.success false - test", async () => {
      const result: ActionResult<DGlobalPromptField> = {
         success: false,
         message: "Feld konnte nicht erstellt werden",
      };
      updateGlobalPromptFieldMock.mockResolvedValue(result);

      const onClose = jest.fn();
      const field = dtestData.dGlobalPromptField();

      render(
         <GlobalPromptFieldEditDialog
            field={field}
            open={true}
            onClose={onClose}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(updateGlobalPromptFieldMock).not.toHaveBeenCalled();
      });

      await typeIntoField("name", "test-name");
      await typeIntoField("label", "Test Label");

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      const initValues = globalPromptFieldInitValues(field);
      const expectedPayload: DGlobalPromptFieldUpdate = {
         ...initValues,
         name: field.name + "test-name",
         label: field.label + "Test Label",
      };

      await waitFor(() => {
         expect(updateGlobalPromptFieldMock).toHaveBeenCalledTimes(1);
         expect(updateGlobalPromptFieldMock).toHaveBeenCalledWith(
            field.id,
            expectedPayload
         );
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).not.toHaveBeenCalled();
         expect(onClose).not.toHaveBeenCalled();
      });
   });

   it("GlobalPromptFieldEditDialog - cancel btn clicked - test", async () => {
      const onClose = jest.fn();
      const field = dtestData.dGlobalPromptField();
      render(
         <GlobalPromptFieldEditDialog
            field={field}
            open={true}
            onClose={onClose}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(updateGlobalPromptFieldMock).not.toHaveBeenCalled();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         expect(updateGlobalPromptFieldMock).not.toHaveBeenCalled();
         expect(toastMock.success).not.toHaveBeenCalled();
         expect(toastMock.error).not.toHaveBeenCalled();
         expect(onClose).toHaveBeenCalledTimes(1);
      });
   });

   it("GlobalPromptFieldEditDialog - submit btn clicked - validation errors - test", async () => {
      const result: ActionResult<DGlobalPromptField> = {
         success: true,
         message: "Feld erstellt",
      };
      updateGlobalPromptFieldMock.mockResolvedValue(result);

      const onClose = jest.fn();
      const field = dtestData.dGlobalPromptField();

      render(
         <GlobalPromptFieldEditDialog
            field={field}
            open={true}
            onClose={onClose}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(updateGlobalPromptFieldMock).not.toHaveBeenCalled();
      });

      await eraseField("name");

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(updateGlobalPromptFieldMock).not.toHaveBeenCalled();
      });
   });
});
