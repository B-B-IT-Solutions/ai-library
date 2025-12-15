import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertHasAttributeWithValue,
   assertInDocument,
   ctestData,
   ntestData,
   renderWithSidebar,
} from "@tests";
import mockRouter from "next-router-mock";

import { Sidebar } from "./sidebar";

const assertRendered = () => {
   const sidebar = screen.getByTestId("sidebar");
   const sidebarHeader = screen.getByTestId("sidebar-header");
   const sidebarContent = screen.getByTestId("sidebar-content");
   const sidebarFooter = screen.getByTestId("sidebar-footer");

   assertInDocument(sidebar);
   assertInDocument(sidebarHeader);
   assertInDocument(sidebarContent);
   assertInDocument(sidebarFooter);
};

const assertAppName = (name: string) => {
   const appName = screen.getByText(name);
   assertInDocument(appName);
};

const assertMenuItems = () => {
   const groupApplication = screen.getByText("Application");
   const prompts = screen.getByTestId("menu-item-prompts");
   const templates = screen.getByTestId("menu-item-templates");
   const favorites = screen.getByTestId("menu-item-favorites");

   const groupOther = screen.getByText("Other");
   const feedback = screen.getByTestId("menu-item-feedback");
   const invitePeople = screen.getByTestId("menu-item-invite-people");
   const settings = screen.getByTestId("menu-item-settings");

   assertInDocument(groupApplication);
   assertInDocument(prompts);
   assertInDocument(templates);
   assertInDocument(favorites);

   assertInDocument(groupOther);
   assertInDocument(feedback);
   assertInDocument(invitePeople);
   assertInDocument(settings);
};

const assertMenuItemActive = (menuItem: string, active: boolean) => {
   const settingsLink = screen
      .getByText(menuItem)
      .closest("a") as HTMLAnchorElement;
   assertHasAttributeWithValue(settingsLink, "data-active", `${active}`);
};

describe("Sidebar rendering tests", () => {
   beforeEach(() => {
      window.matchMedia = ctestData.createMatchMedia(false);
   });

   it("Sidebar - sidebar open - rendered test", async () => {
      const user = ntestData.user();
      const url = "/prompts";
      const { container } = renderWithSidebar(<Sidebar user={user} />, url);

      await waitFor(() => {
         assertRendered();
         assertAppName("Prompt Manager");
         assertMenuItems();
      });

      expect(container).toMatchSnapshot();
   });

   it("Sidebar - sidebar collapsed - rendered test", async () => {
      const url = "/prompts";
      const { container } = renderWithSidebar(
         <Sidebar user={undefined} />,
         url,
         false
      );

      await waitFor(() => {
         assertRendered();
         assertAppName("PM");
         assertMenuItems();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("Sidebar functionality tests", () => {
   beforeEach(() => {
      window.matchMedia = ctestData.createMatchMedia(false);
   });

   const assertNavigateToMenuItem = async (menu: string, url: string) => {
      const promptsLink = screen.getByText(menu);
      await userEvent.click(promptsLink);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(url);
      });
   };

   it("Sidebar - navigation - test", async () => {
      const user = ntestData.user();
      const url = "/settings";
      renderWithSidebar(<Sidebar user={user} />, url);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual(url);
      });

      await assertNavigateToMenuItem("Prompts", "/prompts");
      await assertNavigateToMenuItem("Templates", "/templates");
      await assertNavigateToMenuItem("Favorites", "/favorites");
      await assertNavigateToMenuItem("Feedback", "/feedback");
      await assertNavigateToMenuItem("Invite People", "/invite-people");
      await assertNavigateToMenuItem("Settings", "/settings");
   });

   it("Sidebar - active menu item highlighted - test", async () => {
      const user = ntestData.user();
      const url = "/settings";
      renderWithSidebar(<Sidebar user={user} />, url);

      await waitFor(() => {
         assertRendered();
         assertMenuItemActive("Settings", true);
         assertMenuItemActive("Prompts", false);
         assertMenuItemActive("Templates", false);
      });
   });
});
