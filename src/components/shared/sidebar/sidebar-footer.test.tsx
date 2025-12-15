import { screen, waitFor } from "@testing-library/react";
import {
   assertInDocument,
   ctestData,
   ntestData,
   renderWithSidebar,
} from "@tests";

import { SidebarFooter } from "./sidebar-footer";

const assertRendered = () => {
   const footer = screen.getByTestId("sidebar-footer");
   const menu = screen.getByTestId("sidebar-footer-menu");

   assertInDocument(footer);
   assertInDocument(menu);
};

const assertMenuItems = () => {
   const account = screen.getByTestId("account");
   const billing = screen.getByTestId("billing");
   const signOut = screen.getByTestId("sign-out");

   assertInDocument(account);
   assertInDocument(billing);
   assertInDocument(signOut);
};

describe("SidebarFooter rendering tests", () => {
   beforeEach(() => {
      window.matchMedia = ctestData.createMatchMedia(false);
   });

   it("SidebarFooter - sidebar open - rendered test", async () => {
      const user = ntestData.user();
      const { container } = renderWithSidebar(<SidebarFooter user={user} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("SidebarFooter - sidebar collapsed - rendered test", async () => {
      const user = ntestData.user();
      const { container } = renderWithSidebar(<SidebarFooter user={user} />);

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
      const user = ntestData.user();
      renderWithSidebar(<SidebarFooter user={user} />);

      await waitFor(() => {
         assertRendered();
         assertMenuItems();
      });
   });
});
