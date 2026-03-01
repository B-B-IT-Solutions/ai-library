jest.mock("@/data/actions/settings");
jest.mock("sonner");

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument } from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import { globalTemplateFieldInitValues } from "@/components/shared/global-template-fields";
import { createGlobalTemplateField } from "@/data/actions/settings";
import {
   DGlobalTemplateField,
   DGlobalTemplateFieldUpdate,
} from "@/data/types/domain/settings";
import { ActionResult } from "@/data/types/utils";

import { GlobalTemplateFieldAddDialog } from "./add-template-field-dialog";

const createGlobalTemplateFieldMock =
   createGlobalTemplateField as jest.MockedFunction<
      typeof createGlobalTemplateField
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

describe("GlobalTemplateFieldAddDialog rendering tests", () => {
   it("GlobalTemplateFieldAddDialog - open true - test", async () => {
      const { container } = render(
         <GlobalTemplateFieldAddDialog open={true} onClose={jest.fn()} />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("GlobalTemplateFieldAddDialog - open false - test", async () => {
      const { container } = render(
         <GlobalTemplateFieldAddDialog open={false} onClose={jest.fn()} />
      );

      await waitFor(() => {
         assertDialogNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("GlobalTemplateFieldAddDialog functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("GlobalTemplateFieldAddDialog - submit btn clicked - result.success true - test", async () => {
      const result: ActionResult<DGlobalTemplateField> = {
         success: true,
         message: "Feld erstellt",
      };
      createGlobalTemplateFieldMock.mockResolvedValue(result);

      const onClose = jest.fn();
      render(<GlobalTemplateFieldAddDialog open={true} onClose={onClose} />);

      await waitFor(() => {
         assertDialogRendered();
         expect(createGlobalTemplateFieldMock).not.toHaveBeenCalled();
      });

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(createGlobalTemplateFieldMock).not.toHaveBeenCalled();
         expect(onClose).not.toHaveBeenCalled();
      });

      await typeIntoField("name", "test-name");
      await typeIntoField("label", "Test Label");

      await userEvent.click(submitBtn);

      const initValues = globalTemplateFieldInitValues();
      const expectedPayload: DGlobalTemplateFieldUpdate = {
         ...initValues,
         name: "test-name",
         label: "Test Label",
      };

      await waitFor(() => {
         expect(createGlobalTemplateFieldMock).toHaveBeenCalledTimes(1);
         expect(createGlobalTemplateFieldMock).toHaveBeenCalledWith(
            expectedPayload
         );
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
         expect(onClose).toHaveBeenCalledTimes(1);
      });
   });

   it("GlobalTemplateFieldAddDialog - submit btn clicked - result.success false - test", async () => {
      const result: ActionResult<DGlobalTemplateField> = {
         success: false,
         message: "Feld konnte nicht erstellt werden",
      };
      createGlobalTemplateFieldMock.mockResolvedValue(result);

      const onClose = jest.fn();
      render(<GlobalTemplateFieldAddDialog open={true} onClose={onClose} />);

      await waitFor(() => {
         assertDialogRendered();
         expect(createGlobalTemplateFieldMock).not.toHaveBeenCalled();
      });

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(createGlobalTemplateFieldMock).not.toHaveBeenCalled();
         expect(onClose).not.toHaveBeenCalled();
      });

      await typeIntoField("name", "test-name");
      await typeIntoField("label", "Test Label");

      await userEvent.click(submitBtn);

      const initValues = globalTemplateFieldInitValues();
      const expectedPayload: DGlobalTemplateFieldUpdate = {
         ...initValues,
         name: "test-name",
         label: "Test Label",
      };

      await waitFor(() => {
         expect(createGlobalTemplateFieldMock).toHaveBeenCalledTimes(1);
         expect(createGlobalTemplateFieldMock).toHaveBeenCalledWith(
            expectedPayload
         );
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).not.toHaveBeenCalled();
         expect(onClose).not.toHaveBeenCalled();
      });
   });

   it("GlobalTemplateFieldAddDialog - cancel btn clicked - test", async () => {
      const onClose = jest.fn();
      render(<GlobalTemplateFieldAddDialog open={true} onClose={onClose} />);

      await waitFor(() => {
         assertDialogRendered();
         expect(createGlobalTemplateFieldMock).not.toHaveBeenCalled();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         expect(createGlobalTemplateFieldMock).not.toHaveBeenCalled();
         expect(toastMock.success).not.toHaveBeenCalled();
         expect(toastMock.error).not.toHaveBeenCalled();
         expect(onClose).toHaveBeenCalledTimes(1);
      });
   });
});
