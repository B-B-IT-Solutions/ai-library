import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";

import { RunWorkflowDialog } from "./run-workflow-dialog";

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("run-workflow-dialog");
   const runner = screen.getByTestId("workflow-runner");
   const expandBtn = screen.getByTestId("expand-btn");
   const closeBtn = screen.getByTestId("close-btn");

   assertInDocument(dialog);
   assertInDocument(runner);
   assertInDocument(expandBtn);
   assertInDocument(closeBtn);
};

describe("RunWorkflowDialog rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("rendered - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();
      const closeFn = jest.fn();

      const { container } = render(
         <RunWorkflowDialog workflow={workflow} onClose={closeFn} />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("RunWorkflowDialog functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("close btn clicked - test", async () => {
      const workflow = dtestData.dWorkflowWithSteps();
      const closeFn = jest.fn();

      render(<RunWorkflowDialog workflow={workflow} onClose={closeFn} />);

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
         expect(closeFn).toHaveBeenCalledTimes(1);
      });
   });
});
