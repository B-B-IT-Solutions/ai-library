import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithReactQuery,
} from "@tests";
import mockRouter from "next-router-mock";

import { PublicPromptItem } from "./prompt-item-public";

const assertRendered = () => {
   const prompt = screen.getByTestId("prompt-item-public");
   const viewDetailsTitle = screen.getByTestId("view-details-link-title");
   const categories = screen.getByTestId("categories");
   const usePromptBtn = screen.getByTestId("public-use-prompt-btn");
   const moreOptionsBtn = screen.getByTestId("more-options-trigger-btn");

   assertInDocument(prompt);
   assertInDocument(viewDetailsTitle);
   assertInDocument(categories);
   assertInDocument(usePromptBtn);
   assertInDocument(moreOptionsBtn);
};

const assertDropdownMenuItemsRendered = () => {
   const viewPromptItem = screen.getByTestId("view-prompt-menu-item");
   const downloadMenuItem = screen.getByTestId("download-prompt-menu-item");

   assertInDocument(viewPromptItem);
   assertInDocument(downloadMenuItem);
};

const assertDropdownMenuItemsNotRendered = () => {
   const viewPromptItem = screen.queryByTestId("view-prompt-menu-item");
   const downloadMenuItem = screen.queryByTestId("download-prompt-menu-item");

   assertNotInDocument(viewPromptItem);
   assertNotInDocument(downloadMenuItem);
};

describe("PromptItem rendering tests", () => {
   it("viewMode grid - rendered test", async () => {
      const prompt = dtestData.dPrompt();

      const { container } = renderWithReactQuery(
         <PublicPromptItem prompt={prompt} collectionToken="public-token-1" />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptItem functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("title - view detail link clicked - test", async () => {
      const prompt = dtestData.dPrompt();
      const collectionToken = "public-token-1";

      renderWithReactQuery(
         <PublicPromptItem prompt={prompt} collectionToken={collectionToken} />
      );

      await waitFor(() => {
         assertRendered();
         assertDropdownMenuItemsNotRendered();
         expect(mockRouter.asPath).toEqual("/");
      });

      const viewDetailsTitle = screen.getByTestId("view-details-link-title");
      userEvent.click(viewDetailsTitle);

      await waitFor(() => {
         expect(mockRouter.asPath).toEqual(
            `/preview/templates/${prompt.id}?col=${collectionToken}`
         );
      });
   });

   it("dropdown - view detail link clicked - test", async () => {
      const prompt = dtestData.dPrompt();

      renderWithReactQuery(<PublicPromptItem prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         assertDropdownMenuItemsNotRendered();
         expect(mockRouter.asPath).toEqual("/");
      });

      const moreOptionsBtn = screen.getByTestId("more-options-trigger-btn");
      userEvent.click(moreOptionsBtn);

      await waitFor(() => {
         assertDropdownMenuItemsRendered();
         expect(mockRouter.asPath).toEqual("/");
      });

      const viewPromptItem = screen.getByTestId("view-prompt-menu-item");
      userEvent.click(viewPromptItem);

      await waitFor(() => {
         expect(mockRouter.asPath).toEqual(`/preview/templates/${prompt.id}`);
      });
   });
});
