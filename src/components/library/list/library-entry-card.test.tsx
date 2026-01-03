import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";
import mockRouter from "next-router-mock";

import { LibraryEntryCard } from "./library-entry-card";

const assertRendered = () => {
   const entryCard = screen.getByTestId("library-entry-card");
   const categories = screen.getByTestId("categories");
   const createPromptBtn = screen.getByTestId("create-prompt-btn");
   const dropdownMenuBtn = screen.getByTestId("dropdown-menu-btn");

   assertInDocument(entryCard);
   assertInDocument(categories);
   assertInDocument(createPromptBtn);
   assertInDocument(dropdownMenuBtn);
};

const assertDropdownMenuItemsRendered = () => {
   const viewDetailsLink = screen.getByTestId("view-details-link");
   const downloadMenuItem = screen.getByTestId("download-template-menu-item");

   assertInDocument(viewDetailsLink);
   assertInDocument(downloadMenuItem);
};

const assertDropdownMenuItemsNotRendered = () => {
   const viewDetailsLink = screen.queryByTestId("view-details-link");
   const downloadMenuItem = screen.queryByTestId("download-template-menu-item");

   assertNotInDocument(viewDetailsLink);
   assertNotInDocument(downloadMenuItem);
};

describe("LibraryEntryCard rendering tests", () => {
   it("LibraryEntryCard - viewMode grid - rendered test", async () => {
      const entry = dtestData.dLibraryEntry();

      const { container } = render(<LibraryEntryCard entry={entry} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("LibraryEntryCard functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      mockRouter.push("/");
   });

   it("LibraryEntryCard - view detail link clicked - test", async () => {
      const entry = dtestData.dLibraryEntry();

      render(<LibraryEntryCard entry={entry} />);

      await waitFor(() => {
         assertRendered();
         assertDropdownMenuItemsNotRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const dropdownMenuBtn = screen.getByTestId("dropdown-menu-btn");
      userEvent.click(dropdownMenuBtn);

      await waitFor(() => {
         assertDropdownMenuItemsRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const viewDetailsLink = screen.getByTestId("view-details-link");
      userEvent.click(viewDetailsLink);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(`/library/${entry.id}`);
      });
   });
});
