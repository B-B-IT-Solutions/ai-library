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
import mockRouter from "next-router-mock";

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
   const signOut = screen.getByTestId("sign-out");

   assertInDocument(account);
   assertInDocument(signOut);
};

const assertMenuItemsNotRendered = () => {
   const account = screen.queryByTestId("account");
   const signOut = screen.queryByTestId("sign-out");

   assertNotInDocument(account);
   assertNotInDocument(signOut);
};

describe("SidebarFooter rendering tests", () => {
   beforeEach(() => {
      window.matchMedia = ctestData.createMatchMedia(false);
   });

   it("sidebar open - rendered test", async () => {
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
      mockRouter.push("/");
   });

   it("account btn clicked - test", async () => {
      const user: LoginUser = {
         id: "user-id-1",
         name: undefined,
         email: "test1@gmail.com",
      };
      renderWithSidebar(<SidebarFooter user={user} />);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const menuBtn = screen.getByTestId("sidebar-menu-btn");
      userEvent.click(menuBtn);

      await waitFor(() => {
         assertMenuItemsRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const account = screen.getByTestId("account");
      userEvent.click(account);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/settings/general");
      });
   });

   it("sign out clicked - test", async () => {
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

      const singOut = screen.getByTestId("sign-out");
      userEvent.click(singOut);

      await waitFor(() => {
         expect(signOutUserMock).toHaveBeenCalledTimes(1);
      });
   });
});
