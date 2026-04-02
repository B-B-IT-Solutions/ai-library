import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";

import { CreatePromptDialog } from "./create-prompt-dialog";

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("create-prompt-dialog");
   const promptEditForm = screen.getByTestId("prompt-edit-form");
   const expandBtn = screen.getByTestId("expand-btn");
   const closeBtn = screen.getByTestId("close-btn");

   assertInDocument(dialog);
   assertInDocument(promptEditForm);
   assertInDocument(expandBtn);
   assertInDocument(closeBtn);
};

describe("CreatePromptDialog rendering tests", () => {
   it("rendered test", async () => {
      const promptUpdate = dtestData.dPromptUpdate();
      const cancelFn = jest.fn();

      const { container } = render(
         <CreatePromptDialog promptUpdate={promptUpdate} onCancel={cancelFn} />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CreatePromptDialog functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("close btn clicked - test", async () => {
      const data = dtestData.dPromptUpdate();
      const submitFn = jest.fn();
      const cancelFn = jest.fn();

      render(<CreatePromptDialog promptUpdate={data} onCancel={cancelFn} />);

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

   it("expand btn clicked - test", async () => {
      const data = dtestData.dPromptUpdate();
      const submitFn = jest.fn();
      const cancelFn = jest.fn();

      render(<CreatePromptDialog promptUpdate={data} onCancel={cancelFn} />);

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
         expect(submitFn).not.toHaveBeenCalled();
      });
   });
});
