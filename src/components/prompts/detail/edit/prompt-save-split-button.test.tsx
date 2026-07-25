import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument } from "@tests";

import { PromptSaveSplitButton } from "./prompt-save-split-button";

describe("PromptSaveSplitButton rendering tests", () => {
   it("create mode - only primary button rendered - test", () => {
      render(
         <PromptSaveSplitButton
            formId="test-form"
            isEdit={false}
            isSubmitting={false}
            canAccessVersionHistory={false}
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
            formId="test-form"
            isEdit={true}
            isSubmitting={false}
            canAccessVersionHistory={true}
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
            formId="test-form"
            isEdit={true}
            isSubmitting={true}
            canAccessVersionHistory={true}
         />
      );

      const saveBtn = screen.getByTestId("save-btn");
      expect(saveBtn).toHaveTextContent("Wird gespeichert...");
      expect(saveBtn).toBeDisabled();
   });

   it("canAccessVersionHistory true - menu item enabled, click submits hidden version button - test", async () => {
      render(
         <PromptSaveSplitButton
            formId="test-form"
            isEdit={true}
            isSubmitting={false}
            canAccessVersionHistory={true}
         />
      );

      await userEvent.click(screen.getByTestId("save-split-btn-trigger"));

      const menuItem = screen.getByTestId("save-as-version-menu-item");
      assertInDocument(menuItem);
      expect(menuItem).toHaveTextContent("Speichern als neue Version");

      const hiddenSubmit = screen.getByTestId(
         "save-as-version-submit"
      ) as HTMLButtonElement;
      const clickSpy = jest.spyOn(hiddenSubmit, "click");

      await userEvent.click(menuItem);

      expect(clickSpy).toHaveBeenCalledTimes(1);
   });

   it("canAccessVersionHistory false - menu item shows lock hint and tooltip - test", async () => {
      render(
         <PromptSaveSplitButton
            formId="test-form"
            isEdit={true}
            isSubmitting={false}
            canAccessVersionHistory={false}
         />
      );

      await userEvent.click(screen.getByTestId("save-split-btn-trigger"));

      assertInDocument(screen.getByText("Ab BASIC verfügbar"));
   });

   it("hidden submit button has name=intent value=version and references formId - test", () => {
      render(
         <PromptSaveSplitButton
            formId="my-form-id"
            isEdit={true}
            isSubmitting={false}
            canAccessVersionHistory={true}
         />
      );

      const hiddenSubmit = screen.getByTestId("save-as-version-submit");
      expect(hiddenSubmit).toHaveAttribute("form", "my-form-id");
      expect(hiddenSubmit).toHaveAttribute("name", "intent");
      expect(hiddenSubmit).toHaveAttribute("value", "version");
      expect(hiddenSubmit).toHaveAttribute("type", "submit");
   });

   it("primary submit button has name=intent value=normal and references formId - test", () => {
      render(
         <PromptSaveSplitButton
            formId="my-form-id"
            isEdit={true}
            isSubmitting={false}
            canAccessVersionHistory={true}
         />
      );

      const primarySubmit = screen.getByTestId("save-btn");
      expect(primarySubmit).toHaveAttribute("form", "my-form-id");
      expect(primarySubmit).toHaveAttribute("name", "intent");
      expect(primarySubmit).toHaveAttribute("value", "normal");
      expect(primarySubmit).toHaveAttribute("type", "submit");
   });
});
