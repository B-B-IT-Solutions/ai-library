import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";

import { CreatePromptPreviewDialog } from "./create-prompt-preview-dialog";

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("create-prompt-dialog");
   const promptEdit = screen.getByTestId("prompt-edit");

   assertInDocument(dialog);
   assertInDocument(promptEdit);
};

describe("CreatePromptPreviewDialog rendering tests", () => {
   it("CreatePromptPreviewDialog render test", async () => {
      const promptUpdate = dtestData.dPromptUpdate();
      const cancelFn = jest.fn();

      const { container } = render(
         <CreatePromptPreviewDialog
            promptUpdate={promptUpdate}
            onCancel={cancelFn}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CreatePromptPreviewDialog functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("CreatePromptPreviewDialog - close bnt clicked - test", async () => {
      const data = dtestData.dPromptUpdate();
      const submitFn = jest.fn();
      const cancelFn = jest.fn();

      render(
         <CreatePromptPreviewDialog promptUpdate={data} onCancel={cancelFn} />
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
