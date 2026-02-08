import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";

import { DPromptTemplateFieldValues } from "@/data/types/domain/prompt.template";

import { CreatePromptDialog } from "./create-prompt-dialog";

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("create-prompt-dialog");
   assertInDocument(dialog);
};

const assertFieldsFormRendered = () => {
   const form = screen.getByTestId("prompt-template-fields-form");
   assertInDocument(form);
};

const assertPromptEditRendered = () => {
   const promptEdit = screen.getByTestId("prompt-edit");
   assertInDocument(promptEdit);
};

describe("CreatePromptDialog rendering tests", () => {
   it("CreatePromptDialog - mode fields-form - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptorWithPrompt();
      const submitFn = jest.fn();
      const cancelFn = jest.fn();

      const { container } = render(
         <CreatePromptDialog
            mode="fields-form"
            descriptor={descriptor}
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

   it("CreatePromptDialog - mode review - test", async () => {
      const promptUpdate = dtestData.dPromptUpdate();
      const submitFn = jest.fn();
      const cancelFn = jest.fn();

      const { container } = render(
         <CreatePromptDialog
            mode="review"
            promptUpdate={promptUpdate}
            onSubmit={submitFn}
            onCancel={cancelFn}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         assertPromptEditRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CreatePromptDialog functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("CreatePromptDialog - mode fields-form - submit clicked - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptorWithPrompt();
      const submitFn = jest.fn();
      const cancelFn = jest.fn();
      const submitFormCallback = async (values: DPromptTemplateFieldValues) => {
         submitFn(values);
      };

      render(
         <CreatePromptDialog
            mode="fields-form"
            descriptor={descriptor}
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
         "field 0": "option 1",
         "field 1": "option 1",
         "field 2": "option 1",
      };
      expect(submitFn).toHaveBeenCalledWith(expectedValues);
      expect(submitFn).toHaveBeenCalledTimes(1);
      expect(cancelFn).not.toHaveBeenCalled();
   });

   it("CreatePromptDialog - mode fields-form - cancel clicked - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptorWithPrompt();
      const submitFn = jest.fn();
      const cancelFn = jest.fn();

      render(
         <CreatePromptDialog
            mode="fields-form"
            descriptor={descriptor}
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

   it("CreatePromptDialog - close bnt clicked - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptorWithPrompt();
      const submitFn = jest.fn();
      const cancelFn = jest.fn();

      render(
         <CreatePromptDialog
            mode="fields-form"
            descriptor={descriptor}
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
