import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {
   assertHasAttributeWithValue,
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithReactQuery,
} from "@tests";
import mockRouter from "next-router-mock";

import { PublicPromptMoreOptionsButton } from "./prompt-more-options-button-public";

const assertRendered = () => {
   const btn = screen.getByTestId("public-prompt-more-options-btn");
   const triggerBtn = screen.getByTestId("more-options-trigger-btn");

   assertInDocument(btn);
   assertInDocument(triggerBtn);
};

const assertContextMenuRendered = () => {
   const viewBtn = screen.getByTestId("view-prompt-menu-item");
   const downloadBtn = screen.getByTestId("download-prompt-menu-item");

   assertInDocument(viewBtn);
   assertInDocument(downloadBtn);
};

const assertContextMenuNotRendered = () => {
   const viewBtn = screen.queryByTestId("view-prompt-menu-item");
   const downloadBtn = screen.queryByTestId("download-prompt-menu-item");

   assertNotInDocument(viewBtn);
   assertNotInDocument(downloadBtn);
};

const assertDateStateOpen = () => {
   const triggerBtn = screen.getByTestId("more-options-trigger-btn");
   assertHasAttributeWithValue(triggerBtn, "data-state", "open");
};

const assertDateStateClosed = () => {
   const triggerBtn = screen.getByTestId("more-options-trigger-btn");
   assertHasAttributeWithValue(triggerBtn, "data-state", "false");
};

describe("PublicPromptMoreOptionsButton rendering tests", () => {
   it("rendered test", async () => {
      const prompt = dtestData.dPrompt();

      const { container } = renderWithReactQuery(
         <PublicPromptMoreOptionsButton prompt={prompt} />
      );

      await waitFor(() => {
         assertRendered();
         assertContextMenuNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PublicPromptMoreOptionsButton functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("trigger clicked - test", async () => {
      const prompt = dtestData.dPrompt();

      renderWithReactQuery(
         <PublicPromptMoreOptionsButton
            prompt={prompt}
            collectionToken="public-token-1"
         />
      );

      await waitFor(() => {
         assertRendered();
         assertContextMenuNotRendered();
         assertDateStateClosed();
      });

      const triggerBtn = screen.getByTestId("more-options-trigger-btn");
      await userEvent.click(triggerBtn);

      await waitFor(() => {
         assertContextMenuRendered();
         assertDateStateOpen();
      });
   });

   it("view prompt btn clicked - test", async () => {
      const prompt = dtestData.dPrompt();

      renderWithReactQuery(<PublicPromptMoreOptionsButton prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         assertContextMenuNotRendered();
         assertDateStateClosed();
         expect(mockRouter.asPath).toEqual("/");
      });

      const triggerBtn = screen.getByTestId("more-options-trigger-btn");
      await userEvent.click(triggerBtn);

      await waitFor(() => {
         assertContextMenuRendered();
         assertDateStateOpen();
         expect(mockRouter.asPath).toEqual("/");
      });

      const viewBtn = screen.getByTestId("view-prompt-menu-item");
      await userEvent.click(viewBtn);

      await waitFor(() => {
         assertContextMenuNotRendered();
         assertDateStateClosed();
         expect(mockRouter.asPath).toEqual(`/preview/templates/${prompt.id}`);
      });
   });
});
