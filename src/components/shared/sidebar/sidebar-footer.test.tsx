jest.mock("@/data/actions/user");

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   ctestData,
   ntestData,
   renderWithSidebar,
} from "@tests";

import { signOutUser } from "@/data/actions/user";

import { SidebarFooter } from "./sidebar-footer";

const signOutUserMock = signOutUser as jest.MockedFunction<typeof signOutUser>;

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
      const user = ntestData.user();
      const { container } = renderWithSidebar(<SidebarFooter user={user} />);

      await waitFor(() => {
         assertRendered();
         assertMenuItemsRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("SidebarFooter - sidebar collapsed - rendered test", async () => {
      const { container } = renderWithSidebar(
         <SidebarFooter user={undefined} />
      );

      await waitFor(() => {
         assertRendered();
         assertMenuItemsNotRendered();
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
         assertMenuItemsRendered();
         expect(signOutUserMock).not.toHaveBeenCalled();
      });

      const singOutItem = screen.getByTestId("sign-out");
      userEvent.click(singOutItem);

      await waitFor(() => {
         expect(signOutUserMock).toHaveBeenCalledTimes(1);
      });
   });
});
