import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";

import { DPromptTemplateFieldValues } from "@/data/types/domain/prompt.template";

import { CreatePromptFromTemplateDialog } from "./create-prompt-from-template-dialog";

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("create-prompt-dialog");
   const promptFromTemplate = screen.getByTestId("prompt-from-tempalte");

   assertInDocument(dialog);
   assertInDocument(promptFromTemplate);
};

describe("CreatePromptFromTemplateDialog rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("CreatePromptFromTemplateDialog - mode fields-form - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();
      const templateData = dtestData.dPromptTemplateDataPromptGeneration();
      const submitFn = jest.fn();
      const cancelFn = jest.fn();

      const { container } = render(
         <CreatePromptFromTemplateDialog
            descriptor={descriptor}
            templateData={templateData}
            onSubmit={submitFn}
            onCancel={cancelFn}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CreatePromptFromTemplateDialog functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("CreatePromptFromTemplateDialog - submit clicked - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();
      const templateData = dtestData.dPromptTemplateDataPromptGeneration();
      const submitFn = jest.fn();
      const cancelFn = jest.fn();
      const submitFormCallback = async (values: DPromptTemplateFieldValues) => {
         submitFn(values);
      };

      render(
         <CreatePromptFromTemplateDialog
            descriptor={descriptor}
            templateData={templateData}
            onSubmit={submitFormCallback}
            onCancel={cancelFn}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      const expectedValues: DPromptTemplateFieldValues = {
         field_0: "option 1",
         field_1: "option 1",
         field_2: "option 1",
      };

      expect(submitFn).toHaveBeenCalledTimes(1);
      expect(submitFn).toHaveBeenCalledWith(expectedValues);
      expect(cancelFn).not.toHaveBeenCalled();
   });

   it("CreatePromptFromTemplateDialog - close btn clicked - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();
      const templateData = dtestData.dPromptTemplateDataPromptGeneration();
      const submitFn = jest.fn();
      const cancelFn = jest.fn();

      render(
         <CreatePromptFromTemplateDialog
            descriptor={descriptor}
            templateData={templateData}
            onSubmit={submitFn}
            onCancel={cancelFn}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      const closeBtn = screen.getByTestId("close-btn");
      await userEvent.click(closeBtn);

      await waitFor(() => {
         expect(cancelFn).toHaveBeenCalledTimes(1);
         expect(submitFn).not.toHaveBeenCalled();
      });
   });
});
