import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertHasAttributeWithValue,
   assertInDocument,
   ctestData,
   dtestData,
   renderWithSidebar,
} from "@tests";
import mockRouter from "next-router-mock";

import { APP_NAME } from "@/lib/constants";
import { toTestId } from "@/lib/utils";

import { AdminSidebar } from "./admin-sidebar";

const assertRendered = () => {
   const sidebar = screen.getByTestId("admin-sidebar");
   const sidebarHeader = screen.getByTestId("sidebar-header");
   const sidebarTrigger = screen.getByTestId("sidebar-trigger");
   const sidebarContent = screen.getByTestId("sidebar-content");

   assertInDocument(sidebar);
   assertInDocument(sidebarHeader);
   assertInDocument(sidebarTrigger);
   assertInDocument(sidebarContent);
};

const assertMenuItems = () => {
   const groupAdministration = screen.getByTestId("group-administration");
   const dashboard = screen.getByTestId("menu-item-admin-dashboard");
   const users = screen.getByTestId("menu-item-admin-users");
   const plans = screen.getByTestId("menu-item-admin-subscription-plans");

   const groupOther = screen.getByTestId("group-other");
   const back = screen.getByTestId("menu-item-");

   assertInDocument(groupAdministration);
   assertInDocument(dashboard);
   assertInDocument(users);
   assertInDocument(plans);

   assertInDocument(groupOther);
   assertInDocument(back);
};

const assertMenuItemActive = (id: string, active: boolean) => {
   const link = screen.getByTestId(`menu-item${toTestId(id)}`);
   assertHasAttributeWithValue(link, "data-active", `${active}`);
};

describe("AdminSidebar rendering tests", () => {
   beforeEach(() => {
      window.matchMedia = ctestData.createMatchMedia(false);
   });

   it("open true - test", async () => {
      const user = dtestData.dLoginUser();
      const url = "/admin";
      const { container } = renderWithSidebar(
         <AdminSidebar user={user} />,
         url,
         true
      );

      await waitFor(() => {
         assertRendered();
         assertMenuItems();
      });

      expect(container).toMatchSnapshot();
   });

   it("open false - test", async () => {
      const user = dtestData.dLoginUser();
      const url = "/admin";
      const { container } = renderWithSidebar(
         <AdminSidebar user={user} />,
         url,
         false
      );

      await waitFor(() => {
         assertRendered();
         assertMenuItems();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("AdminSidebar functionality tests", () => {
   beforeEach(() => {
      window.matchMedia = ctestData.createMatchMedia(false);
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   const assertNavigateToMenuItem = async (id: string, url: string) => {
      const link = screen.getByTestId(`menu-item${toTestId(id)}`);
      await userEvent.click(link);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(url);
      });
   };

   it("navigation - test", async () => {
      const user = dtestData.dLoginUser();
      const url = "/admin/dashboard";
      renderWithSidebar(<AdminSidebar user={user} />, url);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual(url);
      });

      await assertNavigateToMenuItem("/admin/dashboard", "/admin/dashboard");
      await assertNavigateToMenuItem("/admin/users", "/admin/users");
      await assertNavigateToMenuItem(
         "/admin/subscription-plans",
         "/admin/subscription-plans"
      );
      await assertNavigateToMenuItem("/", "/");
   });

   it("active menu item highlighted - test", async () => {
      const user = dtestData.dLoginUser();
      const url = "/admin/dashboard";
      renderWithSidebar(<AdminSidebar user={user} />, url);

      await waitFor(() => {
         assertRendered();
         assertMenuItemActive("/admin/dashboard", true);
         assertMenuItemActive("/admin/users", false);
         assertMenuItemActive("/admin/subscription-plans", false);
      });
   });
});
