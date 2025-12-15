import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, ctestData, renderWithSidebar } from "@tests";

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
         assertMenuItems();
      });
   });
});
