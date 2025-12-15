import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   ctestData,
   renderWithSidebar,
} from "@tests";

import { SidebarFooter } from "./sidebar-footer";

const assertRendered = () => {
   const footer = screen.getByTestId("sidebar-footer");
   const menu = screen.getByTestId("sidebar-footer-menu");

   assertInDocument(footer);
   assertInDocument(menu);
};

const assertMenuItemsRendered = () => {
   const account = screen.getByTestId("account");
   const billing = screen.getByTestId("billing");
   const signOut = screen.getByTestId("sign-out");

   assertInDocument(account);
   assertInDocument(billing);
   assertInDocument(signOut);
};

const assertMenuItemsNotRendered = () => {
   const account = screen.queryByTestId("account");
   const billing = screen.queryByTestId("billing");
   const signOut = screen.queryByTestId("sign-out");

   assertNotInDocument(account);
   assertNotInDocument(billing);
   assertNotInDocument(signOut);
};

describe("SidebarFooter rendering tests", () => {
   beforeEach(() => {
      window.matchMedia = ctestData.createMatchMedia(false);
   });

   it("SidebarFooter - sidebar open - rendered test", async () => {
      const { container } = renderWithSidebar(<SidebarFooter />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("SidebarFooter - sidebar collapsed - rendered test", async () => {
      const { container } = renderWithSidebar(<SidebarFooter />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("Sidebar functionality tests", () => {
   beforeEach(() => {
      window.matchMedia = ctestData.createMatchMedia(false);
   });

   it("Sidebar - navigation - test", async () => {
      renderWithSidebar(<SidebarFooter />);

      await waitFor(() => {
         assertRendered();
         assertMenuItemsNotRendered();
      });

      const menu = screen.getByTestId("sidebar-footer-menu");
      userEvent.click(menu);

      await waitFor(() => {
         assertMenuItemsRendered();
      });
   });
});
