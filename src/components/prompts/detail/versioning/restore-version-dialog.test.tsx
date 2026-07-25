import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";

import { RestoreVersionDialog } from "./restore-version-dialog";

describe("RestoreVersionDialog rendering tests", () => {
   it("no missing variables - warning not rendered - test", () => {
      const version = dtestData.dPromptVersionSummary();

      render(
         <RestoreVersionDialog
            version={version}
            missingVariables={[]}
            open={true}
            onOpenChange={jest.fn()}
            onConfirm={jest.fn()}
         />
      );

      assertInDocument(screen.getByTestId("restore-version-dialog"));
      expect(
         screen.queryByTestId("variable-mismatch-warning")
      ).not.toBeInTheDocument();
      expect(
         screen.getByTestId("keep-current-as-version-checkbox")
      ).toBeChecked();
   });

   it("missing variables - warning rendered with names - test", () => {
      const version = dtestData.dPromptVersionSummary();

      render(
         <RestoreVersionDialog
            version={version}
            missingVariables={["alte_variable", "andere_variable"]}
            open={true}
            onOpenChange={jest.fn()}
            onConfirm={jest.fn()}
         />
      );

      const warning = screen.getByTestId("variable-mismatch-warning");
      expect(warning).toHaveTextContent("{{alte_variable}}");
      expect(warning).toHaveTextContent("{{andere_variable}}");
   });

   it("cancel clicked - onOpenChange(false) called, onConfirm not called - test", async () => {
      const version = dtestData.dPromptVersionSummary();
      const onOpenChange = jest.fn();
      const onConfirm = jest.fn();

      render(
         <RestoreVersionDialog
            version={version}
            missingVariables={[]}
            open={true}
            onOpenChange={onOpenChange}
            onConfirm={onConfirm}
         />
      );

      await userEvent.click(screen.getByTestId("cancel-btn"));

      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(onConfirm).not.toHaveBeenCalled();
   });

   it("confirm clicked - onConfirm called with checkbox state (default true) - test", async () => {
      const version = dtestData.dPromptVersionSummary();
      const onConfirm = jest.fn().mockResolvedValue(undefined);

      render(
         <RestoreVersionDialog
            version={version}
            missingVariables={[]}
            open={true}
            onOpenChange={jest.fn()}
            onConfirm={onConfirm}
         />
      );

      await userEvent.click(screen.getByTestId("confirm-restore-btn"));

      await waitFor(() => {
         expect(onConfirm).toHaveBeenCalledWith(true);
      });
   });

   it("checkbox unchecked - confirm calls onConfirm with false - test", async () => {
      const version = dtestData.dPromptVersionSummary();
      const onConfirm = jest.fn().mockResolvedValue(undefined);

      render(
         <RestoreVersionDialog
            version={version}
            missingVariables={[]}
            open={true}
            onOpenChange={jest.fn()}
            onConfirm={onConfirm}
         />
      );

      await userEvent.click(
         screen.getByTestId("keep-current-as-version-checkbox")
      );
      await userEvent.click(screen.getByTestId("confirm-restore-btn"));

      await waitFor(() => {
         expect(onConfirm).toHaveBeenCalledWith(false);
      });
   });

   it("title includes version number - test", () => {
      const version = dtestData.dPromptVersionSummary(4);

      render(
         <RestoreVersionDialog
            version={version}
            missingVariables={[]}
            open={true}
            onOpenChange={jest.fn()}
            onConfirm={jest.fn()}
         />
      );

      assertInDocument(screen.getByText("Version 4 wiederherstellen?"));
   });
});
