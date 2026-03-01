jest.mock("@/data/actions/settings");
jest.mock("sonner");

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import { globalTemplateFieldInitValues } from "@/components/shared/template-fields";
import { updateGlobalTemplateField } from "@/data/actions/settings";
import {
   DGlobalTemplateField,
   DGlobalTemplateFieldUpdate,
} from "@/data/types/domain/settings";
import { ActionResult } from "@/data/types/utils";

import { GlobalTemplateFieldEditDialog } from "./edit-template-field-dialog";

const updateGlobalTemplateFieldMock =
   updateGlobalTemplateField as jest.MockedFunction<
      typeof updateGlobalTemplateField
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

describe("GlobalTemplateFieldEditDialog rendering tests", () => {
   it("GlobalTemplateFieldEditDialog - open true - test", async () => {
      const field = dtestData.dGlobalTemplateField();
      const { container } = render(
         <GlobalTemplateFieldEditDialog
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

   it("GlobalTemplateFieldEditDialog - open false - test", async () => {
      const field = dtestData.dGlobalTemplateField();
      const { container } = render(
         <GlobalTemplateFieldEditDialog
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

describe("GlobalTemplateFieldEditDialog functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("GlobalTemplateFieldEditDialog - submit btn clicked - result.success true - test", async () => {
      const result: ActionResult<DGlobalTemplateField> = {
         success: true,
         message: "Feld erstellt",
      };
      updateGlobalTemplateFieldMock.mockResolvedValue(result);

      const onClose = jest.fn();
      const field = dtestData.dGlobalTemplateField();

      render(
         <GlobalTemplateFieldEditDialog
            field={field}
            open={true}
            onClose={onClose}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(updateGlobalTemplateFieldMock).not.toHaveBeenCalled();
      });

      await typeIntoField("name", "test-name");
      await typeIntoField("label", "Test Label");

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      const initValues = globalTemplateFieldInitValues(field);
      const expectedPayload: DGlobalTemplateFieldUpdate = {
         ...initValues,
         name: field.name + "test-name",
         label: field.label + "Test Label",
      };

      await waitFor(() => {
         expect(updateGlobalTemplateFieldMock).toHaveBeenCalledTimes(1);
         expect(updateGlobalTemplateFieldMock).toHaveBeenCalledWith(
            field.id,
            expectedPayload
         );
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
         expect(onClose).toHaveBeenCalledTimes(1);
      });
   });

   it("GlobalTemplateFieldEditDialog - submit btn clicked - result.success false - test", async () => {
      const result: ActionResult<DGlobalTemplateField> = {
         success: false,
         message: "Feld konnte nicht erstellt werden",
      };
      updateGlobalTemplateFieldMock.mockResolvedValue(result);

      const onClose = jest.fn();
      const field = dtestData.dGlobalTemplateField();

      render(
         <GlobalTemplateFieldEditDialog
            field={field}
            open={true}
            onClose={onClose}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(updateGlobalTemplateFieldMock).not.toHaveBeenCalled();
      });

      await typeIntoField("name", "test-name");
      await typeIntoField("label", "Test Label");

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      const initValues = globalTemplateFieldInitValues(field);
      const expectedPayload: DGlobalTemplateFieldUpdate = {
         ...initValues,
         name: field.name + "test-name",
         label: field.label + "Test Label",
      };

      await waitFor(() => {
         expect(updateGlobalTemplateFieldMock).toHaveBeenCalledTimes(1);
         expect(updateGlobalTemplateFieldMock).toHaveBeenCalledWith(
            field.id,
            expectedPayload
         );
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).not.toHaveBeenCalled();
         expect(onClose).not.toHaveBeenCalled();
      });
   });

   it("GlobalTemplateFieldEditDialog - cancel btn clicked - test", async () => {
      const onClose = jest.fn();
      const field = dtestData.dGlobalTemplateField();
      render(
         <GlobalTemplateFieldEditDialog
            field={field}
            open={true}
            onClose={onClose}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(updateGlobalTemplateFieldMock).not.toHaveBeenCalled();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         expect(updateGlobalTemplateFieldMock).not.toHaveBeenCalled();
         expect(toastMock.success).not.toHaveBeenCalled();
         expect(toastMock.error).not.toHaveBeenCalled();
         expect(onClose).toHaveBeenCalledTimes(1);
      });
   });

   it("GlobalTemplateFieldEditDialog - submit btn clicked - validation errors - test", async () => {
      const result: ActionResult<DGlobalTemplateField> = {
         success: true,
         message: "Feld erstellt",
      };
      updateGlobalTemplateFieldMock.mockResolvedValue(result);

      const onClose = jest.fn();
      const field = dtestData.dGlobalTemplateField();

      render(
         <GlobalTemplateFieldEditDialog
            field={field}
            open={true}
            onClose={onClose}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(updateGlobalTemplateFieldMock).not.toHaveBeenCalled();
      });

      await eraseField("name");

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(updateGlobalTemplateFieldMock).not.toHaveBeenCalled();
      });
   });
});
