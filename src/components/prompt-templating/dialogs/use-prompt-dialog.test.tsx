import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";

import { UsePromptDialog } from "./use-prompt-dialog";

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("use-prompt-dialog");
   const promptForm = screen.getByTestId("use-prompt-form");
   const expandBtn = screen.getByTestId("expand-btn");
   const closeBtn = screen.getByTestId("close-btn");

   assertInDocument(dialog);
   assertInDocument(promptForm);
   assertInDocument(expandBtn);
   assertInDocument(closeBtn);
};

describe("UsePromptDialog rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("mode fields-form - hasFeilds true - test", async () => {
      const descriptor = dtestData.dPrompt();
      const templateData = dtestData.dPromptTemplatingData();
      const cancelFn = jest.fn();

      const { container } = render(
         <UsePromptDialog
            prompt={descriptor}
            generationData={templateData}
            onCancel={cancelFn}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("mode fields-form - hasFeilds false - test", async () => {
      const descriptor = dtestData.dPrompt();
      const templateData = dtestData.dPromptTemplatingData();
      templateData.allFields = [];
      const cancelFn = jest.fn();

      const { container } = render(
         <UsePromptDialog
            prompt={descriptor}
            generationData={templateData}
            onCancel={cancelFn}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("UsePromptDialog functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("close btn clicked - test", async () => {
      const descriptor = dtestData.dPrompt();
      const templateData = dtestData.dPromptTemplatingData();
      const cancelFn = jest.fn();

      render(
         <UsePromptDialog
            prompt={descriptor}
            generationData={templateData}
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
