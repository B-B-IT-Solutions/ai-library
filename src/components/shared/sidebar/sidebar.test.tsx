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

import { Sidebar } from "./sidebar";

const assertRendered = () => {
   const sidebar = screen.getByTestId("sidebar");
   const sidebarHeader = screen.getByTestId("sidebar-header");
   const sidebarTrigger = screen.getByTestId("sidebar-trigger");
   const sidebarContent = screen.getByTestId("sidebar-content");
   const sidebarFooter = screen.getByTestId("sidebar-footer");

   assertInDocument(sidebar);
   assertInDocument(sidebarHeader);
   assertInDocument(sidebarTrigger);
   assertInDocument(sidebarContent);
   assertInDocument(sidebarFooter);
};

const assertHeader = () => {
   const appName = screen.getByText(APP_NAME);
   const homeLink = screen.getByTestId("home-link");

   assertInDocument(homeLink);
   assertInDocument(appName);
};

const assertMenuItems = () => {
   const groupPrompts = screen.getByTestId("group-prompts");
   const prompts = screen.getByTestId("menu-item-prompts");
   const templates = screen.getByTestId("menu-item-templates");

   const groupLibrary = screen.getByTestId("group-library");
   const explore = screen.getByTestId("menu-item-explore");
   const marketplace = screen.getByTestId("menu-item-marketplace");

   const groupOther = screen.getByTestId("group-other");
   // const feedback = screen.getByTestId("menu-item-feedback");
   // const invitePeople = screen.getByTestId("menu-item-invite-people");
   const settings = screen.getByTestId("menu-item-settings");

   assertInDocument(groupPrompts);
   assertInDocument(prompts);
   assertInDocument(templates);

   assertInDocument(groupLibrary);
   assertInDocument(explore);
   assertInDocument(marketplace);

   assertInDocument(groupOther);
   // assertInDocument(feedback);
   // assertInDocument(invitePeople);
   assertInDocument(settings);
};

const assertMenuItemActive = (id: string, active: boolean) => {
   const link = screen.getByTestId(`menu-item${toTestId(id)}`);
   assertHasAttributeWithValue(link, "data-active", `${active}`);
};

describe("Sidebar rendering tests", () => {
   beforeEach(() => {
      window.matchMedia = ctestData.createMatchMedia(false);
   });

   it("sidebar open - rendered test", async () => {
      const user = dtestData.dLoginUser();
      const url = "/prompts";
      const { container } = renderWithSidebar(<Sidebar user={user} />, url);

      await waitFor(() => {
         assertRendered();
         assertHeader();
         assertMenuItems();
      });

      expect(container).toMatchSnapshot();
   });

   it("sidebar collapsed - rendered test", async () => {
      const user = dtestData.dLoginUser();
      const url = "/prompts";
      const { container } = renderWithSidebar(
         <Sidebar user={user} />,
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

describe("Sidebar functionality tests", () => {
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
      const url = "/settings";
      renderWithSidebar(<Sidebar user={user} />, url);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual(url);
      });

      await assertNavigateToMenuItem("/prompts", "/prompts");
      await assertNavigateToMenuItem("/templates", "/templates");
      await assertNavigateToMenuItem("/explore", "/explore");
      await assertNavigateToMenuItem("/marketplace", "/marketplace");
      // await assertNavigateToMenuItem("/feedback", "/feedback");
      // await assertNavigateToMenuItem("/invite-people", "/invite-people");
      await assertNavigateToMenuItem("/settings", "/settings/general");
   });

   it("active menu item highlighted - test", async () => {
      const user = dtestData.dLoginUser();
      const url = "/settings";
      renderWithSidebar(<Sidebar user={user} />, url);

      await waitFor(() => {
         assertRendered();
         assertMenuItemActive("/settings", true);
         assertMenuItemActive("/prompts", false);
         assertMenuItemActive("/templates", false);
      });
   });

   it("home link clicked - test", async () => {
      const user = dtestData.dLoginUser();
      const url = "/settings";
      renderWithSidebar(<Sidebar user={user} />, url);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual(url);
      });

      const homeLink = screen.getByTestId("home-link");
      await userEvent.click(homeLink);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(`/`);
      });
   });
});
