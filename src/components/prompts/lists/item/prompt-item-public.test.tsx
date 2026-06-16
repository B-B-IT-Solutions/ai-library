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
   const dropdownMenuBtn = screen.getByTestId("dropdown-menu-btn");

   assertInDocument(prompt);
   assertInDocument(viewDetailsTitle);
   assertInDocument(categories);
   assertInDocument(usePromptBtn);
   assertInDocument(dropdownMenuBtn);
};

const assertDropdownMenuItemsRendered = () => {
   const viewDetailsLink = screen.getByTestId("view-details-link");
   const downloadMenuItem = screen.getByTestId("download-prompt-menu-item");

   assertInDocument(viewDetailsLink);
   assertInDocument(downloadMenuItem);
};

const assertDropdownMenuItemsNotRendered = () => {
   const viewDetailsLink = screen.queryByTestId("view-details-link");
   const downloadMenuItem = screen.queryByTestId("download-prompt-menu-item");

   assertNotInDocument(viewDetailsLink);
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

      const dropdownMenuBtn = screen.getByTestId("dropdown-menu-btn");
      userEvent.click(dropdownMenuBtn);

      await waitFor(() => {
         assertDropdownMenuItemsRendered();
         expect(mockRouter.asPath).toEqual("/");
      });

      const viewDetailsLink = screen.getByTestId("view-details-link");
      userEvent.click(viewDetailsLink);

      await waitFor(() => {
         expect(mockRouter.asPath).toEqual(`/preview/templates/${prompt.id}`);
      });
   });
});
