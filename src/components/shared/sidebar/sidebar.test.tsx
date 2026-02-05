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
   const appName = screen.getByText("KI Bibliothek");
   const homeLink = screen.getByTestId("home-link");

   assertInDocument(homeLink);
   assertInDocument(appName);
};

const assertMenuItems = () => {
   const groupApplication = screen.getByText("Application");
   const prompts = screen.getByTestId("menu-item-prompts");
   const library = screen.getByTestId("menu-item-library");
   const marketplace = screen.getByTestId("menu-item-marketplace");

   const groupOther = screen.getByText("Other");
   const feedback = screen.getByTestId("menu-item-feedback");
   const invitePeople = screen.getByTestId("menu-item-invite-people");
   const settings = screen.getByTestId("menu-item-settings");

   assertInDocument(groupApplication);
   assertInDocument(prompts);
   assertInDocument(library);
   assertInDocument(marketplace);

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

   it("Sidebar - sidebar collapsed - rendered test", async () => {
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
   });

   const assertNavigateToMenuItem = async (menu: string, url: string) => {
      const promptsLink = screen.getByText(menu);
      await userEvent.click(promptsLink);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(url);
      });
   };

   it("Sidebar - navigation - test", async () => {
      const user = dtestData.dLoginUser();
      const url = "/settings";
      renderWithSidebar(<Sidebar user={user} />, url);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual(url);
      });

      await assertNavigateToMenuItem("Prompts", "/prompts");
      await assertNavigateToMenuItem("Meine Bibliothek", "/library");
      await assertNavigateToMenuItem("Marktplatz", "/marketplace");
      await assertNavigateToMenuItem("Feedback", "/feedback");
      await assertNavigateToMenuItem("Personen einladen", "/invite-people");
      await assertNavigateToMenuItem("Einstellungen", "/settings/general");
   });

   it("Sidebar - active menu item highlighted - test", async () => {
      const user = dtestData.dLoginUser();
      const url = "/settings";
      renderWithSidebar(<Sidebar user={user} />, url);

      await waitFor(() => {
         assertRendered();
         assertMenuItemActive("Einstellungen", true);
         assertMenuItemActive("Prompts", false);
         assertMenuItemActive("Meine Bibliothek", false);
      });
   });

   it("Sidebar - home link clicked - test", async () => {
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
