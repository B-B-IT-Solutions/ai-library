jest.mock("@/data/actions/user");

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   ctestData,
   dtestData,
   renderWithSidebar,
} from "@tests";

import { signOutUser } from "@/data/actions/user";
import { LoginUser } from "@/data/types/next-auth";

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
      const user = dtestData.dLoginUser();
      const { container } = renderWithSidebar(<SidebarFooter user={user} />);

      await waitFor(() => {
         assertRendered();
         assertMenuItemsNotRendered();
      });

      expect(container).toMatchSnapshot();

      const menuBtn = screen.getByTestId("sidebar-menu-btn");
      userEvent.click(menuBtn);

      await waitFor(() => {
         assertMenuItemsRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("Sidebar functionality tests", () => {
   beforeEach(() => {
      window.matchMedia = ctestData.createMatchMedia(false);
   });

   it("Sidebar - sign out clicked - test", async () => {
      const user: LoginUser = {
         id: "user-id-1",
         name: undefined,
         email: "test1@gmail.com",
      };
      renderWithSidebar(<SidebarFooter user={user} />);

      await waitFor(() => {
         assertRendered();
         expect(signOutUserMock).not.toHaveBeenCalled();
      });

      const menuBtn = screen.getByTestId("sidebar-menu-btn");
      userEvent.click(menuBtn);

      await waitFor(() => {
         assertMenuItemsRendered();
         expect(signOutUserMock).not.toHaveBeenCalled();
      });

      const singOutItem = screen.getByTestId("sign-out");
      userEvent.click(singOutItem);

      await waitFor(() => {
         assertMenuItemsRendered();
         expect(signOutUserMock).toHaveBeenCalledTimes(1);
      });
   });
});
