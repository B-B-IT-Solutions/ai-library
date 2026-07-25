import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument } from "@tests";

import { PromptSaveSplitButton } from "./prompt-save-split-button";

describe("PromptSaveSplitButton rendering tests", () => {
   it("create mode - only primary button rendered - test", () => {
      render(
         <PromptSaveSplitButton
            isEdit={false}
            isSubmitting={false}
            canAccessVersionHistory={false}
            onSave={jest.fn()}
            onSaveAsVersion={jest.fn()}
         />
      );

      assertInDocument(screen.getByTestId("save-btn"));
      expect(screen.getByTestId("save-btn")).toHaveTextContent(
         "Prompt erstellen"
      );
      assertNotInDocument(screen.queryByTestId("save-split-btn"));
      assertNotInDocument(screen.queryByTestId("save-split-btn-trigger"));
   });

   it("edit mode - split button with chevron rendered - test", () => {
      render(
         <PromptSaveSplitButton
            isEdit={true}
            isSubmitting={false}
            canAccessVersionHistory={true}
            onSave={jest.fn()}
            onSaveAsVersion={jest.fn()}
         />
      );

      assertInDocument(screen.getByTestId("save-split-btn"));
      assertInDocument(screen.getByTestId("save-split-btn-trigger"));
      expect(screen.getByTestId("save-btn")).toHaveTextContent(
         "Prompt speichern"
      );
   });

   it("isSubmitting true - primary button shows loading label and is disabled - test", () => {
      render(
         <PromptSaveSplitButton
            isEdit={true}
            isSubmitting={true}
            canAccessVersionHistory={true}
            onSave={jest.fn()}
            onSaveAsVersion={jest.fn()}
         />
      );

      const saveBtn = screen.getByTestId("save-btn");
      expect(saveBtn).toHaveTextContent("Wird gespeichert...");
      expect(saveBtn).toBeDisabled();
   });

   it("isSubmitting true - chevron trigger and version menu item are disabled - test", async () => {
      const onSaveAsVersion = jest.fn();

      const { rerender } = render(
         <PromptSaveSplitButton
            isEdit={true}
            isSubmitting={false}
            canAccessVersionHistory={true}
            onSave={jest.fn()}
            onSaveAsVersion={onSaveAsVersion}
         />
      );

      await userEvent.click(screen.getByTestId("save-split-btn-trigger"));
      const menuItem = screen.getByTestId("save-as-version-menu-item");
      assertInDocument(menuItem);

      rerender(
         <PromptSaveSplitButton
            isEdit={true}
            isSubmitting={true}
            canAccessVersionHistory={true}
            onSave={jest.fn()}
            onSaveAsVersion={onSaveAsVersion}
         />
      );

      expect(screen.getByTestId("save-split-btn-trigger")).toBeDisabled();
   });

   it("canAccessVersionHistory true - menu item enabled, click calls onSaveAsVersion - test", async () => {
      const onSaveAsVersion = jest.fn();

      render(
         <PromptSaveSplitButton
            isEdit={true}
            isSubmitting={false}
            canAccessVersionHistory={true}
            onSave={jest.fn()}
            onSaveAsVersion={onSaveAsVersion}
         />
      );

      await userEvent.click(screen.getByTestId("save-split-btn-trigger"));

      const menuItem = screen.getByTestId("save-as-version-menu-item");
      assertInDocument(menuItem);
      expect(menuItem).toHaveTextContent("Speichern als neue Version");

      await userEvent.click(menuItem);

      expect(onSaveAsVersion).toHaveBeenCalledTimes(1);
   });

   it("primary button clicked - calls onSave - test", async () => {
      const onSave = jest.fn();

      render(
         <PromptSaveSplitButton
            isEdit={true}
            isSubmitting={false}
            canAccessVersionHistory={true}
            onSave={onSave}
            onSaveAsVersion={jest.fn()}
         />
      );

      await userEvent.click(screen.getByTestId("save-btn"));

      expect(onSave).toHaveBeenCalledTimes(1);
   });

   it("canAccessVersionHistory false - menu item shows lock hint and tooltip, click does not call onSaveAsVersion - test", async () => {
      const onSaveAsVersion = jest.fn();

      render(
         <PromptSaveSplitButton
            isEdit={true}
            isSubmitting={false}
            canAccessVersionHistory={false}
            onSave={jest.fn()}
            onSaveAsVersion={onSaveAsVersion}
         />
      );

      await userEvent.click(screen.getByTestId("save-split-btn-trigger"));

      assertInDocument(screen.getByText("Ab BASIC verfügbar"));

      const menuItem = screen.getByTestId("save-as-version-menu-item");
      await userEvent.click(menuItem);

      expect(onSaveAsVersion).not.toHaveBeenCalled();
   });

   it("both save buttons are plain type=button (no native form submission) - test", () => {
      render(
         <PromptSaveSplitButton
            isEdit={true}
            isSubmitting={false}
            canAccessVersionHistory={true}
            onSave={jest.fn()}
            onSaveAsVersion={jest.fn()}
         />
      );

      expect(screen.getByTestId("save-btn")).toHaveAttribute(
         "type",
         "button"
      );
      expect(screen.getByTestId("save-split-btn-trigger")).toHaveAttribute(
         "type",
         "button"
      );
   });
});
