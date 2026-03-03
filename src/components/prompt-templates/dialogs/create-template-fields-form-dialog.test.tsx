import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";

import { DPromptTemplateFieldValues } from "@/data/types/domain/prompt.template";

import { CreateTemplateFieldsFormDialog } from "./create-template-fields-form-dialog";

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("create-prompt-dialog");
   assertInDocument(dialog);
};

const assertFieldsFormRendered = () => {
   const form = screen.getByTestId("template-fields-form");
   assertInDocument(form);
};

describe("CreateTemplateFieldsFormDialog rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("CreateTemplateFieldsFormDialog - mode fields-form - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();
      const templateData = dtestData.dPromptTemplateDataPromptGeneration();
      const submitFn = jest.fn();
      const cancelFn = jest.fn();

      const { container } = render(
         <CreateTemplateFieldsFormDialog
            descriptor={descriptor}
            templateData={templateData}
            onSubmit={submitFn}
            onCancel={cancelFn}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         assertFieldsFormRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CreateTemplateFieldsFormDialog functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("CreateTemplateFieldsFormDialog - submit clicked - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();
      const templateData = dtestData.dPromptTemplateDataPromptGeneration();
      const submitFn = jest.fn();
      const cancelFn = jest.fn();
      const submitFormCallback = async (values: DPromptTemplateFieldValues) => {
         submitFn(values);
      };

      render(
         <CreateTemplateFieldsFormDialog
            descriptor={descriptor}
            templateData={templateData}
            onSubmit={submitFormCallback}
            onCancel={cancelFn}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         assertFieldsFormRendered();
      });

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      const expectedValues: DPromptTemplateFieldValues = {
         field_0: "option 1",
         field_1: "option 1",
         field_2: "option 1",
         name_0: "defaultValue-0",
         name_1: "defaultValue-1",
         name_2: "defaultValue-2",
      };
      expect(submitFn).toHaveBeenCalledTimes(1);
      expect(submitFn).toHaveBeenCalledWith(expectedValues);
      expect(cancelFn).not.toHaveBeenCalled();
   });

   it("CreateTemplateFieldsFormDialog - cancel clicked - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();
      const templateData = dtestData.dPromptTemplateDataPromptGeneration();
      const submitFn = jest.fn();
      const cancelFn = jest.fn();

      render(
         <CreateTemplateFieldsFormDialog
            descriptor={descriptor}
            templateData={templateData}
            onSubmit={submitFn}
            onCancel={cancelFn}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         assertFieldsFormRendered();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         expect(cancelFn).toHaveBeenCalledTimes(1);
         expect(submitFn).not.toHaveBeenCalled();
      });
   });

   it("CreateTemplateFieldsFormDialog - close btn clicked - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();
      const templateData = dtestData.dPromptTemplateDataPromptGeneration();
      const submitFn = jest.fn();
      const cancelFn = jest.fn();

      render(
         <CreateTemplateFieldsFormDialog
            descriptor={descriptor}
            templateData={templateData}
            onSubmit={submitFn}
            onCancel={cancelFn}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         assertFieldsFormRendered();
      });

      const closeBtn = screen.getByTestId("close-btn");
      await userEvent.click(closeBtn);

      await waitFor(() => {
         expect(cancelFn).toHaveBeenCalledTimes(1);
         expect(submitFn).not.toHaveBeenCalled();
      });
   });
});
