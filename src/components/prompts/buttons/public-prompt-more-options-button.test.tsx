import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {
   assertHasAttributeWithValue,
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithReactQuery,
} from "@tests";

import { PublicPromptMoreOptionsButton } from "./public-prompt-more-options-button";

const assertRendered = () => {
   const btn = screen.getByTestId("public-prompt-more-options-btn");
   const triggerBtn = screen.getByTestId("more-options-trigger-btn");

   assertInDocument(btn);
   assertInDocument(triggerBtn);
};

const assertMenuItemsRendered = () => {
   const viewBtn = screen.getByTestId("view-prompt-menu-item");
   const downloadBtn = screen.getByTestId("download-prompt-menu-item");

   assertInDocument(viewBtn);
   assertInDocument(downloadBtn);
};

const assertMenuItemsNotRendered = () => {
   const viewBtn = screen.queryByTestId("view-prompt-menu-item");
   const downloadBtn = screen.queryByTestId("download-prompt-menu-item");

   assertNotInDocument(viewBtn);
   assertNotInDocument(downloadBtn);
};

describe("PublicPromptMoreOptionsButton rendering tests", () => {
   it("rendered test", async () => {
      const prompt = dtestData.dPrompt();

      const { container } = renderWithReactQuery(
         <PublicPromptMoreOptionsButton prompt={prompt} />
      );

      await waitFor(() => {
         assertRendered();
         assertMenuItemsNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PublicPromptMoreOptionsButton functionality tests", () => {
   it("trigger clicked - menu items visible - test", async () => {
      const prompt = dtestData.dPrompt();

      renderWithReactQuery(
         <PublicPromptMoreOptionsButton
            prompt={prompt}
            collectionToken="public-token-1"
         />
      );

      await waitFor(() => {
         assertRendered();
         assertMenuItemsNotRendered();
         const triggerBtn = screen.getByTestId("more-options-trigger-btn");
         assertHasAttributeWithValue(triggerBtn, "data-state", "false");
      });

      const triggerBtn = screen.getByTestId("more-options-trigger-btn");
      await userEvent.click(triggerBtn);

      await waitFor(() => {
         assertMenuItemsRendered();
         assertHasAttributeWithValue(triggerBtn, "data-state", "open");
      });
   });
});
