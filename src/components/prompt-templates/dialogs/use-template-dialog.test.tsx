import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";

import { UseTemplateDialog } from "./use-template-dialog";

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("use-template-dialog");
   const promptFromTemplate = screen.getByTestId("use-template-form");
   const expandBtn = screen.getByTestId("expand-btn");
   const closeBtn = screen.getByTestId("close-btn");

   assertInDocument(dialog);
   assertInDocument(promptFromTemplate);
   assertInDocument(expandBtn);
   assertInDocument(closeBtn);
};

describe("UseTemplateDialog rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("mode fields-form - hasFeilds true - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();
      const templateData = dtestData.dPromptTemplateDataPromptGeneration();
      const cancelFn = jest.fn();

      const { container } = render(
         <UseTemplateDialog
            descriptor={descriptor}
            templateData={templateData}
            onCancel={cancelFn}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("mode fields-form - hasFeilds false - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();
      const templateData = dtestData.dPromptTemplateDataPromptGeneration();
      templateData.allFields = [];
      const cancelFn = jest.fn();

      const { container } = render(
         <UseTemplateDialog
            descriptor={descriptor}
            templateData={templateData}
            onCancel={cancelFn}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("UseTemplateDialog functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("close btn clicked - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();
      const templateData = dtestData.dPromptTemplateDataPromptGeneration();
      const cancelFn = jest.fn();

      render(
         <UseTemplateDialog
            descriptor={descriptor}
            templateData={templateData}
            onCancel={cancelFn}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      const expandBtn = screen.getByTestId("expand-btn");
      await userEvent.click(expandBtn);

      await waitFor(() => {
         assertDialogRendered();
      });

      const closeBtn = screen.getByTestId("close-btn");
      await userEvent.click(closeBtn);

      await waitFor(() => {
         expect(cancelFn).toHaveBeenCalledTimes(1);
      });
   });
});
